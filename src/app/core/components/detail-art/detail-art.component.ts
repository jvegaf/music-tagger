import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ArtImage } from '../../models/ArtImage';

@Component({
  selector: 'app-detail-art',
  templateUrl: './detail-art.component.html',
  styleUrls: ['./detail-art.component.scss']
})
export class DetailArtComponent implements OnInit {

  imgSrc: SafeUrl | string = 'assets/album-art-placeholder.png';

  @Output() clickCover = new EventEmitter();

  constructor( private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  coverArt(imageTag: ArtImage) {
    const blob = new Blob( [imageTag.imageBuffer], { type: `image/${imageTag.mime}` });
    const artUrl = URL.createObjectURL(blob);
    this.imgSrc = this.sanitizer.bypassSecurityTrustUrl(artUrl);
  }

  artClicked() {
    this.clickCover.emit();
  }
}
