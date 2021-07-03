import { ArtImage } from './ArtImage';
import { v4 } from 'uuid';

export class Track {
  id: string;
  fileIndex: number;
  titleTag: string;
  artistTag: string;
  albumTag: string;
  genreTag: string;
  yearTag: number;
  bpmTag: number;
  keyTag: string;
  imageTag: ArtImage;
  hasCover: boolean;
  filename: string;
  filepath: string;

  constructor(
    fileIndex: number,
    titleTag: string,
    artistTag: string,
    albumTag: string,
    genreTag: string,
    yearTag: number,
    bpmTag: number,
    keyTag: string,
    imageTag: ArtImage,
    filename: string,
    filepath: string) {
    this.fileIndex = fileIndex;
    this.titleTag = titleTag;
    this.artistTag = artistTag;
    this.albumTag = albumTag;
    this.genreTag = genreTag;
    this.yearTag = yearTag;
    this.bpmTag = bpmTag;
    this.keyTag = keyTag;
    this.imageTag = imageTag;
    this.hasCover = this.imageTag !== undefined;
    this.filename = filename;
    this.filepath = filepath;
    this.id = v4();
  }
}
