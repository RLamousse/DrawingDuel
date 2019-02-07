import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneCreatorComponent } from './scene-creator.component';

describe('SceneCreatorComponent', () => {
  let component: SceneCreatorComponent;
  let fixture: ComponentFixture<SceneCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SceneCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SceneCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
