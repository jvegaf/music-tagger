import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtFetcherViewComponent } from './art-fetcher-view.component';

describe('ArtFetcherViewComponent', () => {
  let component: ArtFetcherViewComponent;
  let fixture: ComponentFixture<ArtFetcherViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtFetcherViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtFetcherViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
