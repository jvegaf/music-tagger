import { TagsService } from './core/services/tags.service';
import { Component} from '@angular/core';
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
  itemSelected: number;
  dirtyString = '';
  haveData = false;
  haveChanges = false;
  detailDialog = false;
  cleanerDialog = false;
  tagsExtrDialog = false;
  infoDialog = false;
  artFetchDialog = false;
  trackItems: MusicTag[] = [];
  fetchResult: OptionArt[];
  sampleItem: MusicTag;
  infoDialogMessage: string;
  infoDialogButtons: boolean;

  constructor(private els: ElectronService, private tagsService: TagsService) {
    this.els.ipcRenderer.on('covers-fetch-error', (event, error) => {
      this.infoDialog = false;
      this.showInfo(error.name, true);
    });
  }

  private showInfo(message: string, showButton: boolean) {
    this.infoDialogMessage = message;
    this.infoDialogButtons = showButton;
    this.infoDialog = true;
  }

  openFolder() {
    this.els.ipcRenderer.invoke('open-folder').then(tagItems => {
      this.trackItems = this.tagsService.getDataSource(tagItems);
      this.haveData = true;
    });
  }

  openDetailDialog(itemIndex: number) {
    this.itemSelected = itemIndex;
    this.detailDialog = true;
  }

  showTagExtrDialog() {
    this.sampleItem = this.tagsService.convertFilenameToTags(this.trackItems[0]);
    this.tagsExtrDialog = true;
  }

  setDirtyText(event) {
    this.dirtyString = event.target.value;
  }

  cleanFilenames() {
    this.els.ipcRenderer.invoke('clean-filenames', { items: this.trackItems, dirtyText: this.dirtyString }).then(tags => {
      this.trackItems = tags;
      this.cleanerDialog = false;
    });
  }

  filenamesToTags() {
    this.trackItems = this.tagsService.getTagsFromFilenames(this.trackItems);
    this.haveChanges = true;
    this.tagsExtrDialog = false;
  }

  saveAllChanges() {
    this.showInfo('Saving Changes ...', false);
    this.els.ipcRenderer.invoke('save-all-tags', this.trackItems).then( items => {
      this.trackItems = items;
      this.haveChanges = false;
      this.showInfo('Tags Saved', true);
    });
  }

  saveChanges() {
    this.showInfo('Saving Changes ...', false);
    this.els.ipcRenderer.invoke('save-tags', this.trackItems[this.itemSelected]).then(item => {
      this.trackItems[this.itemSelected] = item;
      this.infoDialog = false;
      this.detailDialog = false;
      this.showInfo('Tags Saved', true);
    });
  }

  showArtFetcherDialog(selectedItem: MusicTag) {
    this.showInfo('Fetching Art Images...', false);
    this.els.ipcRenderer.invoke('fetch-cover', selectedItem).then(result => {
      this.openFetcherDialog(result as OptionArt[]);
    });
  }

  openFetcherDialog(imgset: OptionArt[]) {
    this.fetchResult = imgset;
    this.artFetchDialog = true;
  }

  closeFetcherDialog() {
    this.fetchResult = null;
    this.artFetchDialog = false;
    this.infoDialog = false;
  }

  onSelectArt(imgUrl: string) {
    this.infoDialog = false;
    this.closeFetcherDialog();
    this.detailDialog = false;
    this.showInfo('Adding Cover to Tags....', false);
    this.tagsService.addCoverArtToTag(this.trackItems, this.itemSelected, imgUrl).then(tagItems => {
      this.trackItems = tagItems;
      this.infoDialog = false;
      this.detailDialog = true;
    });
  }

  findTagsOnline() {
    this.showInfo('Finding Track metadata...', true);
    this.els.ipcRenderer.invoke('find-tags', this.trackItems[this.itemSelected]).then( newItem => {
      this.trackItems = this.tagsService.updateTags(this.trackItems, newItem);
      this.infoDialog = false;
    });
  }
}
