import { MusicTag } from '../../models/MusicTag';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter, ChangeDetectorRef,
} from '@angular/core';

@Component({
  selector: 'app-tracklist',
  templateUrl: './tracklist.component.html',
  styleUrls: ['./tracklist.component.scss']
})
export class TracklistComponent implements OnInit {

  @Input() datasource: MusicTag[];

  @Output() showDetail = new EventEmitter<number>();

  selectedItems = [];

  constructor(private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  itemClicked(item: MusicTag) {
    this.showDetail.emit(item.fileIndex);
  }

  refresh(data: MusicTag[]) {
    this.datasource = data;
    this.changeDetectorRefs.detectChanges();
  }
}
