import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KickDialogComponent } from './kick-dialog.component';

describe('KickDialogComponent', () => {
  let component: KickDialogComponent;
  let fixture: ComponentFixture<KickDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KickDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KickDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
