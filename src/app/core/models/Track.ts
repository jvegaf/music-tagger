import { ArtImage } from './ArtImage';
import { v4 } from 'uuid';

export class Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  year: number;
  bpm: number;
  key: string;
  artwork: ArtImage;
  filename: string;
  filepath: string;


  constructor(id: string,
              title: string,
              artist: string,
              album: string,
              genre: string,
              year: number,
              bpm: number,
              key: string,
              artwork: ArtImage,
              filename: string,
              filepath: string) {
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.genre = genre;
    this.year = year;
    this.bpm = bpm;
    this.key = key;
    this.artwork = artwork;
    this.filename = filename;
    this.filepath = filepath;
  }
}
