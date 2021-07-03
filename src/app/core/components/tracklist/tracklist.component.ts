import {Track} from '../../models/Track';
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

  @Input() items: Track[];

  @Output() showDetail = new EventEmitter<Track>();
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

  sortedChange(itemsSorted: Track[]) {
    if (itemsSorted.length < 1) {
      return;
    }

    if (this.sortedItems === undefined){
      this.sortedItems = this.order(itemsSorted);
      return;
    }

    console.log('sorted changed');
    this.sortedItems = this.order(itemsSorted);
  }

  private order(itemsSorted: Track[]) {
    return itemsSorted.map(item => {
      if (item === undefined){return;}
      return item.fileIndex;
    });
  }

  selectedChange(selected) {
    if (selected.length < 1 || selected.length > 1){return;}
    if (selected[0] === undefined){return;}
    console.log('selected with fileIndex');
    console.log(selected[0].fileIndex);
    this.selectedIndex = this.sortedItems.indexOf(selected[0].fileIndex);
  }
}
