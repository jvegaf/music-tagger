/**
 * App models
 */

export interface Art {
  mime: string;
  type: {
    id: number;
    name: string;
  };
  description: string;
  data: Buffer;
}
export interface Track {
  _id: string;
  album: string;
  artist: string;
  duration: number;
  genre: string;
  loweredMetas: {
    artist: string;
    album: string;
    title: string;
    genre: string;
  };
  path: string;
  title: string;
  year: number | null;
  art?: Art;
}
