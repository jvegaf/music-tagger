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
  audioServ: AudioService;

  constructor( audioServ: AudioService) {
    this.audioServ = audioServ;
  }


  ngOnInit(): void {
    this.track$ = this.audioServ.getTrack$();
    this.track$.subscribe(track => this.track = track);
  }

  seekTo(position: number) {
    this.audioServ.seekTo(position);
  }
}
