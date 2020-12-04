import { MusicTag } from '../../models/MusicTag';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-tracklist',
  templateUrl: './tracklist.component.html',
  styleUrls: ['./tracklist.component.scss']
})
export class TracklistComponent implements OnInit {

  @Input() items: MusicTag[];

  @Output() showDetail = new EventEmitter<number>();

  selectedItems = [];
  constructor() { }

  ngOnInit(): void {
  }

  itemClicked(item: MusicTag) {
    this.showDetail.emit(item.fileIndex);
  }
}
