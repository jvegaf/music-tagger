import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() Actions = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onClick_Button(name: string) {
    this.Actions.emit(name);
  }
}
