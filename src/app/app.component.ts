import { TagsService } from './core/services/tags.service';
import { Component, ViewChild } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Track } from './core/models/Track';
import { OptionArt } from './core/models/OptionArt';
import { TracklistComponent } from './core/components/tracklist/tracklist.component';
import {TracksService} from './core/services/tracks.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [TracksService]
})
export class AppComponent {

  title = 'Music Tagger';
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

  constructor(private els: ElectronService, private tracksServ: TracksService) {
  }

  private showInfo(message: string) {
    this.infoDialog = true;
    this.infoMessage = message;
  }

  openFolder() {
    this.tracksServ.addItems();
  }

  openDetailDialog() {
  }

  showTagExtrDialog() {
    // if (this.tracklistComponent.selectedItems.length === 0) {
    //   this.sampleItem = this.tagsService.convertFilenameToTags(this.trackItems[0]);
    //   this.tagsExtrDialog = true;
    //   return;
    // }
    // this.sampleItem = this.tagsService.convertFilenameToTags(this.tracklistComponent.selectedItems[0]);
    // this.tagsExtrDialog = true;
  }

  cleanFilenames(textSelected: string) {

  }

  filenamesToTags() {
  //   if (this.tracklistComponent.selectedItems.length < 1) {
  //     this.trackItems = this.tagsService.getTagsFromFilenames(this.trackItems);
  //     // this.haveChanges = true;
  //     this.tagsExtrDialog = false;
  //     return;
  //   }
  //   this.tracklistComponent.selectedItems = this.tracklistComponent.selectedItems.map(item => {
  //     return this.tagsService.convertFilenameToTags(item);
  //   });
  //   // this.haveChanges = true;
  //   this.tagsExtrDialog = false;
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

  findTagsOnline() {
  }

  trackItemsAction(action: string) {
    // switch (action) {
    //   case 'showCleaner':
    //     this.cleanerDialog = true;
    //     break;
    //   case 'tagsFromFilename':
    //     this.filenamesToTags();
    //     break;
    //   case 'findTags':
    //     this.findTagsOnline();
    //     break;
    //   case 'removeFile':
    //     this.removeFile();
    //     break;
    // }
  }

  // private removeFile() {
  //   this.els.ipcRenderer.send('remove-file', this.tracklistComponent.selectedItems[0]);
  //   this.trackItems = this.tagsService.removeItem(this.tracklistComponent.selectedItems[0], this.trackItems);
  // }

  headerAction($event: string) {
    // noinspection JSIgnoredPromiseFromCall
    if ($event === 'add') { this.openFolder(); }
  }
}
