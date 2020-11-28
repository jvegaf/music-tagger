import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailArtComponent } from './detail-art.component';

describe('ArtDetailComponent', () => {
  let component: DetailArtComponent;
  let fixture: ComponentFixture<DetailArtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailArtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
