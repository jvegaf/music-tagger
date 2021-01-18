import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {Track} from '../models/Track';
import {Observable, Subject} from 'rxjs';
import {TagsService} from './tags.service';


@Injectable({
  providedIn: 'root'
})
export class TracksService {
  private tracks$;
  tracks: Track[] = [];

  constructor(private els: ElectronService, private tagServ: TagsService) {
    this.tracks$ = new Subject<Track[]>();

    this.els.ipcRenderer.on('tag-item', (event, item) => {
      this.addTrack(this.tagServ.createTrack(item));
    });

    this.els.ipcRenderer.on('track-updated', (event, item) => {
      this.updateTrack(item);
    });
  }

  addTrack(track: Track) {
    this.tracks.push(track);
    this.tracks$.next(this.tracks);
  }

  updateTrack(track: Track) {
    const idx = this.tracks.findIndex(x => x.id === track.id);
    this.tracks[idx] = track;
    this.tracks$.next(this.tracks);
  }

  removeTracks(tracks: Track[]) {
    this.tracks = this.tracks.filter(track => !tracks.includes(track));
    this.tracks$.next(this.tracks);
  }

  getTracks$(): Observable<Track[]> {
    return this.tracks$.asObservable();
  }

  async addItems() {
    const files = await this.els.ipcRenderer.invoke('open-folder');
    if (files === null) { return; }
    files.forEach(file => this.els.ipcRenderer.send('get-tags', file));
  }

  addDropedItems(filepaths: string[]) {
    filepaths.forEach(filepath => this.els.ipcRenderer.send('get-tags', filepath));
  }

  findOnlineTags(tracks: Track[]) {
    tracks.forEach(track => this.els.ipcRenderer.send('find-tags', track));
  }

  extractTags(tracks: Track[]) {
    tracks.forEach(track =>{
      const updatedTrack = this.tagServ.convertFilenameToTags(track);
      this.updateTrack(updatedTrack);
    });
  }
}
