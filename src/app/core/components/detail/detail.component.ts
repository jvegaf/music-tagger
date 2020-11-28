import { DetailArtComponent } from '../detail-art/detail-art.component';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MusicTag } from '../../models/MusicTag';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements AfterViewInit {

  @Input() item: MusicTag;

  @ViewChild(DetailArtComponent)
  artDetailComp: DetailArtComponent;

  @Output() coverClick = new EventEmitter();
  constructor() { }

  ngAfterViewInit(): void {
    console.log('after-view');
    console.log(this.item);
    if (this.item.imageTag?.imageBuffer) {
      this.artDetailComp.coverArt(this.item.imageTag);
    }
  }

  clickCover() {
    this.coverClick.emit();
  }

}
