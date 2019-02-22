import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import * as THREE from "three";
import { FreeGamePhotoService } from "../../scene-creator/free-game-photo-service/free-game-photo.service";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})

export class GameComponent implements AfterViewInit {

  public constructor(
    private router: Router,
  ) {/*vide*/}

  @Input() public gameName: string = "test";
  @Input() public bestSoloTimes: { name: string, time: number }[];
  @Input() public bestMultiTimes: { name: string, time: number }[];
  @Input() public originalImage: string;
  @Input() public modifiedImage: string;
  @Input() public rightButton: string;
  @Input() public leftButton: string;
  @Input() public isSimpleGame: boolean;
  @ViewChild("photoContainer") public originalSceneContainer: ElementRef;

  protected leftButtonClick(): void {
    if (this.leftButton === "jouer") {
      this.router.navigate(["/play-view/"], {queryParams: {
        isSimpleGame : this.isSimpleGame, gameName: this.gameName, originalSceneContainer: this.originalSceneContainer,
        originalImage: this.originalImage, modifiedImage: this.modifiedImage },
      }).catch();
    }
  }

  public ngAfterViewInit(): void {
    const photoService: FreeGamePhotoService = new FreeGamePhotoService();
    const dummyScene: THREE.Scene = new THREE.Scene();
    const size: number = 36;
    const cube: THREE.Mesh = new THREE.Mesh(new THREE.SphereGeometry(size, size, size), new THREE.MeshPhongMaterial());
    dummyScene.add(cube);
    photoService.takePhoto(dummyScene, this.originalSceneContainer.nativeElement);
  }
}
