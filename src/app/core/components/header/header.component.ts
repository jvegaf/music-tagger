import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() onHeaderAction = new EventEmitter<string>();
  @Input() haveData: boolean;

  constructor() {}

  ngOnInit(): void {}

  onAction(name: string) {
    this.onHeaderAction.emit(name);
  }
}
