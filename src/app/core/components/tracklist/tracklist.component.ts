import {Track} from '../../models/Track';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import {TracksService} from '../../services/tracks.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-tracklist',
  templateUrl: './tracklist.component.html',
  styleUrls: ['./tracklist.component.scss'],
  providers: [TracksService]
})
export class TracklistComponent implements OnInit {

  @Output() showDetail = new EventEmitter<Track>();

  tracks: Track[] = [];
  tracks$: Observable<Track[]>;
  selectedItems = [];
  selectedIndex: number;

  constructor(private trackServ: TracksService) {
  }

  ngOnInit(): void {
    this.tracks$ = this.trackServ.getTracks$();
    this.tracks$.subscribe(tracks => this.tracks = tracks);
  }

  itemClicked() {
    this.showDetail.emit();
  }

  extractTags_onClick() {
    this.trackServ.extractTags(this.selectedItems);
  }

  findTags_onClick() {
    this.trackServ.findOnlineTags(this.selectedItems);
  }

  cleaner_onClick() {

  }

  delete_onClick() {
    this.trackServ.removeTracks(this.selectedItems);
  }
}
