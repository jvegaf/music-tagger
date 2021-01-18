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

  constructor(private trackServ: TracksService,
              private artServ: ArtworkService,
              private audioServ: AudioService) {
  }

  ngOnInit(): void {
    this.tracks$ = this.trackServ.getTracks$();
  }

  ngAfterViewInit(): void {
    this.initShortcuts();
    document.addEventListener('drop', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const filepaths = new Array<string>();
      // @ts-ignore
      for (const file of event.dataTransfer.files) {
        filepaths.push(file.path);
      }
      this.trackServ.addDropedItems(filepaths);
    });

    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    document.addEventListener('dragenter', (event) => {
    });

    document.addEventListener('dragleave', (event) => {
    });
  }

  private initShortcuts() {
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
    this.selectedItems = [];
  }

  playTrack() {
    if (this.selectedItems.length < 1) { return; }
    this.audioServ.play(this.selectedItems[0]);
  }

  private backSeekTrack() {
    this.audioServ.seekBack();
  }

  private advanceSeekTrack() {
    this.audioServ.seekAdv();
  }
}
