import { Component, Input, OnInit } from '@angular/core';
import { MusicTag } from '../../models/MusicTag';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  @Input() item: MusicTag;

  constructor() { }

  ngOnInit(): void {
  }

}
