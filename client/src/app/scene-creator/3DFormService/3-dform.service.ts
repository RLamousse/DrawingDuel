import { Injectable } from "@angular/core";
import * as THREE from "three";
@Injectable()
export class Form3DService {

  private baseSize: number = 20;
  private maxSizeFactor: number = 150;
  private minSizeFactor: number = 50;
  private segments: number = 32;
  private radiusFactor: number = 2;
  private material: THREE.MeshPhongMaterial;
  private colorMask: number = 0xFFFFFF;

  private sizeGenerator(): number {
    const percentFactor: number = 100;

    return (Math.floor(Math.random() * (this.maxSizeFactor - this.minSizeFactor + 1) + this.minSizeFactor) / percentFactor * this.baseSize);
  }

  public createCube(): THREE.Mesh {
    const cubeSide: number = this.sizeGenerator();
    const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(cubeSide, cubeSide, cubeSide);
    this.material = new THREE.MeshPhongMaterial({ color: (Math.random() * this.colorMask) });

    return new THREE.Mesh(geometry, this.material);
  }

  public createSphere(): THREE.Mesh {
    const sphereRadius: number = this.sizeGenerator() / this.radiusFactor;
    const geometry: THREE.SphereGeometry = new THREE.SphereGeometry(sphereRadius, this.segments, this.segments);
    this.material = new THREE.MeshPhongMaterial({ color: (Math.random() * this.colorMask) });

    return new THREE.Mesh(geometry, this.material);
  }

  public createCone(): THREE.Mesh {
    const coneSize: number = this.sizeGenerator();
    const geometry: THREE.ConeGeometry = new THREE.ConeGeometry(
      coneSize / this.radiusFactor,
      coneSize,
      this.segments,
    );
    this.material = new THREE.MeshPhongMaterial({ color: (Math.random() * this.colorMask) });

    return new THREE.Mesh(geometry, this.material);
  }

  public createCylinder(): THREE.Mesh {
    const cylinderSize: number = this.sizeGenerator();
    const geometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
      cylinderSize / this.radiusFactor,
      cylinderSize / this.radiusFactor,
      cylinderSize,
      this.segments,
    );
    this.material = new THREE.MeshPhongMaterial({ color: (Math.random() * this.colorMask) });

    return new THREE.Mesh(geometry, this.material);
  }

  public createPyramid(): THREE.Mesh {
    const pyramidSize: number = this.sizeGenerator();
    const baseSides: number = 3;
    const geometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
      0,
      pyramidSize / this.radiusFactor,
      pyramidSize,
      baseSides,
      1,
    );
    this.material = new THREE.MeshPhongMaterial({ color: (Math.random() * this.colorMask) });

    return new THREE.Mesh(geometry, this.material);
  }
}
