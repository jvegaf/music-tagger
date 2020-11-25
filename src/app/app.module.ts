import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
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
  DuiWindowModule,
} from '@marcj/angular-desktop-ui';
import { TracklistComponent } from './core/components/tracklist/tracklist.component';
import { NgxElectronModule } from 'ngx-electron';
import { DetailComponent } from './core/components/detail/detail.component';

@NgModule({
  declarations: [
    AppComponent,
    TracklistComponent,
    DetailComponent
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
    DuiSliderModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
