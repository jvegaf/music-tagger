import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-art-detail',
  templateUrl: './art-detail.component.html',
  styleUrls: ['./art-detail.component.scss']
})
export class ArtDetailComponent implements OnInit {


  constructor( private sanitizer: DomSanitizer) { }

  mySrc: 

  ngOnInit(): void {
  }



  coverArt(imgBuffer) {
    console.log('llamada coverArt');
    const blob = new Blob( [imgBuffer], { type: "image/jpeg" });
    const artUrl = URL.createObjectURL(blob);
    mySrc = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + artUrl);
  }

}
