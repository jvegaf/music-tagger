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
  selectedIndex: number;
  sortedItems: MusicTag[];

  constructor() { }

  ngOnInit(): void {
  }

  selectPrev(): void {
    if (this.selectedIndex > 0) this.selectedIndex--;
    const index = this.sortedItems[this.selectedIndex].fileIndex;
    this.selectedItems = [this.items[index]];
  }

  selectNext(): void {
    if (this.selectedIndex < this.sortedItems.length) this.selectedIndex++;
    const index = this.sortedItems[this.selectedIndex].fileIndex;
    this.selectedItems = [this.items[index]];
  }

  itemClicked() {
    this.showDetail.emit();
  }

  sortedChange(items: MusicTag[]){
    this.sortedItems = items;
  }

  selectedChange(){
    for (let i=0; i<this.sortedItems.length; i++){
      if (this.selectedItems[0].fileIndex === this.sortedItems[i].fileIndex){
        this.selectedIndex = i;
        break;
      }
    }
  }
}
