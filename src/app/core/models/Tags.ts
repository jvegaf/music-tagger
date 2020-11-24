import { ArtImage } from './ArtImage';

export interface Tags {
  title: string;
  artist: string;
  album: string;
  year: number;
  bpm: number;
  initialKey: string;
  image?: ArtImage;
}
