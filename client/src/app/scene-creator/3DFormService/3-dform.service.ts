import { Injectable } from '@angular/core';
import * as THREE from 'three';
@Injectable()
export class Form3DService {

  private baseSize: number = 150;
  private maxSizeFactor = 150;
  private minSizeFactor = 50;

  private sizeGenerator(): number {

    return (Math.floor(Math.random() * (this.maxSizeFactor - this.minSizeFactor + 1) + 50) / 100 * this.baseSize);
  }

  public createCube(): THREE.Mesh{
    const cubeSide: number = this.sizeGenerator();
    const geometry = new THREE.BoxGeometry(cubeSide, cubeSide, cubeSide);

    for (let i = 0; i < geometry.faces.length; i += 2) {
      const hex = Math.random() * 0xffffff;
      geometry.faces[i].color.setHex(hex);
      geometry.faces[i + 1].color.setHex(hex);
    }
    geometry.boundingBox = new THREE.Box3(new THREE.Vector3(800,800,400));

    const material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, overdraw: 0.5 });
    return new THREE.Mesh(geometry, material);
  }
}
