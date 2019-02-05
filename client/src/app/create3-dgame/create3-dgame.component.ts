import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, } from "@angular/material";

@Component({
  selector: "app-create3-dgame",
  templateUrl: "./create3-dgame.component.html",
  styleUrls: ["./create3-dgame.component.css"],
})
export class Create3DGameComponent implements OnInit {

  public constructor(private dialogRef: MatDialogRef<Create3DGameComponent>, @Inject(MAT_DIALOG_DATA) public data: string) { }

  public ngOnInit(): void {/*vide*/}

  public close(): void {
    this.dialogRef.close();
  }
}
