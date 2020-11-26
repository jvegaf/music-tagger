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
  haveChanges = false;
  detailDialog = false;
  cleanerDialog = false;
  tagsExtrDialog = false;
  savedInfoDialog = false;
  sampleItem: Track;

  constructor(private els: ElectronService, private tagsService: TagsService) {
    this.els.ipcRenderer.on('tags-extracted', (event, data) => {
      this.tracklist.datasource = data;
      this.haveData = true;
    });
    this.els.ipcRenderer.on('tags-saved', (event) => {
      this.savedInfoDialog = true;
    });
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
    this.sampleItem = this.tracklist.datasource[0];
    this.sampleItem = this.tagsService.convertFilenameToTags(this.sampleItem);
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
    const tags = this.tagsService.getTagsFromFilenames(this.tracklist.datasource);
    this.tracklist.datasource = tags;
    this.haveChanges = true;
    this.tagsExtrDialog = false;
  }

  saveChanges() {
    this.els.ipcRenderer.send('update-tags', this.tracklist.datasource);
    this.haveChanges = false;
  }

}
