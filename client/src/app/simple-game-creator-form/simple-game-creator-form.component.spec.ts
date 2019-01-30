import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleGameCreatorFormComponent } from './simple-game-creator-form.component';

describe('SimpleGameCreatorFormComponent', () => {
  let component: SimpleGameCreatorFormComponent;
  let fixture: ComponentFixture<SimpleGameCreatorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleGameCreatorFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleGameCreatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
