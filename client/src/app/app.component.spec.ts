// tslint:disable:no-any les attributs sont des types any
// tslint:disable:no-floating-promises pour le before each
import { TestBed, async, ComponentFixture } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { IndexService } from "./index.service";
import { HttpClientModule } from "@angular/common/http";
import { VueComponent } from './vue/vue.component';
import { FormsModule } from '@angular/forms'
describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        VueComponent
      ],
<<<<<<< HEAD
      imports: [HttpClientModule, FormsModule],
      providers: [BasicService]
=======
      imports: [HttpClientModule],
      providers: [IndexService]
>>>>>>> dev
    }).compileComponents();
  }));
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
