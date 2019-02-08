import { Injectable } from '@angular/core';
import * as THREE from 'three';
@Injectable()
export class Form3DService {
  
  private baseSize: number = 20;
  private maxSizeFactor = 150;
  private minSizeFactor = 50;

  private sizeGenerator(): number {

    return (Math.floor(Math.random() * (this.maxSizeFactor - this.minSizeFactor + 1) + 50) / 100 * this.baseSize);
  }

  public createCube(): THREE.Mesh{
    const cubeSide: number = this.sizeGenerator();
    const geometry = new THREE.BoxGeometry(cubeSide, cubeSide, cubeSide);

    this.setColor(geometry);
    const material = new THREE.MeshPhongMaterial({ vertexColors: THREE.FaceColors});
    return new THREE.Mesh(geometry, material);
  }

  public createSphere(): THREE.Mesh {
    const sphereRadius: number = this.sizeGenerator()/2.0;
    const geometry = new THREE.SphereGeometry(sphereRadius, 32, 32);

    this.setColor(geometry);
    const material = new THREE.MeshPhongMaterial({ vertexColors: THREE.FaceColors});
    return new THREE.Mesh(geometry, material);
  }

  public createCone(): THREE.Mesh {
    const coneSize: number = this.sizeGenerator();
    const geometry = new THREE.ConeGeometry(coneSize/2, coneSize, 32);

    const hex = Math.random() * 0xffffff;
    for (let i = 0; i < geometry.faces.length; i += 2) {
      geometry.faces[i].color.setHex(hex);
      geometry.faces[i + 1].color.setHex(hex);
    }
    const material = new THREE.MeshPhongMaterial({ vertexColors: THREE.FaceColors});
    return new THREE.Mesh(geometry, material);
  }

  public createCylinder(): THREE.Mesh {
    const cylinderSize: number = this.sizeGenerator();
    const geometry = new THREE.CylinderGeometry(cylinderSize / 2, cylinderSize / 2, cylinderSize, 32);

    this.setColor(geometry);
    const material = new THREE.MeshPhongMaterial({ vertexColors: THREE.FaceColors});
    let cylinder = new THREE.Mesh(geometry, material);
    cylinder.rotation.x = 0.5;
    return cylinder;
  }

  public createPyramid(): THREE.Mesh {
    const pyramidSize: number = this.sizeGenerator();
    const geometry = new THREE.CylinderGeometry(0, pyramidSize / 2, pyramidSize, 3, 1);
    this.setColor(geometry);
    
    const material = new THREE.MeshPhongMaterial({ vertexColors: THREE.FaceColors});
    return new THREE.Mesh(geometry, material);
  }

  private setColor(geo: THREE.Geometry): void {
    const hex = Math.random() * 0xffffff;
    for (let i = 0; i < geo.faces.length; i += 2) {
      geo.faces[i].color.setHex(hex);
      geo.faces[i + 1].color.setHex(hex);
    }
  }
}
