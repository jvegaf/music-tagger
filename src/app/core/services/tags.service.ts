import {Track} from '../models/Track';
import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import { v4 } from 'uuid';

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
    const name = item.filename.slice(0, -4);
    const elements = name.split('-').map(element => {
      return element.trim();
    });

    if (elements.length > 1) {
      item.artist = elements[0];
      item.title = elements.slice(1).join('');
      // this.els.ipcRenderer.send('save-tags', item);
      return item;
    }

    item.title = elements[0];
    // this.els.ipcRenderer.send('save-tags', item);
    return item;
  }

  async addCoverArtToTag(item: Track, imgUrl: string): Promise<void> {
    // return await this.els.ipcRenderer.invoke('imageTag-from-Url', imgUrl).then(imgTag => {
    //   item.artwork = imgTag;
    //   item.hasCover = true;
    //   return;
    // });
  }

  // getDataSource(tagItems: any): Track[] {
  //   return tagItems.map(item => {
  //     return new Track(
  //       item.fileIndex,
  //       item.titleTag,
  //       item.artistTag,
  //       item.albumTag,
  //       item.genreTag,
  //       item.yearTag,
  //       item.bpmTag,
  //       item.keyTag,
  //       item.imageTag,
  //       item.filename,
  //       item.filepath
  //     );
  //   });
  // }

  createTrack(item: any): Track {
    return new Track(
      v4(),
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
  }
}
