export interface Author {
  id: string;
  name: string;
}

export interface Story {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  speakers: string[]; // List of author IDs in order of speaking
}

export interface WorkshopState {
  authors: Author[];
  activeAuthorIds: string[];
  stories: Story[]; // Holds the full generated stories list
  totalTime: number; // Overall time inside workshop
  isGenerated: boolean;
}
