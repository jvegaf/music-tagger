import { Component, Input, OnInit } from '@angular/core';
import { Track } from '../../models/Track';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  @Input() item: Track;

  constructor() { }

  ngOnInit(): void {
  }

}
