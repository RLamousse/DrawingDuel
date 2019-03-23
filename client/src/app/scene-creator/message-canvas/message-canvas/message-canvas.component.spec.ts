import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageCanvasComponent } from './message-canvas.component';

describe('MessageCanvasComponent', () => {
  let component: MessageCanvasComponent;
  let fixture: ComponentFixture<MessageCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
