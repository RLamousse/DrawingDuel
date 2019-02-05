import { TestBed } from "@angular/core/testing";

import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserModule } from "@angular/platform-browser";
import { FormPostService } from "./form-post.service";

describe("FormPostService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        HttpClientTestingModule,
      ],
  }));

  it("should be created", () => {
    const service: FormPostService = TestBed.get(FormPostService);
    expect(service).toBeTruthy();
  });
});
