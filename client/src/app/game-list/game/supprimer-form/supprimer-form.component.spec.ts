import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupprimerFormComponent } from './supprimer-form.component';

describe('SupprimerFormComponent', () => {
  let component: SupprimerFormComponent;
  let fixture: ComponentFixture<SupprimerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupprimerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupprimerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
