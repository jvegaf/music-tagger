import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent implements OnChanges {
  message = '';

  @Input() visible: boolean;
  @Input() infoMessage: string;
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.infoMessage !== undefined){
      this.message = changes.infoMessage.currentValue;
    }
  }


}
