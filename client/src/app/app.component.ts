import { Component, OnInit } from "@angular/core";
import { Message } from "../../../common/communication/message";
import { IndexService } from "./index.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
<<<<<<< HEAD
  public constructor(private basicService: BasicService) { }
=======
    public constructor(private basicService: IndexService) { }
>>>>>>> dev

  public readonly title: string = "LOG2990";
  public message: string;
  public userNameList: string[];

    public ngOnInit(): void {
      this.basicService.basicGet().subscribe((message: Message) => this.message = message.title + message.body);
    }
}
