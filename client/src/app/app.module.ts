import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { IndexService } from "./index.service";
import { HttpClientModule } from "@angular/common/http";
import { VueAdminComponent } from './vue-admin/vue-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    VueAdminComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [IndexService],
  bootstrap: [AppComponent]
})
export class AppModule { }
