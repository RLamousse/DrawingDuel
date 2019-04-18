import {TestBed} from "@angular/core/testing";
import Axios from "axios";
import MockAdapter from "axios-mock-adapter";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
import AxiosAdapter from "axios-mock-adapter";
import * as HttpStatus from "http-status-codes";
import {Scene, Vector3} from "three";
import {GAME_MANAGER_FREE, SERVER_BASE_URL} from "../../../../../common/communication/routes";
import {IFreeGame} from "../../../../../common/model/game/free-game";
import {IScene} from "../../scene-interface";
import {FreeGameCreatorService} from "../FreeGameCreator/free-game-creator.service";
import {FreeGamePhotoService} from "./free-game-photo.service";

// tslint:disable:no-any
describe("FreeGamePhotoService", () => {

  const mockIFreeGame: IFreeGame = {
    scenes: {
      differentObjects: [],
      modifiedObjects: [],
      originalObjects: [],
    },
    thumbnail: "",
    gameName: "success",
    toBeDeleted: false,
    bestMultiTimes: [],
    bestSoloTimes: [],
  };

  class MockCreatorService {
    public createScenes(): IScene {
      return {
        scene: new Scene(),
        modifiedScene: new Scene(),
      };
    }
  }
  const mockCreatorService: MockCreatorService = new MockCreatorService();

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      FreeGamePhotoService,
      {provide: FreeGameCreatorService, useValue: mockCreatorService},
    ],
  }));

  it("should be created", () => {
    const service: FreeGamePhotoService = TestBed.get(FreeGamePhotoService);
    expect(service).toBeTruthy();
  });

  it("should initialize the camera, divElement and renderer on creation", () => {
    const service: FreeGamePhotoService = TestBed.get(FreeGamePhotoService);
    expect(service["camera"]).toBeDefined();
    expect(service["renderer"]).toBeDefined();
    expect(service["divElem"]).toBeDefined();
  });

  // Test takePhoto
  it("should set the camera to the right position and the renderer clear color", async() => {
    const service: FreeGamePhotoService = TestBed.get(FreeGamePhotoService);
    spyOn(service as any, "putThumbnail").and.returnValue(true);
    spyOn(service as any, "getFreeGameScene").and.returnValue(new Scene());

    return service.takePhoto("").then(() => {
      expect(service["camera"].position).toEqual(new Vector3(0, 0, service["cameraZ"]));
      expect(service["renderer"].getClearColor().getHex()).toEqual(service["backGroundColor"]);
    });
  });

  // Test getFreeGameName
  it("should throw an error when Axios.get catch an error on call of getFreeGameScene", async() => {
    const service: FreeGamePhotoService = TestBed.get(FreeGamePhotoService);
    const axiosMock: MockAdapter = new AxiosAdapter(Axios);
    const CONTROLLER_BASE_URL: string = SERVER_BASE_URL + GAME_MANAGER_FREE;
    const ALL_GET_CALLS_REGEX: RegExp = new RegExp(`${CONTROLLER_BASE_URL}/*`);
    axiosMock.onGet(ALL_GET_CALLS_REGEX).reply(HttpStatus.NOT_FOUND);

    return service["getFreeGameScene"]("mock").catch((reason: Error) => {
      expect(reason.message).toEqual("Request failed with status code 404");
    });
  });

  it("should return a Scene after a good call of getFreeGameScene", async(done) => {
    const service: FreeGamePhotoService = TestBed.get(FreeGamePhotoService);
    const axiosMock: MockAdapter = new AxiosAdapter(Axios);
    const CONTROLLER_BASE_URL: string = SERVER_BASE_URL + GAME_MANAGER_FREE;
    const ALL_GET_CALLS_REGEX: RegExp = new RegExp(`${CONTROLLER_BASE_URL}/*`);
    axiosMock.onGet(ALL_GET_CALLS_REGEX).reply(HttpStatus.OK, mockIFreeGame);
    const scene: Scene = (await service["getFreeGameScene"]("mock"));
    expect(scene).toBeDefined();
    done();
  });

  // Test putThumbnail
  it("should throw an error when Axios.put catch an error on call of putThumbnail", async() => {
    const service: FreeGamePhotoService = TestBed.get(FreeGamePhotoService);
    const axiosMock: MockAdapter = new AxiosAdapter(Axios);
    const CONTROLLER_BASE_URL: string = SERVER_BASE_URL + GAME_MANAGER_FREE;
    const ALL_GET_CALLS_REGEX: RegExp = new RegExp(`${CONTROLLER_BASE_URL}/*`);
    axiosMock.onPut(ALL_GET_CALLS_REGEX).reply(HttpStatus.NOT_FOUND);

    return service["putThumbnail"]("data", "mock").catch((reason: Error) => {
      expect(reason.message).toEqual("Request failed with status code 404");
    });
  });
});
