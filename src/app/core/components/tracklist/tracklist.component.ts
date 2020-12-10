import {MusicTag} from '../../models/MusicTag';
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
  @Output() menuActions = new EventEmitter<string>();

  selectedItems = [];
  selectedIndex: number;
  sortedItems: number[];

  constructor() {
  }

  ngOnInit(): void {
  }

  selectPrev(): void {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
    const index = this.sortedItems[this.selectedIndex];
    this.selectedItems = [this.items[index]];
  }

  selectNext(): void {
    if (this.selectedIndex < this.sortedItems.length) {
      this.selectedIndex++;
    }
    const index = this.sortedItems[this.selectedIndex];
    this.selectedItems = [this.items[index]];
  }

  itemClicked() {
    this.showDetail.emit();
  }

  actionTrigged(selected: string){
    this.menuActions.emit(selected);
  }

  sortedChange(itemsSorted: MusicTag[]) {
    if (itemsSorted.length < 1) {
      return;
    }

    if (this.sortedItems === undefined){
      this.order(itemsSorted);
      return;
    }

    if (itemsSorted[0].fileIndex !== this.sortedItems[0]) {
      console.log('sorted changed');
      this.order(itemsSorted);
    }
  }

  private order(itemsSorted: MusicTag[]) {
    this.sortedItems = itemsSorted.map(item => {
      return item.fileIndex;
    });
  }

  selectedChange() {
    if (this.selectedItems.length === 1 && this.selectedItems[0].fileIndex !== this.sortedItems[0]) {
      for (let i = 0; i < this.sortedItems.length; i++) {
        if (this.selectedItems[0].fileIndex === this.sortedItems[i]) {
          this.selectedIndex = i;
          break;
        }
      }
    }
  }
}
