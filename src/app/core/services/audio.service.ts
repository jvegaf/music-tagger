import {Injectable} from '@angular/core';
import {Howl} from 'howler';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private audio: Howl;
  private audioURL: string;

  constructor() {
  }

  play(fileUrl: string) {
    if (fileUrl === this.audioURL) { return; }
    if (this.audio?.playing()) { this.stop(); }
    this.audioURL = fileUrl;
    this.audio = new Howl({
      src: this.audioURL,
      html5: true,
      autoplay: true,
      onload: () => {
        this.audio.seek(100);
      }
    });
  }

  stop() {
    this.audio.unload();
  }
}
