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
  providers: [ TagsService ]
})
export class AppComponent {

  @ViewChild(TracklistComponent)
  private tracklistComponent: TracklistComponent;

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
    this.els.ipcRenderer.on('tags-saved', () => {
      this.closeInfoDialog();
      this.detailDialog = false;
      this.tracklistComponent.refresh(this.trackItems);
      this.showInfo('Tags Saved', true);
    });

    this.els.ipcRenderer.on('covers-fetch-error', (event, error) => {
      this.closeInfoDialog();
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
      this.trackItems = tagItems;
      this.haveData = true;
    });
  }

  openDetailDialog(itemIndex: number) {
    this.itemSelected = itemIndex;
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
    this.trackItems = this.tagsService.getTagsFromFilenames(this.trackItems);
    this.haveChanges = true;
    this.tagsExtrDialog = false;
  }

  saveAllChanges() {
    this.els.ipcRenderer.send('update-tags', this.trackItems);
    this.haveChanges = false;
    this.showInfo('Saving Changes ...', false);
  }

  saveChanges() {
    const items = [this.trackItems[this.itemSelected]];
    this.els.ipcRenderer.send('update-tags', items);
    this.showInfo('Saving Changes ...', false);
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

  onSelectArt(item: MusicTag, imgUrl: string) {
    this.closeInfoDialog();
    this.closeFetcherDialog();
    this.detailDialog = false;
    this.showInfo('Adding Cover to Tags....', false);
    this.els.ipcRenderer.invoke('imageUrl-to-buffer', imgUrl).then((imgBuffer) => {
      this.trackItems[this.itemSelected] = this.tagsService.addCoverArtToTag(this.trackItems[this.itemSelected], imgBuffer);
      this.detailDialog = false;
      this.closeInfoDialog();
      this.detailDialog = true;
      // this.openDetailDialog(this.itemSelected);
    }).catch(e => console.log(e));
  }

  closeInfoDialog() {
    this.infoDialog = false;
  }

  findTagsOnline() {
    this.showInfo('Finding Track metadata...', true);
    this.els.ipcRenderer.invoke('find-tags', this.trackItems[this.itemSelected]).then( newItem => {
      this.trackItems[this.itemSelected] = newItem;
      this.infoDialog = false;
    });
  }
}
