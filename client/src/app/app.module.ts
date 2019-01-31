import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { IndexService } from "./index.service";
import { HttpClientModule } from "@angular/common/http";
import { SimpleGameCreatorFormComponent } from './simple-game-creator-form/simple-game-creator-form.component';

@NgModule({
  declarations: [
    AppComponent,
    SimpleGameCreatorFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [IndexService],
  bootstrap: [AppComponent]
})
export class AppModule { }
