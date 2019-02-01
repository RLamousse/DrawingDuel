import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSimpleGame } from './create-simple-game';

describe('CourseDialogComponentComponent', () => {
  let component: CreateSimpleGame;
  let fixture: ComponentFixture<CreateSimpleGame>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSimpleGame ]
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
