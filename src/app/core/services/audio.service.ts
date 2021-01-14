import {Injectable} from '@angular/core';
import {Howl} from 'howler';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private audio: Howl;

  constructor() {
  }

  play(fileUrl: string) {
    this.audio = new Howl({
      src: fileUrl,
      html5: true,
      // continuar
    });
  }
}
