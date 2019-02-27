import { Component } from "@angular/core";

@Component({
  selector: "app-compteur-diff",
  templateUrl: "./compteur-diff.component.html",
  styleUrls: ["./compteur-diff.component.css"],
})
export class CompteurDiffComponent {
  protected diffNumber: number = 0;
}
