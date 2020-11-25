import { TracklistComponent } from './core/components/tracklist/tracklist.component';
import { Component, ViewChild } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Track } from './core/models/Track';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Music Tagger';
  itemSelected: Track;
  detailDialog = false;

  @ViewChild(TracklistComponent)
  private tracklist: TracklistComponent;

  constructor(private els: ElectronService) {
    this.els.ipcRenderer.on('tags-extracted', (event, data) => {
      this.tracklist.refresh(data);
    })
  }

  openFolder() {
    this.els.ipcRenderer.send('open-folder');
  }

  showDetail(item: Track) {
    this.itemSelected = item;
    this.detailDialog = true;
  }


}
