import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA  } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { GameService } from "../../../game.service";
import { FreeGameCreatorService } from "../../../scene-creator/FreeGameCreator/free-game-creator.service";
import { FreeGamePhotoService } from "../../../scene-creator/free-game-photo-service/free-game-photo.service";
import { SocketService } from "../../../socket.service";
import { DeleteGameFormComponent } from "./delete-game-form.component";

describe("SupprimerFormComponent", () => {
  let component: DeleteGameFormComponent;
  let fixture: ComponentFixture<DeleteGameFormComponent>;

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [ DeleteGameFormComponent ],
      imports: [ MatDialogModule],
      providers: [{ provide: Router, useClass: class { public navigate: jasmine.Spy = jasmine.createSpy("navigate"); } },
                  {provide: MatDialogRef, useValue: {}},
                  {provide: MAT_DIALOG_DATA, useValue: {}, },
                  SocketService, GameService, FreeGamePhotoService, FreeGameCreatorService ],
    });
    done();
    fixture = TestBed.createComponent(DeleteGameFormComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteGameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
