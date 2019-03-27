// disabling magic numbers in tests
/* tslint:disable:no-magic-numbers */
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
import {IJson3DObject} from "../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {SocketService} from "../socket.service";
import {RenderUpdateService} from "./render-update.service";
import { SceneRendererService } from "./scene-renderer.service";
describe("SceneRendererService", () => {
  let axiosMock: MockAdapter;
  const CONTROLLER_BASE_URL: string = SERVER_BASE_URL + DIFF_VALIDATOR_3D_BASE;
  const ALL_GET_CALLS_REGEX: RegExp = new RegExp(`${CONTROLLER_BASE_URL}/*`);

  // tslint:disable-next-line:typedef
  class MockRenderUpdate extends RenderUpdateService {
    public messageCam: string = "";
    public messageVel: string = "";
    public updateCamera(): void {
      this.messageCam = "updateCamera was called";
    }
    public updateVelocity(): void {
      this.messageVel = "updateVelocity was called";
    }
  }
  let mockUpdateRender: MockRenderUpdate;
  beforeEach(() => {
    axiosMock = new AxiosAdapter(Axios);
    mockUpdateRender = new MockRenderUpdate();

    return TestBed.configureTestingModule({
      providers: [
        SceneRendererService,
        {provide: RenderUpdateService, useValue: mockUpdateRender},
        SocketService,
      ],
    });
  });

  it("should create", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
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
    service.loadScenes(original, modified, "gameName");
    expect(service.scene).toBe(original);
    expect(service.modifiedScene).toBe(modified);
  });

  // disabling the max function length for this test because it is complex thus long
  // tslint:disable-next-line
  it("should make only diff objets blink when there is a blink event", async (done: DoneFn) => {
    jasmine.clock().install();
    const service: SceneRendererService = TestBed.get(SceneRendererService);

    const original: THREE.Scene = new THREE.Scene();
    const modified: THREE.Scene = new THREE.Scene();

    const diffObject: THREE.Mesh = new THREE.Mesh();
    const notDiffObject: THREE.Mesh = new THREE.Mesh();
    diffObject.translateX(12);
    original.add(diffObject);
    original.add(notDiffObject);

    const oriCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    const modCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    service.init(oriCont, modCont);
    service.loadScenes(original, modified, "someGame");
    await service.modifyCheatState(async () => {
      return new Promise<IJson3DObject[]>((resolve) => {
        resolve([{position: [12, 0, 0]} as IJson3DObject]);
      });
    });
    jasmine.clock().tick(300);
    if (!((original.children[0] as THREE.Mesh).material as THREE.Material).visible &&
      ((original.children[1] as THREE.Mesh).material as THREE.Material).visible) {
      done();
    } else {
      done.fail();
    }
    jasmine.clock().uninstall();
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
    service.loadScenes(original1, modified1, "gameName");
    service.loadScenes(original2, modified2, "gameName");
    expect(service.scene).toBe(original2);
    expect(service.modifiedScene).toBe(modified2);
  });

  it("should have called updateCamera and velocity after loadScenes is called", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    const original: THREE.Scene = new THREE.Scene();
    const modified: THREE.Scene = new THREE.Scene();
    const oriCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    const modCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    service.init(oriCont, modCont);
    service.loadScenes(original, modified, "gameName");
    expect(mockUpdateRender.messageVel).toEqual("updateVelocity was called");
    expect(mockUpdateRender.messageCam).toEqual("updateCamera was called");
  });

  it("should update the gameName after loadScenes is called", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    const original: THREE.Scene = new THREE.Scene();
    const modified: THREE.Scene = new THREE.Scene();
    const oriCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    const modCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    service.init(oriCont, modCont);
    service.loadScenes(original, modified, "gameNameExpected");
    expect(service.gameName).toEqual("gameNameExpected");
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
        expect(reason.message).toContain("Request failed with status code 500");
      });
  });
});
