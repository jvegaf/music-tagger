import { Component, OnInit, EventEmitter, Input,  Output } from '@angular/core';
import { Track } from '../../models/Track';
import {ArtworkService} from '../../services/artwork.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  @Input() item: Track;
  @Output() clickCover = new EventEmitter();
  constructor(private artServ: ArtworkService) { }

  ngOnInit(): void {}

  coverArt() {
    return this.artServ.getImgSource(this.item);
  }

  artClicked() {
    this.clickCover.emit();
  }

}
