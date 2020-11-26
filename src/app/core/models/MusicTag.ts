import { ArtImage } from './ArtImage';
export interface MusicTag {
  fileIndex: number;
  titleTag: string;
  artistTag: string;
  albumTag: string;
  genreTag: string;
  yearTag: number;
  bpmTag: number;
  keyTag: string;
  imageTag?: ArtImage;
  filename: string;
  filepath: string;
}
