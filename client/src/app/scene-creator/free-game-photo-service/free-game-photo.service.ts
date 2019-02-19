import { Injectable } from '@angular/core';
import { SceneRendererService } from "../scene-renderer.service";
//let domtoimage = require('dom-to-image');
import * as THREE from "three";

@Injectable()
export class FreeGamePhotoService {


  private renderService: SceneRendererService = new SceneRendererService();

  public takePhotos(originScene: THREE.Scene, modScene: THREE.Scene): void {
    console.log(originScene);
    let oriCont: HTMLDivElement = <HTMLDivElement>(document.createElement("div"));
    let modCont: HTMLDivElement = <HTMLDivElement>(document.createElement("div"));
    console.log(oriCont.innerHTML);
    this.renderService.init(oriCont, modCont);
    this.renderService.loadScenes(originScene, modScene);
    console.log(oriCont.innerHTML);
    let canvas: HTMLCanvasElement = <HTMLCanvasElement>oriCont.querySelector("canvas");
    if (typeof (canvas) !== null) {
      let img = canvas.toDataURL("image/png");
      console.log(img);
    }
  }
}
