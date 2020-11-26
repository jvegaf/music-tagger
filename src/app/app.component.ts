import { TagsService } from './core/services/tags.service';
import { TracklistComponent } from './core/components/tracklist/tracklist.component';
import { Component, ViewChild } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Track } from './core/models/Track';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ TagsService ]
})
export class AppComponent {

  @ViewChild(TracklistComponent)
  tracklist: TracklistComponent;

  title = 'Music Tagger';
  itemSelected: Track;
  dirtyString = '';
  haveData = false;
  detailDialog = false;
  cleanerDialog = false;
  tagsExtrDialog = false;
  sampleItem: Track;

  constructor(private els: ElectronService, private tagsService: TagsService) {
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

  showTagExtrDialog() {
    this.sampleItem = this.tagsService.convertFilenameToTags(this.tracklist.datasource[0]);
    this.tagsExtrDialog = true;
  }

  setDirtyText(event) {
    this.dirtyString = event.target.value;
  }

  cleanFilenames() {
    this.els.ipcRenderer.send('clean-filenames', { items: this.tracklist.datasource, dirtyText: this.dirtyString });
    this.cleanerDialog = false;
  }

  filenamesToTags() {
    // const tags = this.tagsService.getTagsFromFilenames(this.tracklist.datasource);
    // this.tracklist.refresh(tags);
  }

}
