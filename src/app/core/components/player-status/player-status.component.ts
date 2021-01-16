import { Component, OnInit } from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { Observable } from 'rxjs';
import { Track } from '../../models/Track';

@Component({
  selector: 'app-player-status',
  templateUrl: './player-status.component.html',
  styleUrls: ['./player-status.component.scss']
})
export class PlayerStatusComponent implements OnInit {

  track$: Observable<Track>;
  track: Track;
  progress$: Observable<number>;
  progress: number;

  constructor(private audioServ: AudioService) {
  }


  ngOnInit(): void {
    this.track$ = this.audioServ.getTrack$();
    this.track$.subscribe(track => this.track = track);
    this.progress$ = this.audioServ.getProgress$();
    this.progress$.subscribe(progress => {
      this.progress = progress;
      console.log(`progress: ${this.progress}`);
    });
  }

  seekTo(position: number) {
    this.audioServ.seekTo(position);
  }
}
