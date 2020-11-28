import { Component, OnInit, EventEmitter, Input,  Output } from '@angular/core';
import { MusicTag } from '../../models/MusicTag';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  @Input() item: MusicTag;
  @Output() clickCover = new EventEmitter();
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {}

  coverArt() {
    if (this.item.imageTag?.imageBuffer) {
      const blob = new Blob( [this.item.imageTag.imageBuffer], { type: `image/${this.item.imageTag.mime}` });
      const artUrl = URL.createObjectURL(blob);
      return  this.sanitizer.bypassSecurityTrustUrl(artUrl);
    }
    return 'assets/album-art-placeholder.png';
  }

  artClicked() {
    this.clickCover.emit();
  }

}
