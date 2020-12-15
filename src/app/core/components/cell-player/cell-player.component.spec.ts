import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellPlayerComponent } from './cell-player.component';

describe('CellPlayerComponent', () => {
  let component: CellPlayerComponent;
  let fixture: ComponentFixture<CellPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
