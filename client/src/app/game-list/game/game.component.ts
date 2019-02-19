import { Component, Input, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { FreeGamePhotoService } from "../../scene-creator/free-game-photo-service/free-game-photo.service";
import * as THREE from "three";

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
  @Input() public originalImage: string = "test";
  @Input() public rightButton: string;
  @Input() public leftButton: string;
  @ViewChild("photoContainer") public originalSceneContainer: ElementRef;

  protected leftButtonClick(): void {
    if (this.leftButton === "jouer") {
      this.router.navigate(["../play-view/"]).catch();
    }
  }

  public ngAfterViewInit() {
    let photoService: FreeGamePhotoService = new FreeGamePhotoService();
    let dummyScene: THREE.Scene = new THREE.Scene();
    let cube: THREE.Mesh = new THREE.Mesh(new THREE.SphereGeometry(20,36,36), new THREE.MeshPhongMaterial());
    dummyScene.add(cube);
    photoService.takePhotos(dummyScene, this.originalSceneContainer.nativeElement);
  }
}
