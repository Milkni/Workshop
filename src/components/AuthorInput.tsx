import React, { useState } from "react";
import { UserPlus, Trash2, Users, AlertCircle } from "lucide-react";
import { Author } from "../types";

interface AuthorInputProps {
  authors: Author[];
  onAddAuthor: (name: string) => void;
  onRemoveAuthor: (id: string) => void;
}

export default function AuthorInput({
  authors,
  onAddAuthor,
  onRemoveAuthor,
}: AuthorInputProps) {
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = nameInput.trim();
    if (!trimmed) return;

    if (authors.some((a) => a.name.toLowerCase() === trimmed.toLowerCase())) {
      setError("Autor s tímto jménem již byl přidán.");
      return;
    }

    if (authors.length >= 10) {
      setError("Kapacita workshopu je omezena na maximálně 10 autorů.");
      return;
    }

    onAddAuthor(trimmed);
    setNameInput("");
  };

  return (
    <div className="bg-white rounded-[32px] border border-sage/15 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 border-b border-sage/10 pb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-sage" />
          <h3 className="font-serif font-semibold text-slate-800 text-lg">Autoři ({authors.length}/10)</h3>
        </div>
        <span className="text-xs bg-sage/10 text-sage px-2.5 py-1 rounded-full font-semibold">
          Max. 10 autorů
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2.5 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage/60 focus:border-sage/40 text-slate-700 bg-natural-bg/50 text-sm transition-all placeholder:text-slate-450"
            placeholder="Napište jméno autora (např. Anna)"
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              setError(null);
            }}
          />
          <button
            type="submit"
            disabled={authors.length >= 10}
            className="px-5 py-2.5 bg-sage hover:bg-sage-dark disabled:bg-slate-200 disabled:text-slate-450 text-white rounded-full text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:cursor-not-allowed shadow-sm hover:translate-y-[-1px]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Přidat</span>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-rose-700 text-xs mt-2 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {authors.length === 0 ? (
        <div className="py-8 text-center text-[#5A5A40]/50 text-sm border-2 border-dashed border-sage/20 rounded-2xl bg-natural-bg/20">
          Zatím nebyli přidáni žádní autoři.
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {authors.map((author, idx) => (
            <div
              key={author.id}
              className="flex items-center justify-between bg-natural-bg/30 hover:bg-sage/10 border border-sage/10 p-3 rounded-xl transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 flex items-center justify-center bg-sage text-white text-xs font-bold rounded-full font-serif">
                  {idx + 1}
                </span>
                <span className="font-semibold text-slate-800 text-sm">{author.name}</span>
              </div>
              <button
                type="button"
                className="p-1 px-2 text-sage/75 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                onClick={() => onRemoveAuthor(author.id)}
                title="Smazat autora"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
