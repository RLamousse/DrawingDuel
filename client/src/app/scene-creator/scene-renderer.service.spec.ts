import { TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { ComponentNotLoadedError } from "../../../../common/errors/component.errors";
import { SceneRendererService } from "./scene-renderer.service";
/* tslint:disable:no-magic-numbers*/
describe("SceneRendererService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SceneRendererService],
    });
  });

  it("should create", () => {
    const service: SceneRendererService = new SceneRendererService();
    expect(service).toBeDefined();
  });

  // Test loadScenes
  it("should throw an error if loadScenes is called before init(...)", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    const original: THREE.Scene = new THREE.Scene();
    const modified: THREE.Scene = new THREE.Scene();

    expect(() => service.loadScenes(original, modified)).toThrowError(ComponentNotLoadedError.COMPONENT_NOT_LOADED_MESSAGE_ERROR);
  });

  it("should asign scenes at first call", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    const original: THREE.Scene = new THREE.Scene();
    const modified: THREE.Scene = new THREE.Scene();
    const oriCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    const modCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    service.init(oriCont, modCont);
    service.up = false;
    service.down = false;
    service.left = false;
    service.right = false;
    service.rightClick = false;
    service.loadScenes(original, modified);
    expect(service.scene).toBe(original);
    expect(service.modifiedScene).toBe(modified);
  });

  it("should reasign the new scenes at second call", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    const original1: THREE.Scene = new THREE.Scene();
    const modified1: THREE.Scene = new THREE.Scene();
    const original2: THREE.Scene = new THREE.Scene();
    const modified2: THREE.Scene = new THREE.Scene();
    const oriCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    const modCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    service.init(oriCont, modCont);
    service.up = true;
    service.down = true;
    service.left = true;
    service.right = true;
    service.rightClick = true;
    service.loadScenes(original1, modified1);
    service.loadScenes(original2, modified2);
    expect(service.scene).toBe(original2);
    expect(service.modifiedScene).toBe(modified2);
  });

  // test moveForward
  it("should have the right boolean value after the function is called", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    service.moveForward(true);
    expect(service.up).toEqual(true);
    service.moveForward(false);
    expect(service.up).toEqual(false);
  });

  // test moveBackward
  it("should have the right boolean value after the function is called", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    service.moveBackward(true);
    expect(service.down).toEqual(true);
    service.moveBackward(false);
    expect(service.down).toEqual(false);
  });

  // test moveLeft
  it("should have the right boolean value after the function is called", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    service.moveLeft(true);
    expect(service.left).toEqual(true);
    service.moveLeft(false);
    expect(service.left).toEqual(false);
  });

  // test moveRight
  it("should have the right boolean value after the function is called", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    service.moveRight(true);
    expect(service.right).toEqual(true);
    service.moveRight(false);
    expect(service.right).toEqual(false);
  });

  // Test rightClickHold
  it("should assign the rightClick attribute the right value (true)", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    service.rightClick = true;
    service.rightClickHold(123, 235);
    expect(service.rightClick).toEqual(true);
    expect(service.oldX).toEqual(123);
    expect(service.oldY).toEqual(235);
    expect(service.deltaX).toEqual(0);
    expect(service.deltaY).toEqual(0);

  });

  it("should have the  old x and y position if bool is false)", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    service.rightClick = true;
    service.rightClickHold(10, 10);
    service.rightClick = false;
    service.rightClickHold(100, 100);
    expect(service.rightClick).toEqual(false);
    expect(service.oldX).toEqual(10);
    expect(service.oldY).toEqual(10);
    expect(service.deltaX).toEqual(0);
    expect(service.deltaY).toEqual(0);
  });

  // Test rotateCamera
  it("should have the right value of deltaX and deltaY (0 if not moving mouse)", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    service.oldX = 0;
    service.oldY = 0;
    service.rotateCamera(0, 0);
    expect(service.deltaY).toEqual(0);
    expect(service.deltaX).toEqual(0);
  });
  it("should have the right value of deltaX and deltaY (arbitrary moving)", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    service.oldX = 120;
    service.oldY = 150;
    service.rotateCamera(12, 611);
    // Delta-i formula: old-i - i-Pos / 4000
    expect(service.deltaY).toEqual((120 - 12) / 4000);
    expect(service.deltaX).toEqual((150 - 611) / 4000);
  });
});
