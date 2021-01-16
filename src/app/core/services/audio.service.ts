import {Injectable} from '@angular/core';
import {Howl} from 'howler';
import { Track } from '../models/Track';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private audio: Howl;
  private track$;
  track: Track;
  progress: number;
  private progress$;
  private intervalObj;


  constructor() {
    this.track$ = new Subject<Track>();
    this.progress$ = new Subject<number>();
  }

  play(track: Track) {
    if (track.id === this.track?.id) { return; }
    if (this.audio?.playing()) { this.stop(); }
    this.track = track;
    this.track$.next(this.track);
    this.audio = new Howl({
      src: this.track.filepath,
      autoplay: true,
      html5: true,
      onload: () => {
        this.seekTo(20);
      }
    });

    this.intervalObj = setInterval(() => {
      this.updateProgress();
    }, 1000);
  }

  stop() {
    clearInterval(this.intervalObj);
    this.audio.unload();
    this.track = null;
    this.track$.next(this.track);
  }


  getTrack$(): Observable<Track> {
    return this.track$.asObservable();
  }

  getProgress$(): Observable<number> {
    return this.progress$.asObservable();
  }

  seekTo(position: number) {
    this.progress = position;
    this.progress$.next(this.progress);
    const time = this.audio.duration() * (position / 100);
    this.audio.seek(time);
  }

  updateProgress() {
    const seek = this.audio.seek();
    this.progress = ( seek as number / this.audio.duration() ) * 100;
    this.progress$.next(this.progress);
  }

  seekBack() {
    this.seekTo(this.progress - 10);
  }

  seekAdv() {
    this.seekTo(this.progress + 10);
  }
}
