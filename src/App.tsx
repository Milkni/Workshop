import { useState, useId } from "react";
import { BookOpen, Clock, Users, Play, RefreshCw, PenTool, LayoutGrid, CheckSquare, Sparkles, LogOut, ArrowLeft, RotateCcw, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Author, Story, WorkshopState } from "./types";
import { solveWorkshop } from "./solver";
import { formatMinutesCzech } from "./utils/time";

// Sub-components
import InfoCard from "./components/InfoCard";
import AuthorInput from "./components/AuthorInput";
import StoryCard from "./components/StoryCard";

export default function App() {
  const [totalTime, setTotalTime] = useState<number>(120); // default to 120 minutes
  const [authors, setAuthors] = useState<Author[]>([]);
  const [activeAuthorIds, setActiveAuthorIds] = useState<string[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick fill samples
  const sampleNames = ["Anna", "Borek", "Cyril", "Dana", "Ema", "Filip"];

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleAddAuthor = (name: string) => {
    const newAuthor: Author = { id: generateId(), name };
    setAuthors((prev) => [...prev, newAuthor]);
  };

  const handleRemoveStagingAuthor = (id: string) => {
    setAuthors((prev) => prev.filter((a) => a.id !== id));
  };

  const handleFillSampleAuthors = () => {
    const prefilled: Author[] = sampleNames.map((name) => ({
      id: generateId(),
      name,
    }));
    setAuthors(prefilled);
    setErrorMessage(null);
  };

  // Main Generator Trigger
  const handleGenerate = () => {
    if (authors.length < 2) {
      setErrorMessage("K vytvoření programu přidejte alespoň 2 autory.");
      return;
    }
    setErrorMessage(null);

    // Solve for schedule
    const generatedStories = solveWorkshop(authors);
    setStories(generatedStories);
    setActiveAuthorIds(authors.map((a) => a.id));
    setIsGenerated(true);
    setSelectedStoryIndex(0);
  };

  // Handler for custom story title editing
  const handleUpdateStoryTitle = (storyId: string, newTitle: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, title: newTitle } : s))
    );
  };

  // Handler for departed author (Rule 4)
  const handleDepartAuthor = (authorId: string) => {
    // 1. Remove from active ids
    const updatedActiveIds = activeAuthorIds.filter((id) => id !== authorId);
    setActiveAuthorIds(updatedActiveIds);

    // If currently selected story belongs to the departed author, shift focus
    const storyIdOfDeparted = `story-${authorId}`;
    if (stories[selectedStoryIndex]?.id === storyIdOfDeparted) {
      // Find another active story index
      const remainingStories = stories.filter((s) => s.authorId !== authorId);
      if (remainingStories.length > 0) {
        const nextActiveStoryId = remainingStories[0].id;
        const nextIndex = stories.findIndex((s) => s.id === nextActiveStoryId);
        setSelectedStoryIndex(nextIndex >= 0 ? nextIndex : 0);
      }
    }
  };

  // Handler to return a departed author
  const handleReturnAuthor = (authorId: string) => {
    if (!activeAuthorIds.includes(authorId)) {
      setActiveAuthorIds((prev) => [...prev, authorId]);
    }
  };

  // Return to Setup mode
  const handleResetToSetup = () => {
    setIsGenerated(false);
  };

  // Active authors details helper
  const activeAuthorsList = authors.filter((a) => activeAuthorIds.includes(a.id));
  const departedAuthorsList = authors.filter((a) => !activeAuthorIds.includes(a.id));

  // Time calculations
  const totalActiveAuthorsCount = activeAuthorsList.length;
  // 1) "čas na hodnocení povídek musí být včetně pětiminutové rezervy."
  // Total block time per story is exactly totalTime / totalActiveAuthorsCount.
  const timePerStoryTotal = totalActiveAuthorsCount > 0 ? totalTime / totalActiveAuthorsCount : 0;

  // Filter stories for only active authors (Rule 4: departed author's story disappears)
  const activeStories = stories.filter((s) => activeAuthorIds.includes(s.authorId));

  return (
    <div className="min-h-screen bg-natural-bg text-slate-800 p-4 md:p-8 flex flex-col items-center">
      
      {/* Container wrapper specifying grid bounding */}
      <div className="w-full max-w-6xl flex-1 flex flex-col gap-6">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center bg-white border border-sage/15 rounded-[32px] p-6 shadow-sm gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sage/10 rounded-2xl">
              <BookOpen className="w-6 h-6 text-sage" />
            </div>
            <div className="text-left">
              <span className="text-[10px] bg-sage/15 text-sage uppercase tracking-widest px-2 py-0.5 rounded-md font-bold font-mono">
                Literární klub
              </span>
              <h1 id="app-title" className="font-serif font-bold text-2xl text-slate-900 tracking-tight mt-1">
                Autorský Workshop
              </h1>
              <p className="text-xs text-slate-500">
                Spravedlivá časomíra a rozpis mluvčích pro hodnocení povídek
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">Časová zóna: </span>
            <span className="text-xs font-bold font-mono px-3 py-1 bg-natural-bg border border-sage/15 text-sage rounded-xl">
              UTC
            </span>
          </div>
        </header>

        {/* SETUP SCREEN */}
        {!isGenerated && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Setup panel - 7 Columns */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Timing input and prefill */}
              <div className="bg-white rounded-[32px] border border-sage/15 p-6 shadow-sm text-left">
                <div className="flex items-center justify-between border-b border-sage/10 pb-3 mb-4">
                  <h3 className="font-serif font-bold text-slate-800 text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-sage" />
                    <span>Časová dotace</span>
                  </h3>
                  <button
                    onClick={handleFillSampleAuthors}
                    className="text-xs text-sage hover:bg-sage/10 border border-sage/20 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Použít 6 ukázkových jmen</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="total-time-input" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Celkový vyhrazený čas na workshop (v minutách)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        id="total-time-input"
                        type="number"
                        min="10"
                        max="600"
                        className="w-32 px-4 py-2.5 bg-natural-bg/50 border border-sage/20 rounded-xl font-mono text-center text-slate-800 focus:outline-none focus:ring-2 focus:ring-sage/60 font-bold"
                        value={totalTime}
                        onChange={(e) => setTotalTime(Math.max(10, parseInt(e.target.value) || 0))}
                      />
                      <span className="text-sm font-semibold text-slate-700 font-serif">
                        minut (= {formatMinutesCzech(totalTime)})
                      </span>
                    </div>
                  </div>

                  <div className="bg-sage/10 border border-sage/15 p-4 rounded-2xl flex gap-3 text-xs text-sage-dark leading-relaxed">
                    <PenTool className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                    <div>
                      Ke každé vygenerované povídce bude připočtena <strong>pětiminutová rezerva</strong> na úvod/čtení. Zbylý čas bude rovnoměrně rozdělen mezi mluvčí.
                    </div>
                  </div>
                </div>
              </div>

              {/* Informative description */}
              <InfoCard />
            </div>

            {/* Right Setup panel - 5 Columns */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              <AuthorInput
                authors={authors}
                onAddAuthor={handleAddAuthor}
                onRemoveAuthor={handleRemoveStagingAuthor}
              />

              {/* Launcher block */}
              <div className="bg-white rounded-[32px] border border-sage/15 p-6 text-left shadow-sm">
                <h4 className="font-serif font-bold text-slate-800 text-base mb-2">Připravenost k zahájení</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Pro spuštění workshopu musíte zadat alespoň dva autory, aby si mohli vzájemně přečíst a zhodnotit své povídky.
                </p>

                {errorMessage && (
                  <div className="mb-4 bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-center gap-2 text-rose-750 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={authors.length < 2}
                  className="w-full py-4 bg-sage hover:bg-sage-dark active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-full transition-all shadow-md shadow-sage/10 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed hover:translate-y-[-1px]"
                >
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>Generovat a zahájit workshop</span>
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* WORKSHOP ACTIVE VIEW */}
        {isGenerated && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Column: Story list (with embedded timer) - 7 columns */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Story list section */}
              <div className="bg-white rounded-[32px] border border-sage/15 p-6 shadow-sm text-left">
                <div className="flex items-center justify-between border-b border-sage/10 pb-3.5 mb-4">
                  <div>
                    <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
                      <LayoutGrid className="w-5 h-5 text-sage" />
                      <span>Seznam povídek</span>
                    </h3>
                    <p className="text-xs text-slate-500">Kliknutím vyberete a zobrazíte podrobnosti o rozdělení času</p>
                  </div>
                  <span className="text-xs font-mono font-semibold bg-sage/10 text-sage px-2.5 py-1 rounded-full">
                    Aktivních {activeStories.length} z {stories.length}
                  </span>
                </div>

                {activeStories.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm border-2 border-dashed border-sage/20 rounded-2xl bg-natural-bg/10">
                    Všichni autoři odešli z workshopu.
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1">
                    {activeStories.map((story, idx) => {
                      const originalIdx = stories.findIndex((s) => s.id === story.id);
                      const isCurrent = originalIdx === selectedStoryIndex;

                      return (
                        <StoryCard
                          key={story.id}
                          story={story}
                          index={idx + 1}
                          activeAuthors={activeAuthorsList}
                          totalTime={totalTime}
                          isActive={isCurrent}
                          onSelect={() => setSelectedStoryIndex(originalIdx)}
                          onUpdateTitle={(newTitle) => handleUpdateStoryTitle(story.id, newTitle)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Absences & Master Controls - 5 columns */}
            <div className="lg:col-span-5 flex flex-col gap-6">

              {/* Rule 4 Departures Dashboard */}
              <div className="bg-white rounded-[32px] border border-sage/15 p-6 shadow-sm text-left">
                <div className="border-b border-sage/10 pb-3 mb-4 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-slate-800 text-base flex items-center gap-2">
                    <LogOut className="w-5 h-5 text-rose-600" />
                    <span>Absence & opuštění kurzu</span>
                  </h3>
                  <span className="text-[10px] text-sage/70 font-mono">Předpis mluvčích zůstává spravedlivý</span>
                </div>

                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Pokud některý z autorů musí předčasně odejít, označte jej zde. Jeho povídka zmizí, mluvčí se vyřadí ze seznamů, ale <strong>původní pořadí ostatních se nezmění</strong>! Zbylý čas se spravedlivě zvětší.
                </p>

                {/* Grid inputs for departures */}
                <div className="space-y-3">
                  {authors.map((author) => {
                    const isActive = activeAuthorIds.includes(author.id);
                    return (
                      <div
                        key={author.id}
                        className="flex items-center justify-between p-3 bg-natural-bg/30 rounded-xl border border-sage/10 text-sm transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              isActive ? "bg-emerald-600" : "bg-rose-550"
                            }`}
                          />
                          <span className={`font-semibold ${isActive ? "text-slate-800" : "text-slate-400 line-through"}`}>
                            {author.name}
                          </span>
                        </div>

                        {isActive ? (
                          <button
                            onClick={() => handleDepartAuthor(author.id)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-full text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Odešel z kurzu 👋
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReturnAuthor(author.id)}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Vrátit do kurzu ↩️
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {departedAuthorsList.length > 0 && (
                  <div className="mt-4 bg-sage/10 border border-sage/15 rounded-2xl p-3.5 flex gap-2 text-xs text-sage-dark leading-relaxed">
                    <AlertTriangle className="w-4 h-4 text-sage flex-shrink-0" />
                    <div>
                      Změna počtu účastníků automaticky přepočítala časový limit: jedna povídka má nyní{" "}
                      <strong>{formatMinutesCzech(timePerStoryTotal)}</strong> na diskuzi (původně{" "}
                      {formatMinutesCzech(totalTime / authors.length)}).
                    </div>
                  </div>
                )}
              </div>

              {/* Master Control Board */}
              <div className="bg-white rounded-[32px] border border-sage/15 p-6 text-left shadow-sm">
                <h4 className="font-serif font-bold text-slate-800 text-base mb-2">Správa celého workshopu</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Pokud potřebujete opravit složení mluvčích, změnit celkový čas nebo doplnit jména autorů, můžete se bezpečně vrátit k nastavení. Vaše současné seznamy jmen zůstanou předvyplněné.
                </p>

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={handleResetToSetup}
                    className="w-full py-3 bg-natural-bg hover:bg-sage/10 text-sage border border-sage/20 font-bold rounded-full text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Ukončit a upravit autory</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setStories(solveWorkshop(authors));
                      setSelectedStoryIndex(0);
                    }}
                    className="w-full py-3 bg-sage hover:bg-sage-dark text-white font-bold rounded-full text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-sage/10"
                  >
                    <RefreshCw className="w-3.5 h-3.5 font-bold" />
                    <span>Přemíchat pořadí</span>
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
