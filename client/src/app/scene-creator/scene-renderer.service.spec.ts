import { TestBed } from "@angular/core/testing";
import Axios from "axios";
import MockAdapter from "axios-mock-adapter";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
import AxiosAdapter from "axios-mock-adapter";
import * as HttpStatus from "http-status-codes";
import * as THREE from "three";
import {DIFF_VALIDATOR_3D_BASE, SERVER_BASE_URL} from "../../../../common/communication/routes";
import { ComponentNotLoadedError } from "../../../../common/errors/component.errors";
import {NoDifferenceAtPointError} from "../../../../common/errors/services.errors";
import { SceneRendererService } from "./scene-renderer.service";
/* tslint:disable:no-magic-numbers*/
describe("SceneRendererService", () => {
  let axiosMock: MockAdapter;
  const CONTROLLER_BASE_URL: string = SERVER_BASE_URL + DIFF_VALIDATOR_3D_BASE;
  const ALL_GET_CALLS_REGEX: RegExp = new RegExp(`${CONTROLLER_BASE_URL}/*`);
  beforeEach(() => {
    axiosMock = new AxiosAdapter(Axios);

    return TestBed.configureTestingModule({
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

    expect(() => service.loadScenes(original, modified, "gameName"))
      .toThrowError(ComponentNotLoadedError.COMPONENT_NOT_LOADED_MESSAGE_ERROR);
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
    service.loadScenes(original, modified, "gameName");
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
    service.loadScenes(original1, modified1, "gameName");
    service.loadScenes(original2, modified2, "gameName");
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

  // Test objDiffValidation
  it("should throw if no object at clicked point on original scene", async() => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    axiosMock.onGet(ALL_GET_CALLS_REGEX)
      .reply(HttpStatus.NOT_FOUND);

    const original: THREE.Scene = new THREE.Scene();
    const modified: THREE.Scene = new THREE.Scene();
    const oriCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    const modCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    service.init(oriCont, modCont);
    service.loadScenes(original, modified, "gameName");

    return service.objDiffValidation(325, 430)
      .catch((reason: Error) => {
        expect(reason.message).toEqual(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
      });
  });

  it("should throw if no object at clicked point on modified scene", async() => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    axiosMock.onGet(ALL_GET_CALLS_REGEX)
      .reply(HttpStatus.NOT_FOUND);
    const original: THREE.Scene = new THREE.Scene();
    const modified: THREE.Scene = new THREE.Scene();
    const oriCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    const modCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    service.init(oriCont, modCont);
    service.loadScenes(original, modified, "gameName");

    return service.objDiffValidation(1120, 430)
      .catch((reason: Error) => {
        expect(reason.message).toEqual(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
      });
  });

  it("should throw if no difference at point", async() => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);

    axiosMock.onGet(ALL_GET_CALLS_REGEX)
      .reply(HttpStatus.NOT_FOUND);

    const original: THREE.Scene = new THREE.Scene();
    const modified: THREE.Scene = new THREE.Scene();
    const oriCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    const modCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial();
    const geo: THREE.BoxGeometry = new THREE.BoxGeometry();
    const mesh: THREE.Mesh = new THREE.Mesh(geo, material);
    mesh.position.set(0, 0, 97);
    original.add(mesh);
    modified.add(mesh.clone());
    service.init(oriCont, modCont);
    service.loadScenes(original, modified, "gameName");

    return service.objDiffValidation(325, 430)
      .catch((reason: Error) => {
        expect(reason.message).toEqual(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
      });
  });

  it("should throw an unexpected server response", async() => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);

    axiosMock.onGet(ALL_GET_CALLS_REGEX)
      .reply(HttpStatus.INTERNAL_SERVER_ERROR);

    const original: THREE.Scene = new THREE.Scene();
    const modified: THREE.Scene = new THREE.Scene();
    const oriCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    const modCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    service.init(oriCont, modCont);
    service.loadScenes(original, modified, "gameName");

    return service.objDiffValidation(325, 430)
      .catch((reason: Error) => {
        expect(reason.message).toEqual("Request failed with status code 500");
      });
  });
});
