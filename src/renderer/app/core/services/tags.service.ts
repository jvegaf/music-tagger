import {Track} from '../models/Track';
import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {log} from 'util';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(private els: ElectronService) {
  }

  getTagsFromFilenames(items: Track[]): Track[] {
    return items.map(item => {
      return this.convertFilenameToTags(item);
    });
  }

  convertFilenameToTags(item: Track): Track {
    const name = item.filename.slice(0, -4).replace(/_/g, ' ');
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

  async addCoverArtToTag(item: Track, imgUrl: string): Promise<void> {
    return await this.els.ipcRenderer.invoke('imageTag-from-Url', imgUrl).then(imgTag => {
      item.imageTag = imgTag;
      item.hasCover = true;
      return;
    });
  }

  getDataSource(tagItems: any): Track[] {
    return tagItems.map(item => {
      return new Track(
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

  updateTrackItems(trackItems: Track[], item: any): Track[] {
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
    });
  }

  removeItem(item: Track, tracklist: Track[]): Track[] {
    return tracklist.map(tag => {
      if (tag !== item){
        return tag;
      }
    });
  }
}
