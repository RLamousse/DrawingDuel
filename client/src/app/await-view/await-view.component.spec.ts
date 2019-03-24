import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ActivatedRoute, Router} from "@angular/router";

import { AwaitViewComponent } from './await-view.component';

describe('AwaitViewComponent', () => {
  let component: AwaitViewComponent;
  let fixture: ComponentFixture<AwaitViewComponent>;

  beforeEach((done) => {
    TestBed.configureTestingModule(
      {
    })
    .compileComponents();
  }));
        providers: [
        { provide: Router, useClass: class { public navigate: jasmine.Spy = jasmine.createSpy("navigate"); }, },
      ],
    });
    done();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwaitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
