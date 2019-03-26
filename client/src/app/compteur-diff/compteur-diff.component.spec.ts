import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {SocketService} from "../socket.service";
import { CompteurDiffComponent } from "./compteur-diff.component";

describe("CompteurDiffComponent", () => {
  let component: CompteurDiffComponent;
  let fixture: ComponentFixture<CompteurDiffComponent>;

  beforeEach(async(async () => {
    return TestBed.configureTestingModule({
      declarations: [ CompteurDiffComponent, ],
      imports: [ MatDialogModule],
      providers: [{provide: MatDialogRef, useValue: {}},
                  {provide: MAT_DIALOG_DATA, useValue: {}},
                  { provide: Router, useClass: class { public navigate: jasmine.Spy = jasmine.createSpy("navigate"); }},
                  SocketService, ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompteurDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", async () => {
    return expect(component).toBeTruthy();
  });
});
