import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Create3DGameComponent } from './create3-dgame.component';

describe('Create3DGameComponent', () => {
  let component: Create3DGameComponent;
  let fixture: ComponentFixture<Create3DGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Create3DGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Create3DGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
