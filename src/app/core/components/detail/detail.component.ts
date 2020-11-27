import { ArtDetailComponent } from './../art-detail/art-detail.component';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MusicTag } from '../../models/MusicTag';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements AfterViewInit {

  @Input() item: MusicTag;

  @ViewChild(ArtDetailComponent)
  artDetailComp: ArtDetailComponent;

  constructor() { }

  ngAfterViewInit(): void {
    console.log('after-view');
    console.log(this.item);
    if (this.item.imageTag) {
      this.artDetailComp.coverArt(this.item.imageTag.imageBuffer);
    }
  }

}
