import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OptionArt } from '../../models/OptionArt';

@Component({
  selector: 'app-art-fetcher-view',
  templateUrl: './art-fetcher-view.component.html',
  styleUrls: ['./art-fetcher-view.component.scss']
})
export class ArtFetcherViewComponent implements OnInit {
  @Input() resultSet: OptionArt[];
  @Output() selected = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  onSelect(cover: OptionArt) {
    this.selected.emit(cover.url);
  }
}
