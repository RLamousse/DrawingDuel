import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogModule, } from "@angular/material";
import * as THREE from "three";
import { IScene } from "../../../scene-interface";
import { GameListComponent } from "../game-list/game-list.component";
import { GameComponent } from "../game-list/game/game.component";
import { FreeGameCreatorService } from "../scene-creator/FreeGameCreator/free-game-creator.service";
import { FreeGamePhotoService } from "../scene-creator/free-game-photo-service/free-game-photo.service";
import { VueAdminComponent } from "./vue-admin.component";

describe("VueAdminComponent", () => {
  let component: VueAdminComponent;
  let fixture: ComponentFixture<VueAdminComponent>;

  class MockFreeGameCreatorService {
    public isCalled: boolean = false;
    public createScenes(): IScene {
      this.isCalled = true;

      return { scene: new THREE.Scene(), modifiedScene: new THREE.Scene() };
    }
  }
  const mockedFreeGameCreator: MockFreeGameCreatorService = new MockFreeGameCreatorService();

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [ VueAdminComponent, GameListComponent, GameComponent],
      imports: [ MatDialogModule,  HttpClientModule],
      providers: [  FreeGamePhotoService, { provide: FreeGameCreatorService, useValue: mockedFreeGameCreator }, ],
    });
    done();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VueAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

});
