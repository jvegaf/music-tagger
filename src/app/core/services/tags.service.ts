import { Track } from './../models/Track';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor() { }

  getTagsFromFilenames(items: Track[]): Track[] {
    return items.map(item => {
      return this.convertFilenameToTags(item);
    });
  }

  convertFilenameToTags(item: Track): Track {
    const name = item.filename.slice(0, -4);
    const elements = name.split('-').map(element => {
      return element.trim();
    });
    item.tags.artist = elements[0];
    item.tags.title = elements[1];
    return item;
  }
}
