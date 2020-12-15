import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as WaveSurfer from 'wavesurfer.js';

@Component({
  selector: 'app-cell-player',
  templateUrl: './cell-player.component.html',
  styleUrls: ['./cell-player.component.scss']
})
export class CellPlayerComponent implements OnInit, AfterViewInit {

  @Input() filePath: string;
  @Input() id: string;
  ws: WaveSurfer;
  playerId: string;

  constructor() { }

  ngOnInit(): void {
    this.playerId = 't-' + this.id.split('-')[0];
  }

  ngAfterViewInit(): void {
    this.ws = WaveSurfer.create({
      container: '#' + this.playerId,
      height: 19,
      waveColor: '#c68760',
      progressColor: '#03a9f4',
      // barWidth: 1,
      // barHeight: 2, // the height of the wave
      // barGap: null
    });

    this.ws.load(this.filePath);

    this.ws.on('seek', () => { this.ws.playPause(); });
  }

}
