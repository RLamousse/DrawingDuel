// tslint:disable:typedef
// tslint:disable:no-any
import {expect} from "chai";
import * as HttpStatus from "http-status-codes";
import * as request from "supertest";
import {anything, anyString, instance, mock, when} from "ts-mockito";
import {I3DDiffValidatorControllerRequest} from "../../../common/communication/requests/diff-validator-controller.request";
import {DIFF_VALIDATOR_3D_BASE} from "../../../common/communication/routes";
import {RequestFormatError} from "../../../common/errors/controller.errors";
import {Object3DIsNotADifference} from "../../../common/errors/services.errors";
import {DEFAULT_OBJECT} from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {Application} from "../app";
import {container} from "../inversify.config";
import {DiffValidator3DService} from "../services/diff-validator-3D.service";
import types from "../types";
const errorResponse = (errorMessage: string) => {
    return {
        message: errorMessage,
        error: {},
    };
};
describe("Diff validator controller", () => {
    let app: Express.Application;
    let mockedDiffValidator3DService: DiffValidator3DService;

    beforeEach(() => {
        mockedDiffValidator3DService = mock(DiffValidator3DService);
        when(mockedDiffValidator3DService.getDifferentObjects(anyString(), anything()))
            .thenResolve(DEFAULT_OBJECT);

        container.rebind(types.DiffValidator3DService).toConstantValue(instance(mockedDiffValidator3DService));

        app = container.get<Application>(types.Application).app;
    });

    it("should send an error if the game name is missing", async () => {
        return request(app)
            .get(DIFF_VALIDATOR_3D_BASE)
            .query({"centerX": 0})
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
            });
    });
    it("should send an error if the clicked object center is missing", async () => {
        return request(app)
            .get(DIFF_VALIDATOR_3D_BASE)
            .query({gameName: "thisisagame"})
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
            });
    });
    it("should return NOT_FOUND if the specified clicked object is not a difference", async () => {
        const query: I3DDiffValidatorControllerRequest = {
            gameName: "test 8",
            centerX: 0,
            centerY: 0,
            centerZ: 0,
        };
        when(mockedDiffValidator3DService.getDifferentObjects(anyString(), anything()))
            .thenReject(new Object3DIsNotADifference());

        container.rebind(types.DiffValidator3DService).toConstantValue(instance(mockedDiffValidator3DService));

        return request(app)
            .get(DIFF_VALIDATOR_3D_BASE)
            .query(query)
            .expect(HttpStatus.NOT_FOUND)
            .then((value) => {
                return expect(value).to.exist;
            });
    });
    it("should return a valid response in normal conditions", async () => {
        const query: I3DDiffValidatorControllerRequest = {
            gameName: "test123",
            centerX: 0,
            centerY: 0,
            centerZ: 0,
        };

        return request(app)
            .get(DIFF_VALIDATOR_3D_BASE)
            .query(query)
            .expect(HttpStatus.OK)
            .then((response) => {
                expect(response.body).to.eql(DEFAULT_OBJECT);
            });
    });
});
