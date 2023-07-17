export interface ISong {
  id: string;
  filename: string;
  title?: string;
  artist?: string;
  genre?: string;
  mood?: string;
  categories: string[];
}
