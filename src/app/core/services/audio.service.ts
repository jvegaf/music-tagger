import { Injectable } from '@angular/core';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private audio: Howl;

  constructor() {
    this.audio = new Howl({
      preload: false
    });
  }
}
