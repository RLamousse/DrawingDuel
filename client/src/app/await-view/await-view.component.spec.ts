import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwaitViewComponent } from './await-view.component';

describe('AwaitViewComponent', () => {
  let component: AwaitViewComponent;
  let fixture: ComponentFixture<AwaitViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwaitViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwaitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
