import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDeletionNotifComponent } from './game-deletion-notif.component';

describe('GameDeletionNotifComponent', () => {
  let component: GameDeletionNotifComponent;
  let fixture: ComponentFixture<GameDeletionNotifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameDeletionNotifComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDeletionNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
