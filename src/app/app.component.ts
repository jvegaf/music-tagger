import { TagsService } from './core/services/tags.service';
import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { MusicTag } from './core/models/MusicTag';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ TagsService ]
})
export class AppComponent {

  title = 'Music Tagger';
  itemSelected: MusicTag;
  dirtyString = '';
  haveData = false;
  haveChanges = false;
  detailDialog = false;
  cleanerDialog = false;
  tagsExtrDialog = false;
  savedInfoDialog = false;
  trackItems = [];
  sampleItem: MusicTag;

  constructor(private els: ElectronService, private tagsService: TagsService) {
    this.els.ipcRenderer.on('tags-extracted', (event, data) => {
      this.haveData = true;
      this.trackItems = data;
    });
    this.els.ipcRenderer.on('tags-saved', () => {
      this.savedInfoDialog = true;
    });
  }

  openFolder() {
    this.els.ipcRenderer.send('open-folder');
  }

  showDetailDialog(item: MusicTag) {
    this.itemSelected = item;
    this.detailDialog = true;
  }

  showCleaner() {
    this.cleanerDialog = true;
  }

  showTagExtrDialog() {
    this.sampleItem = this.tagsService.convertFilenameToTags(this.trackItems[0]);
    this.tagsExtrDialog = true;
  }

  setDirtyText(event) {
    this.dirtyString = event.target.value;
  }

  cleanFilenames() {
    this.els.ipcRenderer.send('clean-filenames', { items: this.trackItems, dirtyText: this.dirtyString });
    this.cleanerDialog = false;
  }

  filenamesToTags() {
    const tags = this.tagsService.getTagsFromFilenames(this.trackItems);
    this.trackItems = tags;
    this.haveChanges = true;
    this.tagsExtrDialog = false;
  }

  saveChanges() {
    this.els.ipcRenderer.send('update-tags', this.trackItems);
    this.haveChanges = false;
  }

}
