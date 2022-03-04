import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CleanerViewComponent } from './cleaner-view.component';

describe('CleanerViewComponent', () => {
  let component: CleanerViewComponent;
  let fixture: ComponentFixture<CleanerViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CleanerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CleanerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
