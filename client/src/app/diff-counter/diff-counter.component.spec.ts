import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {SocketService} from "../socket.service";
import { DiffCounterComponent } from "./diff-counter.component";

describe("DiffCounterComponent", () => {
  let component: DiffCounterComponent;
  let fixture: ComponentFixture<DiffCounterComponent>;

  beforeEach(async(async () => {
    return TestBed.configureTestingModule({
      declarations: [ DiffCounterComponent, ],
      imports: [ MatDialogModule],
      providers: [{provide: MatDialogRef, useValue: {}},
                  {provide: MAT_DIALOG_DATA, useValue: {}},
                  { provide: Router, useClass: class { public navigate: jasmine.Spy = jasmine.createSpy("navigate"); }},
                  SocketService, ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", async () => {
    return expect(component).toBeTruthy();
  });
});
