// disabling magic numbers in tests
/* tslint:disable:no-magic-numbers */
import { TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { ComponentNotLoadedError } from "../../../../common/errors/component.errors";
import {IJson3DObject} from "../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import { SceneRendererService } from "./scene-renderer.service";

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
    service.loadScenes(original, modified);
    expect(service.scene).toBe(original);
    expect(service.modifiedScene).toBe(modified);
  });

  // disabling the max function length for this test because it is complex thus long
  // tslint:disable-next-line
  it("should make only diff objets blink when there is a blink event", async (done: DoneFn) => {
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
    service.loadScenes(original, modified);
    await service.modifyCheatState(async () => {
      return new Promise<IJson3DObject[]>((resolve) => {
        resolve([{position: [12, 0, 0]} as IJson3DObject]);
      });
    });
    // tslint tries to make updateThread const, but updateThread has a separate declaration and initialisation
    // tslint:disable-next-line:prefer-const
    let updateThread: NodeJS.Timeout;
    const failThread: NodeJS.Timeout = setTimeout(() => {
      clearInterval(updateThread);
      done.fail();
    },                                            1000);
    setInterval(() => {
      if (!original.children[0].visible && original.children[1].visible) {
        clearTimeout(failThread);
        clearInterval(updateThread);
        done();
      } else if (!original.children[1].visible) {
        clearTimeout(failThread);
        clearInterval(updateThread);
        done.fail();
      }
    },          20);
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
    service.loadScenes(original1, modified1);
    service.loadScenes(original2, modified2);
    expect(service.scene).toBe(original2);
    expect(service.modifiedScene).toBe(modified2);
  });
});
