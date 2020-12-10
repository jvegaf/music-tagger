import {MusicTag} from '../models/MusicTag';
import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';

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
      this.els.ipcRenderer.send('save-tags', item);
      return item;
    }
    item.titleTag = elements[0];
    this.els.ipcRenderer.send('save-tags', item);
    return item;
  }

  async addCoverArtToTag(item: MusicTag, imgUrl: string): Promise<void> {
    return await this.els.ipcRenderer.invoke('imageTag-from-Url', imgUrl).then(imgTag => {
      item.imageTag = imgTag;
      item.hasCover = true;
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

  updateTrackItems(trackItems: MusicTag[], item: any): MusicTag[] {
    return trackItems.map(tag =>{
      if(tag.fileIndex === item.fileIndex) {
        tag.titleTag = item.titleTag;
        tag.artistTag = item.artistTag;
        tag.genreTag = item.genreTag;
        tag.yearTag = item.yearTag;
        tag.bpmTag = item.bpmTag;
        tag.keyTag = item.keyTag;
        tag.imageTag = item.imageTag;
        tag.hasCover = item.hasCover;
        tag.filename = item.filename;
        tag.filepath = item.filepath;
      }
      return tag;
    })
  }

  removeItem(item: MusicTag, trackItems: MusicTag[]) {
    return trackItems.map(tag => {
      if (tag.fileIndex !== item.fileIndex){
        return tag;
      }
    });
  }
}
