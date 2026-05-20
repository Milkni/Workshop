import { Edit3, Check, Clock, User, ArrowRight, BookOpen } from "lucide-react";
import React, { useState } from "react";
import { Story, Author } from "../types";
import { formatMinutesCzech } from "../utils/time";

interface StoryCardProps {
  key?: React.Key;
  story: Story;
  index: number;
  activeAuthors: Author[];
  totalTime: number;
  isActive: boolean;
  onSelect: () => void;
  onUpdateTitle: (newTitle: string) => void;
}

export default function StoryCard({
  story,
  index,
  activeAuthors,
  totalTime,
  isActive,
  onSelect,
  onUpdateTitle,
}: StoryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(story.title);

  // Filter speakers to only active authors
  const activeSpeakers = story.speakers.filter(id => activeAuthors.some(a => a.id === id));
  const totalActiveAuthorsCount = activeAuthors.length;
  
  // Čas na hodnocení povídek je včetně pětiminutové rezervy
  const totalStoryTime = totalActiveAuthorsCount > 0 ? totalTime / totalActiveAuthorsCount : 0;
  const baseStoryTime = Math.max(0, totalStoryTime - 5);
  
  const speakerCount = activeSpeakers.length;
  const speakerTimeMinutes = speakerCount > 0 ? baseStoryTime / speakerCount : 0;

  const handleSaveTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTitle.trim()) {
      onUpdateTitle(editedTitle.trim());
      setIsEditing(false);
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-[24px] border p-6 transition-all text-left ${
        isActive
          ? "bg-white border-sage shadow-md ring-2 ring-sage/15"
          : "bg-white/80 border-sage/15 hover:border-sage/40 hover:shadow-xs cursor-pointer"
      }`}
    >
      {/* Active Indicator Bar */}
      {isActive && (
        <div className="absolute top-0 bottom-0 left-0 w-2 bg-sage rounded-l-[24px]" />
      )}

      {/* Header with Title and Author */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex-1 min-w-0" onClick={(e) => isEditing && e.stopPropagation()}>
          {isEditing ? (
            <form onSubmit={handleSaveTitle} className="flex gap-2 max-w-full">
              <input
                type="text"
                className="flex-1 text-sm font-semibold text-[#1a1a1a] bg-natural-bg/40 border border-sage/20 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sage/60"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="p-1.5 bg-sage hover:bg-sage-dark text-white rounded-lg flex items-center justify-center cursor-pointer"
                title="Uložit"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2 group/title">
              <h4 className="font-serif font-bold text-slate-900 text-lg tracking-tight truncate">
                {index}. {story.title}
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-1 text-sage opacity-0 group-hover/title:opacity-100 rounded-md transition-colors hover:bg-sage/10 cursor-pointer"
                title="Upravit název"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <p className="text-xs text-slate-500 mt-1">
            Od autora: <strong className="text-slate-850 font-semibold">{story.authorName}</strong>
          </p>
        </div>

        {/* Total story block time badge */}
        <div className="flex items-center gap-1.5 bg-sage/10 px-3 py-1 text-sage rounded-full font-mono text-xs font-semibold shrink-0">
          <Clock className="w-3.5 h-3.5 text-sage" />
          <span>Celkem: {formatMinutesCzech(totalStoryTime)}</span>
        </div>
      </div>

      {/* Story Time Allocation Breakdown & Speakers Sequence */}
      <div className="mt-2 space-y-4">
        {/* Core breakdown table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-natural-bg/20 border border-sage/10 rounded-xl p-3.5 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sage/10 flex items-center justify-center text-sage shrink-0">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-slate-500 block">Příprava & čtení povídky</span>
              <strong className="font-semibold text-slate-900 font-mono">5 minut</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sage/10 flex items-center justify-center text-sage shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-slate-500 block">Doporučení od každého autora</span>
              <strong className="font-semibold text-slate-900 font-mono">
                {formatMinutesCzech(speakerTimeMinutes)} / řečník
              </strong>
            </div>
          </div>
        </div>

        {/* Speakers List */}
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold font-mono text-sage/80 block mb-2.5">
            PLÁN HODNOCENÍ PO SEKVENCÍCH:
          </span>

          <div className="space-y-2">
            {/* Stages: Active author reviews */}
            {activeSpeakers.length === 0 ? (
              <p className="text-xs text-rose-700 font-medium font-serif italic py-1">
                ⚠️ Žádný jiný aktivní autor není přítomen pro diskusi k této povídce.
              </p>
            ) : (
              activeSpeakers.map((speakerId, sIdx) => {
                const speakerName = activeAuthors.find((a) => a.id === speakerId)?.name || "Neznámý";
                const isFirst = sIdx === 0;
                
                return (
                  <div
                    key={speakerId}
                    className={`flex items-center p-2.5 rounded-xl border text-xs gap-3 transition-colors ${
                      isActive 
                        ? "bg-white border-sage/20 hover:bg-sage/5" 
                        : "bg-white/40 border-slate-100 hover:bg-natural-bg/20"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-[#5a5a40]/10 text-sage font-mono font-bold flex items-center justify-center text-[10px] shrink-0">
                      {sIdx + 1}
                    </span>
                    <span className="font-semibold text-slate-800 truncate">
                      {speakerName} <span className="text-[10px] text-slate-400 font-normal">({isFirst ? "zahajuje hodnocení" : "pokračuje"})</span>
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Highlight footer feedback */}
        {isActive && (
          <div className="text-[11px] text-[#5A5A40] bg-sage/5 border border-sage/10 p-2 rounded-xl text-center font-medium">
            ✨ Tato povídka je právě vybrána k diskusi. Projděte si body v uvedeném pořadí.
          </div>
        )}
      </div>
    </div>
  );
}
