import { Injectable } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Track} from '../models/Track';

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {

  constructor(private sanitizer: DomSanitizer) { }

  getImgSource(track: Track) {
    if (track.artwork?.imageBuffer) {
      const blob = new Blob( [track.artwork.imageBuffer], { type: `image/${track.artwork.mime}` });
      const artUrl = URL.createObjectURL(blob);
      return  this.sanitizer.bypassSecurityTrustUrl(artUrl);
    }
    return 'assets/album-art-placeholder.png';
  }
}
