// tslint:disable:no-any les attributs sont des types any
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material";
import {ChildrenOutletContexts, RouterModule} from "@angular/router";
import { AppComponent } from "./app.component";
import { InitialViewComponent } from "./initial-view/initial-view.component";

describe("AppComponent", () => {
  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        InitialViewComponent,
      ],
      imports: [FormsModule, RouterModule, MatIconModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [ChildrenOutletContexts],
    });
    done();
  });

  it("should create the app", async(() => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const app: any = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'client'`, async(() => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const app: any = fixture.debugElement.componentInstance;
    expect(app.title).toEqual("LOG2990");
  }));
});
