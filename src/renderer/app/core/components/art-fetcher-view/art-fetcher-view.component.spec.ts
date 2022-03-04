import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArtFetcherViewComponent } from './art-fetcher-view.component';

describe('ArtFetcherViewComponent', () => {
  let component: ArtFetcherViewComponent;
  let fixture: ComponentFixture<ArtFetcherViewComponent>;

  beforeEach(waitForAsync(() => {
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
