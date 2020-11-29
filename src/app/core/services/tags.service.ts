import { MusicTag } from '../models/MusicTag';
import { Injectable } from '@angular/core';
import { ArtImage } from '../models/ArtImage';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor() {
  }

  getTagsFromFilenames(items: MusicTag[]): MusicTag[] {
    return items.map(item => {
      return this.convertFilenameToTags(item);
    });
  }

  convertFilenameToTags(item: MusicTag): MusicTag {
    const name = item.filename.slice(0, -4);
    const elements = name.split('-').map(element => {
      return element.trim();
    });
    if (elements.length > 1) {
      item.artistTag = elements[0];
      item.titleTag = elements.slice(1).join('');
      return item;
    }
    item.titleTag = elements[0];
    return item;
  }

  addCoverArtToTag(itemSelected: MusicTag, imgBuffer: Buffer) {
    const imageTag: ArtImage = {
      description: '', imageBuffer: imgBuffer, mime: 'jpeg', type: {id: 3, name: 'front cover'}
    };
    const item = itemSelected;
    item.imageTag = imageTag;
    return item;
  }
}
