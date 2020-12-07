import { TagsService } from './core/services/tags.service';
import { Component, ViewChild } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { MusicTag } from './core/models/MusicTag';
import { OptionArt } from './core/models/OptionArt';
import { TracklistComponent } from './core/components/tracklist/tracklist.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [TagsService]
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

  @ViewChild(TracklistComponent)
  tracklistComponent: TracklistComponent;

  constructor(private els: ElectronService, private tagsService: TagsService) {
    this.els.ipcRenderer.on('online-tags-founded', (event, items) => {
      console.log(items);
      this.trackItems = this.tagsService.updateTags(this.trackItems, items);
      this.haveChanges = true;
      this.infoDialog = false;
    });

    this.els.ipcRenderer.on('processing', (event, itemInd) => {
      const totalItems = this.tracklistComponent.selectedItems.length < 1 ?
        this.trackItems.length : this.tracklistComponent.selectedItems.length;
      this.infoDialogMessage = `Processing ${itemInd} of ${totalItems}`;
      console.log(this.infoDialogMessage);
    });

    this.els.ipcRenderer.on('tags-saved', (event) => {
      this.haveChanges = false;
      this.infoDialog = false;
      this.detailDialog = false;
    });

    this.els.ipcRenderer.on('covers-fetch-error', (event, error) => {
      this.infoDialog = false;
      this.showInfo(error.name, true);
    });

  }

  private showInfo(message: string, showButton: boolean) {
    this.infoDialog = true;
    this.infoDialogMessage = message;
    this.infoDialogButtons = showButton;
  }

  async openFolder() {
    try {
      this.showInfo('opening folder', false);
      const tagItems = await this.els.ipcRenderer.invoke('open-folder');
      this.trackItems = this.tagsService.getDataSource(tagItems);
      this.haveData = true;
      this.infoDialog = false;
    } catch (e) {
      this.infoDialog = false;
    }
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
    this.els.ipcRenderer.invoke('clean-filenames', {items: this.trackItems, dirtyText: this.dirtyString}).then(tags => {
      this.trackItems = tags;
      this.cleanerDialog = false;
    });
  }

  filenamesToTags() {
    if (this.tracklistComponent.selectedItems.length < 1){
      this.trackItems = this.tagsService.getTagsFromFilenames(this.trackItems);
      this.haveChanges = true;
      this.tagsExtrDialog = false;
      return;
    }
    this.tracklistComponent.selectedItems = this.tracklistComponent.selectedItems.map(item => {
      return this.tagsService.convertFilenameToTags(item);
    });
    this.haveChanges = true;
    this.tagsExtrDialog = false;
  }

  saveAllChanges() {
    this.showInfo('Saving Changes ...', false);
    if (this.tracklistComponent.selectedItems.length < 1) {
      this.els.ipcRenderer.send('save-tags', this.trackItems);
      return;
    }
    this.els.ipcRenderer.send('save-tags', this.tracklistComponent.selectedItems);
  }

  saveChanges() {
    this.showInfo('Saving Changes ...', false);
    const items = [this.trackItems[this.itemSelected]];
    this.els.ipcRenderer.send('save-tags', items);
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
    const items = [this.tracklistComponent.selectedItems];
    this.els.ipcRenderer.send('find-tags', items);
  }

  findAllTagsOnline() {
    this.showInfo('Finding Selected Tracks metadata...', false);
    if (this.tracklistComponent.selectedItems.length < 1) {
      this.els.ipcRenderer.send('find-tags', this.trackItems);
      return;
    }
    this.els.ipcRenderer.send('find-tags', this.tracklistComponent.selectedItems);
  }
}
