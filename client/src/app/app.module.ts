import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { BasicService } from "./basic.service";
import { HttpClientModule } from "@angular/common/http";
import { VueComponent } from './vue/vue.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 
@NgModule({
  declarations: [
    AppComponent,
    VueComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [BasicService],
  bootstrap: [AppComponent]
})
export class AppModule { }
