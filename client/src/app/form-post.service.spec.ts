import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { BrowserModule } from "@angular/platform-browser";
import Axios from "axios";
import AxiosAdapter from "axios-mock-adapter";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
import MockAdapter from "axios-mock-adapter";
import * as HttpStatus from "http-status-codes";
import {SERVER_BASE_URL} from "../../../common/communication/routes";
import { FormPostService } from "./form-post.service";

describe("FormPostService", () => {
  let axiosMock: MockAdapter;

  beforeEach(() => {
    axiosMock = new AxiosAdapter(Axios);
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        HttpClientTestingModule,
      ],
    });
  });

  it("should be created", () => {
    const service: FormPostService = TestBed.get(FormPostService);
    expect(service).toBeTruthy();
  });

  it("should send a not undefined error message with Backend Error", async (done) => {
    const service: FormPostService = TestBed.get(FormPostService);
    // tslint:disable-next-line:typedef
    const errorSent = {
      message: "Test Message",
      type: "Testing",
      error: {
        message: "Test Message",
        name: "Max",
      },

    };

    axiosMock.onPost(SERVER_BASE_URL)
      .reply(HttpStatus.INTERNAL_SERVER_ERROR, errorSent);

    service.submitForm("", {}).subscribe(
      (data) => {
        done.fail();
      },
      (error: Error) => {
        expect(error.name).toEqual("Backend Error");
        expect(error.message).toEqual("Test Message");
        done();
      },
    );
  });

  it("should send a not undefined error message with Network Error", async (done) => {
    const service: FormPostService = TestBed.get(FormPostService);
    // tslint:disable-next-line:typedef
    axiosMock.onPost(SERVER_BASE_URL)
      .networkError();

    service.submitForm("", {}).subscribe(
      (data) => {
        done.fail();
      },
      (error: Error) => {
        expect(error.name).toEqual("Network Error");
        expect(error.message).toEqual(FormPostService.NETWORK_ERROR_MESSAGE);
        done();
      },
    );
  });

  it("should return success message on success", async (done) => {
    const service: FormPostService = TestBed.get(FormPostService);
    // tslint:disable-next-line:typedef
    axiosMock.onPost(SERVER_BASE_URL)
      .reply(HttpStatus.OK, {title: "success", body: "message"});

    service.submitForm("", {}).subscribe(
      (data) => {
        expect(data).toEqual({title: "success", body: "message"});
        done();
      },
      (error: Error) => {
        done.fail();
      },
    );
  });
});
