import { AfterViewInit, Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as WaveSurfer from 'wavesurfer.js';

@Component({
  selector: 'app-cell-player',
  templateUrl: './cell-player.component.html',
  styleUrls: ['./cell-player.component.scss']
})
export class CellPlayerComponent implements OnInit, AfterViewInit, OnChanges, DoCheck {

  @Input() filePath: string;
  @Input() id: string;
  ws: WaveSurfer;
  playerId: string;
  path: string;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log(`afterview ${this.id}`);
    this.ws = WaveSurfer.create({
      container: '#' + this.playerId,
      height: 19,
      waveColor: '#c68760',
      progressColor: '#03a9f4',
      barWidth: 1,
      barHeight: 2, // the height of the wave
      barGap: null
    });
    this.ws.load(this.path);
    this.ws.on('seek', () => { this.ws.playPause(); });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.playerId = 't-' + changes.id.currentValue.split('-')[0];
    this.path = changes.filePath.currentValue;
    if (changes.filePath.isFirstChange()) { return; }
    this.ws.load(this.path);
    console.log(`ngChanges ${this.playerId}`);
    console.log(changes);
  }
}
