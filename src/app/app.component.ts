import { TagsService } from './core/services/tags.service';
import { Component, ViewChild } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Track } from './core/models/Track';
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
  itemsToProcess: number;
  haveData = false;
  haveChanges = false;
  detailDialog = false;
  cleanerDialog = false;
  tagsExtrDialog = false;
  infoDialog = false;
  infoMessage: string;
  artFetchDialog = false;
  trackItems: Track[] = [];
  fetchResult: OptionArt[];

  sampleItem: Track;
  @ViewChild(TracklistComponent)
  tracklistComponent: TracklistComponent;

  constructor(private els: ElectronService, private tagsService: TagsService) {
    this.els.ipcRenderer.on('tag-completed', (event, item) => {
      this.trackItems = this.tagsService.updateTrackItems(this.trackItems, item);
      this.itemsToProcess--;
      this.infoDialog = true;
      this.infoMessage = `Left ${this.itemsToProcess} Tracks for end Task`;
      if (this.itemsToProcess < 1) { this.infoDialog = false; this.cleanerDialog = false; }
    });

    this.els.ipcRenderer.on('tags-saved', () => {
      this.haveChanges = false;
      this.infoDialog = false;
      this.detailDialog = false;
    });

    this.els.ipcRenderer.on('covers-fetch-error', (event, error) => {
      this.infoDialog = false;
      this.showInfo(error.name);
    });

    this.els.ipcRenderer.on('clean-selection', (event, selectedText) => {
      this.cleanFilenames(selectedText);
    });
  }

  private showInfo(message: string) {
    this.infoDialog = true;
    this.infoMessage = message;
  }

  async openFolder() {
    this.showInfo('opening folder');
    try {
      const tagItems = await this.els.ipcRenderer.invoke('open-folder');
      if (tagItems === null) { this.infoDialog = false; return; }
      this.trackItems = null;
      this.trackItems = this.tagsService.getDataSource(tagItems);
      this.haveData = true;
      this.infoDialog = false;
    } catch (e) {
      this.infoDialog = false;
    }
  }

  openDetailDialog() {
    this.detailDialog = true;
  }

  showTagExtrDialog() {
    if (this.tracklistComponent.selectedItems.length === 0) {
      this.sampleItem = this.tagsService.convertFilenameToTags(this.trackItems[0]);
      this.tagsExtrDialog = true;
      return;
    }
    this.sampleItem = this.tagsService.convertFilenameToTags(this.tracklistComponent.selectedItems[0]);
    this.tagsExtrDialog = true;
  }

  cleanFilenames(textSelected: string) {
    this.itemsToProcess = this.trackItems.length;
    this.detailDialog = false;
    this.showInfo('Cleaning Filenames');
    this.trackItems.forEach(item => {
      this.els.ipcRenderer.send('clean-filename', {item: item, selection: textSelected});
    });
  }

  filenamesToTags() {
    if (this.tracklistComponent.selectedItems.length < 1) {
      this.trackItems = this.tagsService.getTagsFromFilenames(this.trackItems);
      this.tagsExtrDialog = false;
      return;
    }
    this.tracklistComponent.selectedItems = this.tracklistComponent.selectedItems.map(item => {
      return this.tagsService.convertFilenameToTags(item);
    });
    this.tagsExtrDialog = false;
  }

  saveChanges() {
    this.showInfo('Saving Changes ...');
    if (this.tracklistComponent.selectedItems.length < 1) {
      this.trackItems.forEach(item => {
        this.els.ipcRenderer.send('save-tags', item);
      });
      return;
    }
    this.tracklistComponent.selectedItems.forEach(item => {
      this.els.ipcRenderer.send('save-tags', item);
    });
  }

  showArtFetcherDialog(selectedItem: Track) {
    this.showInfo('Fetching Art Images...');
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
    this.showInfo('Adding Cover Art to Tags....');
    this.tagsService.addCoverArtToTag(this.tracklistComponent.selectedItems[0], imgUrl).then(() => {
      this.infoDialog = false;
      this.detailDialog = true;
    });
  }

  findTagsOnline() {
    if (this.tracklistComponent.selectedItems.length < 1) {
      return;
    }
    this.itemsToProcess = this.tracklistComponent.selectedItems.length;
    this.tracklistComponent.selectedItems.forEach(item => {
      const track = this.checkTitleTag(item);
      this.els.ipcRenderer.send('find-tags', item);
    });
  }

  trackItemsAction(action: string) {
    switch (action) {
      case 'showCleaner':
        this.cleanerDialog = true;
        break;
      case 'tagsFromFilename':
        this.filenamesToTags();
        break;
      case 'findTags':
        this.findTagsOnline();
        break;
      case 'removeFile':
        this.removeFile();
        break;
    }
  }

  onHeaderAction(value: string) {
    switch (value) {
      case 'openFolder':
        this.openFolder();
        break;
      case 'tagsFromFNames':
        this.filenamesToTags();
        break;
      case 'findTagsOnline':
        this.findTagsOnline();
        break;
      default:
        break;
    }
  }

  private checkTitleTag(musicTag: Track): Track {
    if (musicTag.titleTag) return musicTag;
    return this.tagsService.convertFilenameToTags(musicTag);
  }

  private removeFile() {
    this.els.ipcRenderer.send('remove-file', this.tracklistComponent.selectedItems[0]);
    this.trackItems = this.tagsService.removeItem(this.tracklistComponent.selectedItems[0], this.trackItems);
  }
}
