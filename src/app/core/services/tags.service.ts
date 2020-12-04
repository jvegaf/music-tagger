import { MusicTag } from '../models/MusicTag';
import { Injectable } from '@angular/core';
import { ArtImage } from '../models/ArtImage';
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

  async addCoverArtToTag(tracklist: MusicTag[], itemSelected: number, imgUrl: string): Promise<MusicTag[]> {
    return await this.els.ipcRenderer.invoke('imageUrl-to-buffer', imgUrl).then(buffer => {
      tracklist[itemSelected].imageTag = {
        description: '', imageBuffer: buffer, mime: 'jpeg', type: {id: 3, name: 'front cover'}
      };
      return tracklist;
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

  updateTags(trackItems: MusicTag[], newItem: any): MusicTag[] {
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
}
