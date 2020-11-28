import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { ArtImage } from '../../models/ArtImage';

@Component({
  selector: 'app-art-detail',
  templateUrl: './art-detail.component.html',
  styleUrls: ['./art-detail.component.scss']
})
export class ArtDetailComponent implements OnInit {

  imgSrc: SafeUrl | string = 'assets/album-art-placeholder.png';

  constructor( private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  coverArt(imageTag: ArtImage) {
    const blob = new Blob( [imageTag.imageBuffer], { type: `image/${imageTag.mime}` });
    const artUrl = URL.createObjectURL(blob);
    this.imgSrc = this.sanitizer.bypassSecurityTrustUrl(artUrl);
  }

}
