import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-cleaner-view',
  templateUrl: './cleaner-view.component.html',
  styleUrls: ['./cleaner-view.component.scss']
})
export class CleanerViewComponent implements OnInit {

  dirtyText = '';

  constructor() {}

  ngOnInit(): void { }

  setDirtyText(event) {
    this.dirtyText = event;
  }

}
