// disabling magic numbers in tests
/* tslint:disable:no-magic-numbers */
import {TestBed} from "@angular/core/testing";
import {BoxGeometry, Material, Mesh, MeshPhongMaterial, Scene} from "three";
import {ComponentNotLoadedError} from "../../../../common/errors/component.errors";
import {NoDifferenceAtPointError} from "../../../../common/errors/services.errors";
import {IJson3DObject} from "../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {ObjectCollisionService} from "./objectCollisionService/object-collision.service";
import {RenderUpdateService} from "./render-update.service";
import {SceneDiffValidator} from "./scene-diff-validator.service";
import {SceneRendererService} from "./scene-renderer.service";
describe("SceneRendererService", () => {

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

  class MockCollisionService {
    public raycastCollision(): void {
      return;
    }
  }
  const mockCollisionService: MockCollisionService = new MockCollisionService();

  let mockUpdateRender: MockRenderUpdate;
  let sceneDiffValidatorSpy: jasmine.SpyObj<SceneDiffValidator>;
  beforeEach(() => {
    mockUpdateRender = new MockRenderUpdate();
    sceneDiffValidatorSpy = jasmine.createSpyObj("SceneDiffValidator", ["validateDiffObject"]);

    return TestBed.configureTestingModule({
      providers: [
        SceneRendererService,
        {provide: RenderUpdateService, useValue: mockUpdateRender},
        {provide: ObjectCollisionService, useValue: mockCollisionService},
        {provide: SceneDiffValidator, useValue: sceneDiffValidatorSpy},
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
    const original: Scene = new Scene();
    const modified: Scene = new Scene();

    expect(() => service.loadScenes(original, modified))
      .toThrowError(ComponentNotLoadedError.COMPONENT_NOT_LOADED_MESSAGE_ERROR);
  });

  it("should assign scenes at first call", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    const original: Scene = new Scene();
    const modified: Scene = new Scene();
    const oriCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    const modCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    service.init(oriCont, modCont);
    service.loadScenes(original, modified);
    expect(service["scene"]).toBe(original);
    expect(service["modifiedScene"]).toBe(modified);
  });

  // disabling the max function length for this test because it is complex thus long
  // tslint:disable-next-line
  it("should make only diff objets blink when there is a blink event", async (done: DoneFn) => {
    jasmine.clock().install();
    const service: SceneRendererService = TestBed.get(SceneRendererService);

    const original: Scene = new Scene();
    const modified: Scene = new Scene();

    const diffObject: Mesh = new Mesh();
    const notDiffObject: Mesh = new Mesh();
    diffObject.translateX(12);
    original.add(diffObject);
    original.add(notDiffObject);

    const oriCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    const modCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    service.init(oriCont, modCont);
    service.loadScenes(original, modified);
    await service.modifyCheatState(async () => {
      return new Promise<IJson3DObject[]>((resolve) => {
        resolve([{position: {x: 12, y: 0, z: 0}} as IJson3DObject]);
      });
    });
    jasmine.clock().tick(300);
    if (!((original.children[0] as Mesh).material as Material).visible &&
      ((original.children[1] as Mesh).material as Material).visible) {
      done();
    } else {
      done.fail();
    }
    jasmine.clock().uninstall();
  });

  it("should reassign the new scenes at second call", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    const original1: Scene = new Scene();
    const modified1: Scene = new Scene();
    const original2: Scene = new Scene();
    const modified2: Scene = new Scene();
    const oriCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    const modCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    service.init(oriCont, modCont);
    service.loadScenes(original1, modified1);
    service.loadScenes(original2, modified2);
    expect(service["scene"]).toBe(original2);
    expect(service["modifiedScene"]).toBe(modified2);
  });

  it("should have called updateCamera and velocity after loadScenes is called", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    const original: Scene = new Scene();
    const modified: Scene = new Scene();
    const oriCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    const modCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    service.init(oriCont, modCont);
    service.loadScenes(original, modified);
    expect(mockUpdateRender.messageVel).toEqual("updateVelocity was called");
    expect(mockUpdateRender.messageCam).toEqual("updateCamera was called");
  });

  it("should update the gameName after loadScenes is called", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    const original: Scene = new Scene();
    const modified: Scene = new Scene();
    const oriCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    const modCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    service.init(oriCont, modCont);
    service.loadScenes(original, modified);
  });

  // Test objDiffValidation
  describe("Difference validation", () => {

    it("should throw if no object at clicked point on original scene", async () => {
      const service: SceneRendererService = TestBed.get(SceneRendererService);
      sceneDiffValidatorSpy.validateDiffObject
        .and.returnValue(Promise.reject(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE));

      const original: Scene = new Scene();
      const modified: Scene = new Scene();
      const oriCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
      const modCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
      service.init(oriCont, modCont);
      service.loadScenes(original, modified);

      return service.objDiffValidation({x: 325, y: 430})
        .catch((reason: Error) => {
          expect(reason.message).toEqual(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
        });
    });

    it("should throw if no object at clicked point on modified scene", async () => {
      const service: SceneRendererService = TestBed.get(SceneRendererService);
      sceneDiffValidatorSpy.validateDiffObject
        .and.returnValue(Promise.reject(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE));

      const original: Scene = new Scene();
      const modified: Scene = new Scene();
      const oriCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
      const modCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
      service.init(oriCont, modCont);
      service.loadScenes(original, modified);

      return service.objDiffValidation({x: 1120, y: 430})
        .catch((reason: Error) => {
          expect(reason.message).toEqual(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
        });
    });

    it("should throw if no intersection at point", async () => {
      const service: SceneRendererService = TestBed.get(SceneRendererService);

      sceneDiffValidatorSpy.validateDiffObject
        .and.returnValue(Promise.reject(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE));

      const original: Scene = new Scene();
      const modified: Scene = new Scene();
      const oriCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
      const modCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
      const material: MeshPhongMaterial = new MeshPhongMaterial();
      const geo: BoxGeometry = new BoxGeometry();
      const mesh: Mesh = new Mesh(geo, material);
      mesh.position.set(0, 0, 97);
      original.add(mesh);
      modified.add(mesh.clone());
      service.init(oriCont, modCont);
      service.loadScenes(original, modified);

      return service.objDiffValidation({x: 325, y: 430})
        .catch((reason: Error) => {
          expect(reason.message).toEqual(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
        });
    });

    it("should throw an unexpected server response on diff validator call", async () => {
      const service: SceneRendererService = TestBed.get(SceneRendererService);

      sceneDiffValidatorSpy.validateDiffObject
        .and.returnValue(Promise.reject("Error Message"));

      const material: MeshPhongMaterial = new MeshPhongMaterial();
      const geo: BoxGeometry = new BoxGeometry();
      const mesh: Mesh = new Mesh(geo, material);

      return service["differenceValidationAtPoint"](mesh)
        .catch((reason: Error) => {
          expect(reason.message).toContain("Error Message");
        });
    });
  });
});
