import {TestBed} from "@angular/core/testing";
import Axios from "axios";
import MockAdapter from "axios-mock-adapter";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
import AxiosAdapter from "axios-mock-adapter";
import * as HttpStatus from "http-status-codes";
import {DB_SIMPLE_GAME, DIFF_VALIDATOR_BASE, SERVER_BASE_URL} from "../../../../common/communication/routes";
import {AlreadyFoundDifferenceError, NoDifferenceAtPointError} from "../../../../common/errors/services.errors";
import {DifferenceCluster, DIFFERENCE_CLUSTER_POINTS_INDEX} from "../../../../common/model/game/simple-game";
import {ORIGIN} from "../../../../common/model/point";
import {SimpleGameService} from "./simple-game.service";

describe("SimpleGameService", () => {

  let axiosMock: MockAdapter;
  let service: SimpleGameService;
  const DIFF_VALIDATOR_URL: string = SERVER_BASE_URL + DIFF_VALIDATOR_BASE;
  const DIFF_VALIDATOR_GET_CALLS_REGEX: RegExp = new RegExp(`${DIFF_VALIDATOR_URL}/*`);
  const DB_URL: string = SERVER_BASE_URL + DB_SIMPLE_GAME;
  const DB_GET_CALLS_REGEX: RegExp = new RegExp(`${DB_URL}/*`);

  beforeEach(() => {
    axiosMock = new AxiosAdapter(Axios);

    axiosMock.onGet(DB_GET_CALLS_REGEX)
      .reply(HttpStatus.OK, {diffData: [0, [ORIGIN]]});

    return TestBed.configureTestingModule({});
  });

  beforeEach(() => {
    service = TestBed.get(SimpleGameService);
    service.gameName = "SimpleGameService-Test";
    // @ts-ignore Mock certain properties of object
    service["_game"] = {
      diffData: [[0, [ORIGIN]]],
    };
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should throw when there's no difference at point", async () => {
    axiosMock.onGet(DIFF_VALIDATOR_GET_CALLS_REGEX)
      .reply(HttpStatus.NOT_FOUND);

    return service.validateDifferenceAtPoint(ORIGIN)
      .catch((reason: Error) => {
        expect(reason.message).toEqual(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
      });
  });

  it("should throw on unexpected server response", async () => {
    axiosMock.onGet(DIFF_VALIDATOR_GET_CALLS_REGEX)
      .reply(HttpStatus.INTERNAL_SERVER_ERROR);

    return service.validateDifferenceAtPoint(ORIGIN)
      .catch((reason: Error) => {
        expect(reason.message).not.toEqual(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
      });
  });

  it("should return a difference cluster with successful call to server", async () => {
    axiosMock.onGet(DIFF_VALIDATOR_GET_CALLS_REGEX)
      .reply(HttpStatus.OK);

    return service.validateDifferenceAtPoint(ORIGIN)
      .then((differenceCluster: DifferenceCluster) => {
        expect(differenceCluster[DIFFERENCE_CLUSTER_POINTS_INDEX]).toContain(ORIGIN);
      });
  });

  it("should throw if a difference cluster was already found", async () => {
    axiosMock.onGet(DIFF_VALIDATOR_GET_CALLS_REGEX)
      .reply(HttpStatus.OK);

    await service.validateDifferenceAtPoint(ORIGIN);

    return service.validateDifferenceAtPoint(ORIGIN)
      .catch((reason: Error) => {
        expect(reason.message).toEqual(AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE);
      });
  });

  it("should update the difference count", async (done) => {
    axiosMock.onGet(DIFF_VALIDATOR_GET_CALLS_REGEX)
      .reply(HttpStatus.OK);

    service.foundDifferencesCount.subscribe((diffCount: number) => {
      expect(diffCount).toEqual(1);
      done();
    });

    await service.validateDifferenceAtPoint(ORIGIN);
  });
});
