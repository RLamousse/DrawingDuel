// tslint:disable:typedef
import {expect} from "chai";
import * as HttpStatus from "http-status-codes";
import * as request from "supertest";
import {anything, anyString, instance, mock, when} from "ts-mockito";
import {IDiffValidatorControllerRequest} from "../../../common/communication/requests/diff-validator-controller.request";
import {DIFF_VALIDATOR_BASE} from "../../../common/communication/routes";
import {RequestFormatError} from "../../../common/errors/controller.errors";
import {Application} from "../app";
import {container} from "../inversify.config";
import {DiffValidatorService} from "../services/diff-validator.service";
import types from "../types";

const errorResponse = (errorMessage: string) => {
    return {
        message: errorMessage,
        error: {},
    };
};

class MockedDataBaseService {
}

describe("Diff validator controller", () => {
    let app: Express.Application;
    let mockedDiffValidatorService: DiffValidatorService;

    beforeEach(() => {
        container.rebind(types.DataBaseService).toConstantValue(instance(MockedDataBaseService));

        mockedDiffValidatorService = mock(DiffValidatorService);
        when(mockedDiffValidatorService.validatePoint(anyString(), anything()))
            .thenResolve(true);

        container.rebind(types.DiffValidatorService).toConstantValue(instance(mockedDiffValidatorService));

        app = container.get<Application>(types.Application).app;
    });

    it("should send an error if the game name is missing", async () => {
        return request(app)
            .get(DIFF_VALIDATOR_BASE)
            .query({coordX: 0, coordY: 0})
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
            });
    });

    it("should send an error if the clicked coord is missing", async () => {
        return request(app)
            .get(DIFF_VALIDATOR_BASE)
            .query({gameName: "ayylmao"})
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
            });
    });

    it("should return NOT_FOUND if the specified point is not part of difference", async () => {
        const query: IDiffValidatorControllerRequest = {
            gameName: "test3",
            coordX: 42,
            coordY: 42,
        };

        when(mockedDiffValidatorService.validatePoint(anyString(), anything()))
            .thenResolve(false);

        container.rebind(types.DiffValidatorService).toConstantValue(instance(mockedDiffValidatorService));

        return request(app)
            .get(DIFF_VALIDATOR_BASE)
            .query(query)
            .expect(HttpStatus.NOT_FOUND)
            .then((value) => {
                return expect(value).to.exist;
            });
    });

    it("should return a valid response in normal conditions", async () => {
        const query: IDiffValidatorControllerRequest = {
            gameName: "test3",
            coordX: 0,
            coordY: 0,
        };

        when(mockedDiffValidatorService.validatePoint(anyString(), anything()))
            .thenResolve(true);

        container.rebind(types.DiffValidatorService).toConstantValue(instance(mockedDiffValidatorService));

        return request(app)
            .get(DIFF_VALIDATOR_BASE)
            .query(query)
            .expect(HttpStatus.OK);
    });
});
