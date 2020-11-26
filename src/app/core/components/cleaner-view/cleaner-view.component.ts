import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-cleaner-view',
  templateUrl: './cleaner-view.component.html',
  styleUrls: ['./cleaner-view.component.scss']
})
export class CleanerViewComponent implements OnInit {

  @Output() dirtyText = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void { }

  setDirtyText(event) {
    this.dirtyText.emit(event);
  }

}
