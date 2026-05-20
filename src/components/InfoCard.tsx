import { BookOpen, UserCheck, Shuffle, Clock, ShieldAlert } from "lucide-react";

export default function InfoCard() {
  return (
    <div className="bg-white border border-sage/15 rounded-[32px] p-6 shadow-xs max-w-full">
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="w-5 h-5 text-sage" />
        <h3 className="font-serif font-semibold text-slate-800 text-lg">Pravidla autorského workshopu</h3>
      </div>
      
      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
        Tato aplikace spravedlivě organizuje čas a pořadí mluvčích pro komentování povídek na základě následujících přísných pravidel:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="flex gap-3">
          <div className="flex-none p-2 bg-sage/10 rounded-xl h-fit">
            <Clock className="w-4 h-4 text-sage" />
          </div>
          <div>
            <h4 className="font-medium text-sm text-slate-800">Spravedlivý čas</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Celkový čas se rovnoměrně rozdělí mezi povídky. Navíc se ke každé povídce automaticky přičte <strong>5 minut</strong> jako rezerva či úvodní slovo.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-none p-2 bg-sage/10 rounded-xl h-fit">
            <UserCheck className="w-4 h-4 text-sage" />
          </div>
          <div>
            <h4 className="font-medium text-sm text-slate-800">Nejvýše 5 mluvčích</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Ke každému dílu se vyjádří maximálně 5 ostatních autorů. Výběr je balancován tak, aby všichni mluvili vyváženě a spravedlivě.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-none p-2 bg-sage/10 rounded-xl h-fit">
            <Shuffle className="w-4 h-4 text-sage" />
          </div>
          <div>
            <h4 className="font-medium text-sm text-slate-800">Unikátní pořadí</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Pořadí mluvčích se nikdy nopakuje. Každý autor je u jedné povídky <strong>první</strong>, u jiné <strong>poslední</strong> a jeho prostřední pozice jsou pokaždé jiné.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-none p-2 bg-sage/10 rounded-xl h-fit">
            <ShieldAlert className="w-4 h-4 text-sage" />
          </div>
          <div>
            <h4 className="font-medium text-sm text-slate-800">Flexibilní odchody</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Pokud autor odejde z kurzu, lze jej odebrat. Jeho povídka se smaže, z ostatních diskuzí zmizí, ale <strong>pořadí ostatních zůstává nezměněno</strong>. Čas se automaticky přepočítá!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
