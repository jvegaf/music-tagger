import { Track } from './../../models/Track';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-tracklist',
  templateUrl: './tracklist.component.html',
  styleUrls: ['./tracklist.component.scss']
})
export class TracklistComponent implements OnInit {

  @Output() showDetail = new EventEmitter<string>();

  datasource: Track[] = [];

  constructor(private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  refresh(data: Track[]) {
    this.datasource = data;
    this.changeDetectorRefs.detectChanges();
  }

  itemClicked(event) {
    this.showDetail.emit(event);
  }

}
