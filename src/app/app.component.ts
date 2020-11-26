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
  dirtyString = '';
  haveData = false;
  detailDialog = false;
  cleanerDialog = false;

  @ViewChild(TracklistComponent)
  tracklist: TracklistComponent;

  constructor(private els: ElectronService) {
    this.els.ipcRenderer.on('tags-extracted', (event, data) => {
      this.tracklist.refresh(data);
      this.haveData = true;
    })
  }

  openFolder() {
    this.els.ipcRenderer.send('open-folder');
  }

  showDetail(item: Track) {
    this.itemSelected = item;
    this.detailDialog = true;
  }

  showCleaner() {
    this.cleanerDialog = true;
  }

  setDirtyText(event) {
    this.dirtyString = event.target.value;
  }

  cleanFilenames() {
    this.els.ipcRenderer.send('clean-filenames', { items: this.tracklist.datasource, dirtyText: this.dirtyString });
    this.cleanerDialog = false;
  }

  filenamesToTags() {

  }

}
