import { TagsService } from './core/services/tags.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {
  DuiAppModule,
  DuiButtonModule,
  DuiCheckboxModule,
  DuiDialogModule,
  DuiEmojiModule,
  DuiFormComponent,
  DuiIconModule,
  DuiInputModule,
  DuiListModule,
  DuiRadioboxModule,
  DuiSelectModule,
  DuiSliderModule,
  DuiTableModule,
  DuiWindowModule
} from '@marcj/angular-desktop-ui';
import { TracklistComponent } from './core/components/tracklist/tracklist.component';
import { NgxElectronModule } from 'ngx-electron';
import { DetailComponent } from './core/components/detail/detail.component';
import { CleanerViewComponent } from './core/components/cleaner-view/cleaner-view.component';
import { ArtFetcherViewComponent } from './core/components/art-fetcher-view/art-fetcher-view.component';
import { InfoDialogComponent } from './core/components/info-dialog/info-dialog.component';
import { TextFieldContextMenuDirective } from './core/directives/text-field-context-menu.directive';
import { HeaderComponent } from './core/components/header/header.component';
import { PlayerComponent } from './core/components/player/player.component';

@NgModule({
  declarations: [
    AppComponent,
    TracklistComponent,
    DetailComponent,
    CleanerViewComponent,
    ArtFetcherViewComponent,
    InfoDialogComponent,
    TextFieldContextMenuDirective,
    HeaderComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    NgxElectronModule,
    FormsModule,
    DuiAppModule.forRoot(),
    DuiWindowModule.forRoot(),

    DuiCheckboxModule,
    DuiButtonModule,
    DuiInputModule,
    DuiFormComponent,
    DuiRadioboxModule,
    DuiSelectModule,
    DuiIconModule,
    DuiListModule,
    DuiTableModule,
    DuiButtonModule,
    DuiDialogModule,
    DuiEmojiModule,
    DuiSliderModule
  ],
  providers: [TagsService],
  bootstrap: [AppComponent]
})
export class AppModule {}
