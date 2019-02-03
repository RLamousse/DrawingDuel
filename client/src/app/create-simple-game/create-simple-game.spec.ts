import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSimpleGame } from './create-simple-game';
import { MatDialogRef, MAT_DIALOG_DATA, } from "@angular/material";


describe('CourseDialogComponentComponent', () => {
  let component: CreateSimpleGame;
  let fixture: ComponentFixture<CreateSimpleGame>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSimpleGame ],
      providers: [{provide: MAT_DIALOG_DATA, useValue: {}}, {provide: MatDialogRef, useValue: {}}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSimpleGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
