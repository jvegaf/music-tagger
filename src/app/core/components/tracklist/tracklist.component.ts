import { MusicTag } from '../../models/MusicTag';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-tracklist',
  templateUrl: './tracklist.component.html',
  styleUrls: ['./tracklist.component.scss']
})
export class TracklistComponent implements OnInit {

  @Input() datasource: MusicTag[];

  @Output() showDetail = new EventEmitter<string>();

  selectedItems = [];

  constructor() { }

  ngOnInit(): void {
  }

  itemClicked(event) {
    this.showDetail.emit(event);
  }

}
