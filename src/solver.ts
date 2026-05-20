import { Author, Story } from "./types";

/**
 * Backtracking solver to find a fair, randomized workshop schedule.
 * 
 * General rules satisfied:
 * - K = min(5, N-1) speakers per story.
 * - S[i][p] != i (author of story i does not speak on their own story).
 * - Row elements are distinct (no author speaks twice on the same story).
 * - Column elements are a permutation of 0..N-1 (each author speaks exactly once at position p).
 * 
 * Because each author speaks exactly once at each position p ∈ 0..K-1:
 * 1. Each author is first exactly once (position 0 is used exactly once across all stories they speak in).
 * 2. Each author is last exactly once (position K-1 is used exactly once across all stories they speak in).
 * 3. Mid positions are different, and no position is ever repeated (each position used exactly once).
 * 
 * Perfect fairness!
 */
export function solveWorkshop(authors: Author[]): Story[] {
  const N = authors.length;
  if (N < 2) return [];

  const K = Math.min(5, N - 1);

  const grid: number[][] = Array.from({ length: N }, () => Array(K).fill(-1));
  const colUsed = Array.from({ length: K }, () => Array(N).fill(false));
  const rowUsed = Array.from({ length: N }, () => Array(N).fill(false));

  function backtrack(row: number, col: number): boolean {
    if (col === K) {
      return backtrack(row + 1, 0);
    }
    if (row === N) {
      return true;
    }

    // Generate random candidate indices 0..N-1
    const candidates = Array.from({ length: N }, (_, idx) => idx);
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    for (const val of candidates) {
      // 1. Cannot speak on own story
      if (val === row) continue;

      // 2. Col permutation: each author speaks exactly once at this column position
      if (colUsed[col][val]) continue;

      // 3. Row unique: each author speaks at most once inside this story
      if (rowUsed[row][val]) continue;

      // Place value
      grid[row][col] = val;
      colUsed[col][val] = true;
      rowUsed[row][val] = true;

      if (backtrack(row, col + 1)) {
        return true;
      }

      // Backtrack (undo)
      grid[row][col] = -1;
      colUsed[col][val] = false;
      rowUsed[row][val] = false;
    }

    return false;
  }

  const success = backtrack(0, 0);
  if (!success) {
    // Highly unlikely to fail for N <= 10, but have a fallback greedy schedule just in case
    return generateFallbackGreedy(authors);
  }

  // Convert grid indices to Story objects
  return authors.map((author, index) => {
    const speakers = grid[index].map(idx => authors[idx].id);
    return {
      id: `story-${author.id}`,
      authorId: author.id,
      authorName: author.name,
      title: `Povídka: ${author.name}`,
      speakers
    };
  });
}

function generateFallbackGreedy(authors: Author[]): Story[] {
  const N = authors.length;
  const K = Math.min(5, N - 1);
  return authors.map((author, i) => {
    const list: string[] = [];
    for (let p = 1; p <= K; p++) {
      const speakerIdx = (i + p) % N;
      list.push(authors[speakerIdx].id);
    }
    return {
      id: `story-${author.id}`,
      authorId: author.id,
      authorName: author.name,
      title: `Povídka: ${author.name}`,
      speakers: list,
    };
  });
}
