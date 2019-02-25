import { TestBed } from "@angular/core/testing";
import Axios from "axios";
import MockAdapter from "axios-mock-adapter";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
import AxiosAdapter from "axios-mock-adapter";
import * as HttpStatus from "http-status-codes";
import {DifferenceCluster} from "../../../../common/model/game/simple-game";
import {ORIGIN} from "../../../../common/model/point";
import {NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE, SimpleGameService} from "./simple-game.service";

describe("SimpleGameService", () => {

  let axiosMock: MockAdapter;

  beforeEach(() => {
    axiosMock = new AxiosAdapter(Axios);

    return TestBed.configureTestingModule({});
  });

  it("should be created", () => {
    const service: SimpleGameService = TestBed.get(SimpleGameService);
    expect(service).toBeTruthy();
  });

  it("should throw when there's no difference at point", () => {
    const service: SimpleGameService = TestBed.get(SimpleGameService);
    service.gameName = "SimpleGameService-Test";

    axiosMock.onGet("http://localhost:3000/api/diff-validator/")
      .reply(HttpStatus.NOT_FOUND);

    return service.validateDifferenceAtPoint(ORIGIN)
      .catch((reason: Error) => {
        expect(reason.message).toEqual(NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
      });
  });

  it("should throw on unexpected server response", () => {
    const service: SimpleGameService = TestBed.get(SimpleGameService);
    service.gameName = "SimpleGameService-Test";

    axiosMock.onGet("http://localhost:3000/api/diff-validator/")
      .reply(HttpStatus.INTERNAL_SERVER_ERROR);

    return service.validateDifferenceAtPoint(ORIGIN)
      .catch((reason: Error) => {
        expect(reason).toBeDefined();
      });
  });

  it("should return a difference cluster with successful call to server", () => {
    const service: SimpleGameService = TestBed.get(SimpleGameService);
    service.gameName = "SimpleGameService-Test";

    axiosMock.onGet("http://localhost:3000/api/diff-validator/")
      .reply(HttpStatus.OK, [0, [ORIGIN]] as DifferenceCluster);

    return service.validateDifferenceAtPoint(ORIGIN)
      .catch((reason: Error) => {
        expect(reason).toBeDefined();
      });
  });

  it("should throw if a difference cluster was already found", () => {
    fail();
  });

  it("should update the difference count", () => {
    fail();
  });
});
