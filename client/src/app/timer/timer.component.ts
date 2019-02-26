import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.css"],
})
export class TimerComponent implements OnInit {

  public minutes: number = 0;
  public seconds: number = 0;

  private readonly maxSeconds: number = 59;
  private readonly milliseconds: number = 1000;

  public ngOnInit(): void {
    setInterval(() => {
      if (this.seconds === this.maxSeconds) {
        this.seconds = 0;
        this.minutes ++;
      } else {
        this.seconds ++;
      }
    },
                this.milliseconds);
  }
}