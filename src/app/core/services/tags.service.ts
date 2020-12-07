import { MusicTag } from '../models/MusicTag';
import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(private els: ElectronService) {
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

  async addCoverArtToTag(item: MusicTag, imgUrl: string): Promise<void> {
    return await this.els.ipcRenderer.invoke('imageTag-from-Url', imgUrl).then(imgTag => {
      item.imageTag = imgTag;
      return;
    });
  }

  getDataSource(tagItems: any): MusicTag[] {
    return tagItems.map(item => {
      return new MusicTag(
        item.fileIndex,
        item.titleTag,
        item.artistTag,
        item.albumTag,
        item.genreTag,
        item.yearTag,
        item.bpmTag,
        item.keyTag,
        item.imageTag,
        item.filename,
        item.filepath
      );
    });
  }

  updateTag(trackItems: MusicTag[], newItem: MusicTag): MusicTag[] {
    return trackItems.map(tag => {
      if (tag.fileIndex === newItem.fileIndex) {
        tag.titleTag = newItem.titleTag;
        tag.artistTag = newItem.artistTag;
        tag.albumTag = newItem.albumTag;
        tag.genreTag = newItem.genreTag;
        tag.yearTag = newItem.yearTag;
        tag.bpmTag = newItem.bpmTag;
        tag.keyTag = newItem.keyTag;
        tag.imageTag = newItem.imageTag;
      }
      return tag;
    });
  }

  updateTags(trackItems: MusicTag[], newItems: MusicTag[]): MusicTag[] {
      newItems.forEach(item => trackItems = this.updateTag(trackItems, item));
      return trackItems;
  }
}
