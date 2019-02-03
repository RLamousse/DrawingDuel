import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VueAdminComponent } from './vue-admin.component';

describe('VueAdminComponent', () => {
  let component: VueAdminComponent;
  let fixture: ComponentFixture<VueAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VueAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VueAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
});
