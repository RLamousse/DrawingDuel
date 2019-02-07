import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogModule, } from "@angular/material";
import { GameListComponent } from "../game-list/game-list.component";
import { GameComponent } from "../game-list/game/game.component";
import { VueAdminComponent } from "./vue-admin.component";

describe("VueAdminComponent", () => {
  let component: VueAdminComponent;
  let fixture: ComponentFixture<VueAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VueAdminComponent, GameListComponent, GameComponent],
      imports: [ MatDialogModule,  HttpClientModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VueAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

});