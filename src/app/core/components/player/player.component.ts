import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Track } from './../../models/Track';
import { AudioService } from './../../services/audio.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  track$: Observable<Track>;
  track: Track;
  audioServ: AudioService;

  constructor(audioServ: AudioService) {
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
