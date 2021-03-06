import {HttpClientModule} from "@angular/common/http";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {MatCardModule, MatDialogModule, MatIconModule} from "@angular/material";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import * as THREE from "three";
import {GameListComponent} from "../game-list/game-list.component";
import {GameComponent} from "../game-list/game/game.component";
import {FreeGameCreatorService} from "../scene-creator/FreeGameCreator/free-game-creator.service";
import {FreeGamePhotoService} from "../scene-creator/free-game-photo-service/free-game-photo.service";
import {IScene} from "../scene-interface";
import {SocketService} from "../socket.service";
import {VueAdminComponent} from "./vue-admin.component";

describe("VueAdminComponent", () => {
  let component: VueAdminComponent;
  let fixture: ComponentFixture<VueAdminComponent>;

  class MockFreeGameCreatorService {
    public isCalled: boolean = false;

    public createScenes(): IScene {
      this.isCalled = true;

      return {scene: new THREE.Scene(), modifiedScene: new THREE.Scene()};
    }
  }

  const mockedFreeGameCreator: MockFreeGameCreatorService = new MockFreeGameCreatorService();

  beforeEach(async () => {
    return TestBed.configureTestingModule(
      {
        declarations: [VueAdminComponent, GameListComponent, GameComponent],
        imports: [MatDialogModule, HttpClientModule, MatCardModule, RouterModule, MatIconModule],
        providers: [{provide: Router, useValue: {}},
                    {provide: ActivatedRoute, useValue: {}},
                    FreeGamePhotoService, {provide: FreeGameCreatorService, useValue: mockedFreeGameCreator},
                    SocketService],
      }).compileComponents();
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
