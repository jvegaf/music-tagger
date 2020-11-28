import { TagsService } from './core/services/tags.service';
import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { MusicTag } from './core/models/MusicTag';
import { OptionArt } from './core/models/OptionArt';

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
  infoDialog = false;
  artFetchDialog = false;
  trackItems = [];
  haveResult = false;
  fetchResult: OptionArt[];
  sampleItem: MusicTag;
  infoDialogMessage: string;
  infoDialogButtons: boolean;

  constructor(private els: ElectronService, private tagsService: TagsService) {
    this.els.ipcRenderer.on('tags-extracted', (event, data) => {
      this.haveData = true;
      this.trackItems = data;
    });

    this.els.ipcRenderer.on('tags-saved', () => {
      this.closeInfoDialog();
      this.showInfo('Tags Saved', true);
    });

    this.els.ipcRenderer.on('covers-fetched', (event, result) => {
      this.fetchResult = result as OptionArt[];
      this.haveResult = true;
      this.artFetchDialog = true;
    });

    this.els.ipcRenderer.on('covers-fetch-error', (event, error) => {
      this.closeInfoDialog();
      this.showInfo(error.name, true);
    });

    this.els.ipcRenderer.on('buffer-image', (event, buffer) => {
      const item = this.tagsService.addCoverArtToTag(this.itemSelected, buffer);
      this.closeInfoDialog();
      this.openDetailDialog(item);
    });
  }

  private showInfo(message: string, showButton: boolean) {
    this.infoDialogMessage = message;
    this.infoDialogButtons = showButton;
    this.infoDialog = true;
  }

  openFolder() {
    this.els.ipcRenderer.send('open-folder');
  }

  openDetailDialog(item: MusicTag) {
    this.itemSelected = item;
    this.detailDialog = true;
  }

  closeDetailDialog() {
    this.itemSelected = null;
    this.detailDialog = false;
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
    const items = (this.itemSelected) ? [this.itemSelected] : this.trackItems;
    this.els.ipcRenderer.send('update-tags', items);
    this.haveChanges = false;
    this.showInfo('Saving Changes ...', false);
  }

  showArtFetcherDialog() {
    this.els.ipcRenderer.send('fetch-cover', this.itemSelected);
    this.showInfo('Fetching Art Images...', false);
  }

  closeFetcherDialog() {
    this.fetchResult = null;
    this.haveResult = false;
    this.artFetchDialog = false;
    this.infoDialog = false;
  }

  onSelectArt(imgUrl: string) {
    this.closeInfoDialog();
    this.closeFetcherDialog();
    this.closeDetailDialog();
    this.showInfo('Adding Cover to Tags....', false);
    this.els.ipcRenderer.sendSync('imageUrl-to-buffer', imgUrl);
  }

  closeInfoDialog() {
    this.infoDialog = false;
  }
}
