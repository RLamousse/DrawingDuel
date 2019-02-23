import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute} from "@angular/router";
import * as THREE from "three";
import { IFreeGame } from "../../../../common/model/game/free-game";
import { GameService } from "../game.service";
import { FreeGamePhotoService } from "../scene-creator/free-game-photo-service/free-game-photo.service";

@Component({
  selector: "app-play-view",
  templateUrl: "./play-view.component.html",
  styleUrls: ["./play-view.component.css"],
})
export class PlayViewComponent implements OnInit , AfterViewInit {

  public constructor(
  private route: ActivatedRoute, private gameService: GameService, ) {/*vide*/ }

  public gameName: string;
  public originalImage: string;
  public modifiedImage: string;
  public isSimpleGame: boolean;
  @ViewChild("photoContainer") public originalSceneContainer: ElementRef;

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.isSimpleGame = params ["isSimpleGame"];
      this.gameName = params["gameName"];
      this.originalImage = params["originalImage"];
      this.modifiedImage = params["modifiedImage"];
      this.verifyGame();
    });
  }
  public ngAfterViewInit(): void {
    const photoService: FreeGamePhotoService = new FreeGamePhotoService();
    const dummyScene: THREE.Scene = new THREE.Scene();
    const size: number = 36;
    const cube: THREE.Mesh = new THREE.Mesh(new THREE.SphereGeometry(size, size, size), new THREE.MeshPhongMaterial());
    dummyScene.add(cube);
    photoService.takePhoto(dummyScene, this.originalSceneContainer.nativeElement);
  }

  public verifyGame(): void {
    if (!this.isSimpleGame) {
      this.gameService.getFreeGameByName(this.gameName).subscribe((freeGame: IFreeGame) => {
        //this.originalImage = freeGame.scenesTable.originalObjects;
      });
    }
  }
}
