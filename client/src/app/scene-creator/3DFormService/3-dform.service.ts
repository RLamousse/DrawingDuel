import { Injectable } from "@angular/core";
import * as THREE from "three";
@Injectable()
export class Form3DService {

  private readonly BASE_SIZE: number = 20;
  private readonly MAX_SIZE_FACTOR: number = 150;
  private readonly MIN_SIZE_FACTOR: number = 50;
  private readonly SEGMENTS: number = 32;
  private readonly RADIUS_FACTOR: number = 2;
  private readonly COLOR_MASK: number = 0xFFFFFF;

  private sizeGenerator(): number {
    const percentFactor: number = 100;

    return (
      Math.floor(Math.random() * (this.MAX_SIZE_FACTOR - this.MIN_SIZE_FACTOR + 1) + this.MIN_SIZE_FACTOR) /
      percentFactor * this.BASE_SIZE
    );
  }

  public createCube(): THREE.Mesh {
    const cubeSide: number = this.sizeGenerator();
    const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(cubeSide, cubeSide, cubeSide);
    const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: (Math.random() * this.COLOR_MASK) });

    return new THREE.Mesh(geometry, material);
  }

  public createSphere(): THREE.Mesh {
    const sphereRadius: number = this.sizeGenerator() / this.RADIUS_FACTOR;
    const geometry: THREE.SphereGeometry = new THREE.SphereGeometry(sphereRadius, this.SEGMENTS, this.SEGMENTS);
    const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: (Math.random() * this.COLOR_MASK) });

    return new THREE.Mesh(geometry, material);
  }

  public createCone(): THREE.Mesh {
    const coneSize: number = this.sizeGenerator();
    const geometry: THREE.ConeGeometry = new THREE.ConeGeometry(
      coneSize / this.RADIUS_FACTOR,
      coneSize,
      this.SEGMENTS,
    );
    const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: (Math.random() * this.COLOR_MASK) });

    return new THREE.Mesh(geometry, material);
  }

  public createCylinder(): THREE.Mesh {
    const cylinderSize: number = this.sizeGenerator();
    const geometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
      cylinderSize / this.RADIUS_FACTOR,
      cylinderSize / this.RADIUS_FACTOR,
      cylinderSize,
      this.SEGMENTS,
    );
    const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: (Math.random() * this.COLOR_MASK) });

    return new THREE.Mesh(geometry, material);
  }

  public createPyramid(): THREE.Mesh {
    const pyramidSize: number = this.sizeGenerator();
    const baseSides: number = 3;
    const geometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
      0,
      pyramidSize / this.RADIUS_FACTOR,
      pyramidSize,
      baseSides,
      1,
    );
    const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: (Math.random() * this.COLOR_MASK) });

    return new THREE.Mesh(geometry, material);
  }
}
