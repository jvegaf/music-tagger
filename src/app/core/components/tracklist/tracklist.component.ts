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

  @Output() showDetail = new EventEmitter<MusicTag>();

  selectedItems = [];
  constructor() { }

  ngOnInit(): void {
  }

  selectPrev(): void {
    if (this.selectedItems.length > 1) { return; }
    const index = this.selectedItems[0].fileIndex - 1;
    this.selectedItems = [this.items[index]];
  }

  selectNext(): void {
    if (this.selectedItems.length > 1) { return; }
    const index = this.selectedItems[0].fileIndex + 1;
    if (index === this.items.length) { return ; }
    this.selectedItems = [this.items[index]];
  }

  itemClicked(item: MusicTag) {
    this.showDetail.emit(item);
  }
}
