import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinitialiserFormComponent } from './reinitialiser-form.component';

describe('ReinitialiserFormComponent', () => {
  let component: ReinitialiserFormComponent;
  let fixture: ComponentFixture<ReinitialiserFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReinitialiserFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReinitialiserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
