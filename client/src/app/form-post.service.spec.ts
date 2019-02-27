import { HttpClientTestingModule, HttpTestingController, TestRequest } from "@angular/common/http/testing";
import { getTestBed, TestBed } from "@angular/core/testing";
import { BrowserModule } from "@angular/platform-browser";
import { FormPostService } from "./form-post.service";

describe("FormPostService", () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        HttpClientTestingModule,
      ],
    });
    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
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
    service.submitForm("", {}).subscribe(
      (data) => {
        //
      },
      (error: Error) => {
        expect(error.name).toEqual("Backend Error");
        expect(error.message).toEqual("Test Message");
        done();
      },
    );
    const req: TestRequest = httpMock.expectOne("http://localhost:3000");
    req.error(errorSent as ErrorEvent);
    expect(req.request.method).toBe("POST");
  });

  it("should send a not undefined error message with Network Error", async (done) => {
    const service: FormPostService = TestBed.get(FormPostService);
    // tslint:disable-next-line:typedef
    const errorSent = new ErrorEvent("Maxime");

    service.submitForm("", {}).subscribe(
      (data) => {
        //
      },
      (error: Error) => {
        expect(error.name).toEqual("Network Error");
        expect(error.message).toEqual(FormPostService.NETWORK_ERROR_MESSAGE);
        done();
      },
    );
    const req: TestRequest = httpMock.expectOne("http://localhost:3000");
    req.error(errorSent as ErrorEvent);
    expect(req.request.method).toBe("POST");
  });
});
