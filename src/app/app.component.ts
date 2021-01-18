import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Track } from './core/models/Track';
import { TracksService } from './core/services/tracks.service';
import { TagsService } from './core/services/tags.service';
import { OptionArt } from './core/models/OptionArt';
import { DuiApp } from '@marcj/angular-desktop-ui/src/components/app/index';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Music Tagger';
  detailDialog = false;
  cleanerDialog = false;
  tagsExtrDialog = false;
  infoDialog = false;
  infoMessage: string;
  artFetchDialog = false;
  fetchResult: OptionArt[];

  sampleItem: Track;

  constructor(private els: ElectronService,
              private tracksServ: TracksService) {
    if (DuiApp.prototype.getPlatform() !== 'darwin') {
      DuiApp.prototype.setPlatform('linux');
    }
  }

  private showInfo(message: string) {
    this.infoDialog = true;
    this.infoMessage = message;
  }

  openFolder() {
    this.tracksServ.addItems();
  }

  openDetailDialog() {
    this.detailDialog = true;
  }

  closeDetailDialog() {
    this.detailDialog = false;
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
    this.detailDialog = false;
    this.artFetchDialog = false;
    this.infoDialog = false;
    this.detailDialog = true;
  }

  headerAction($event: string) {
    // noinspection JSIgnoredPromiseFromCall
    if ($event === 'add') { this.openFolder(); }
  }
}
