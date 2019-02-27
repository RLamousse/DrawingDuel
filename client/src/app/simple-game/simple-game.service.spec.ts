import {TestBed} from "@angular/core/testing";
import Axios from "axios";
import MockAdapter from "axios-mock-adapter";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
import AxiosAdapter from "axios-mock-adapter";
import * as HttpStatus from "http-status-codes";
import {IDiffValidatorControllerResponse} from "../../../../common/communication/responses/diff-validator-controller.response";
import {SERVER_BASE_URL, DIFF_VALIDATOR_BASE} from "../../../../common/communication/routes";
import {AlreadyFoundDifferenceError, NoDifferenceAtPointError} from "../../../../common/errors/services.errors";
import {DifferenceCluster, DIFFERENCE_CLUSTER_POINTS_INDEX} from "../../../../common/model/game/simple-game";
import {ORIGIN} from "../../../../common/model/point";
import {SimpleGameService} from "./simple-game.service";

describe("SimpleGameService", () => {

  let axiosMock: MockAdapter;
  const CONTROLLER_BASE_URL: string = SERVER_BASE_URL + DIFF_VALIDATOR_BASE;
  const ALL_GET_CALLS_REGEX: RegExp = new RegExp(`${CONTROLLER_BASE_URL}/*`);

  beforeEach(() => {
    axiosMock = new AxiosAdapter(Axios);

    return TestBed.configureTestingModule({});
  });

  it("should be created", () => {
    const service: SimpleGameService = TestBed.get(SimpleGameService);
    expect(service).toBeTruthy();
  });

  it("should throw when there's no difference at point", async () => {
    const service: SimpleGameService = TestBed.get(SimpleGameService);
    service.gameName = "SimpleGameService-Test";

    axiosMock.onGet(ALL_GET_CALLS_REGEX)
      .reply(HttpStatus.NOT_FOUND);

    return service.validateDifferenceAtPoint(ORIGIN)
      .catch((reason: Error) => {
        expect(reason.message).toEqual(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
      });
  });

  it("should throw on unexpected server response", async () => {
    const service: SimpleGameService = TestBed.get(SimpleGameService);
    service.gameName = "SimpleGameService-Test";

    axiosMock.onGet(ALL_GET_CALLS_REGEX)
      .reply(HttpStatus.INTERNAL_SERVER_ERROR);

    return service.validateDifferenceAtPoint(ORIGIN)
      .catch((reason: Error) => {
        expect(reason.message).not.toEqual(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
      });
  });

  it("should return a difference cluster with successful call to server", async () => {
    const service: SimpleGameService = TestBed.get(SimpleGameService);
    service.gameName = "SimpleGameService-Test";

    axiosMock.onGet(ALL_GET_CALLS_REGEX)
      .reply(HttpStatus.OK,
             {
               differenceClusterCoords: [ORIGIN],
               differenceClusterId: 0,
             } as IDiffValidatorControllerResponse,
      );

    return service.validateDifferenceAtPoint(ORIGIN)
      .then((differenceCluster: DifferenceCluster) => {
        expect(differenceCluster[DIFFERENCE_CLUSTER_POINTS_INDEX]).toContain(ORIGIN);
      });
  });

  it("should throw if a difference cluster was already found", async () => {
    const service: SimpleGameService = TestBed.get(SimpleGameService);
    service.gameName = "SimpleGameService-Test";

    axiosMock.onGet(ALL_GET_CALLS_REGEX)
      .reply(HttpStatus.OK,
             {
               differenceClusterCoords: [ORIGIN],
               differenceClusterId: 0,
             } as IDiffValidatorControllerResponse,
      );

    await service.validateDifferenceAtPoint(ORIGIN);

    return service.validateDifferenceAtPoint(ORIGIN)
      .catch((reason: Error) => {
        expect(reason.message).toEqual(AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE);
      });
  });

  it("should update the difference count", async (done) => {
    const service: SimpleGameService = TestBed.get(SimpleGameService);
    service.gameName = "SimpleGameService-Test";

    axiosMock.onGet(ALL_GET_CALLS_REGEX)
      .reply(HttpStatus.OK,
             {
               differenceClusterCoords: [ORIGIN],
               differenceClusterId: 0,
             } as IDiffValidatorControllerResponse,
      );

    service.foundDifferencesCount.subscribe((diffCount: number) => {
      expect(diffCount).toEqual(1);
      done();
    });

    await service.validateDifferenceAtPoint(ORIGIN);
  });
});
