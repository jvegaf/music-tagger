import { Track } from '../../models/Track';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import { TracksService } from '../../services/tracks.service';
import { Observable } from 'rxjs';
import { ArtworkService } from '../../services/artwork.service';
import { ShortcutInput } from 'ng-keyboard-shortcuts';
import { AudioService } from '../../services/audio.service';


@Component({
  selector: 'app-tracklist',
  templateUrl: './tracklist.component.html',
  styleUrls: ['./tracklist.component.scss']
})
export class TracklistComponent implements OnInit, AfterViewInit {

  @Output() showDetail = new EventEmitter<Track>();

  sortedItems = [];
  tracks$: Observable<Track[]>;
  selectedItems = [];
  selectedIndex: number;
  shortcuts: ShortcutInput[] = [];
  private isPlaying = false;

  constructor(private trackServ: TracksService,
              private artServ: ArtworkService,
              private audioServ: AudioService) {
  }

  ngOnInit(): void {
    this.tracks$ = this.trackServ.getTracks$();
  }

  ngAfterViewInit(): void {
    this.shortcuts.push(
      {
        key: 'ctrl + a',
        preventDefault: true,
        command: () => this.selectAll()
      },
      {
        key: 'escape',
        preventDefault: true,
        command: () => this.unselect()
      },
      {
        key: 'del',
        preventDefault: true,
        command: () => this.delete_onClick()
      },
      {
        key: 'space',
        preventDefault: true,
        command: () => this.playTrack()
      },
      {
        key: 'left',
        preventDefault: true,
        command: () => this.backSeekTrack()
      },
      {
        key: 'right',
        preventDefault: true,
        command: () => this.advanceSeekTrack()
      }
    );
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

  getArtwork(track: Track) {
    return this.artServ.getImgSource(track);
  }

  private selectAll() {
    this.selectedItems = this.sortedItems;
  }

  sortedChange(event: any[]) {
    this.sortedItems = event;
  }

  private unselect() {
    this.audioServ.stop();
    this.isPlaying = false;
    this.selectedItems = [];
  }

  playTrack() {
    if (this.selectedItems.length < 1) { return; }
    this.audioServ.play(this.selectedItems[0]);
    this.isPlaying = true;
  }

  private backSeekTrack() {
    if (!this.isPlaying) { return; }
    this.audioServ.seekBack();
  }

  private advanceSeekTrack() {
    if (!this.isPlaying) { return; }
    this.audioServ.seekAdv();
  }
}
