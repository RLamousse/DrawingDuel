import {ComponentType} from "@angular/cdk/portal";
import {MatDialog, MatDialogConfig} from "@angular/material";

export interface OpenDialogOptionalParameters {
  data?: Object;
  callback?(): void;
}

export const openDialog:
  <T>(dialog: MatDialog, dialogComponent: ComponentType<T>, optionalParams: OpenDialogOptionalParameters) => void =
  <T>(dialog: MatDialog, dialogComponent: ComponentType<T>, optionalParams: OpenDialogOptionalParameters) => {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    if (optionalParams.data) {
      dialogConfig.data = optionalParams.data;
    }
    optionalParams.callback ?
      dialog.open(dialogComponent, dialogConfig).afterClosed().subscribe(optionalParams.callback)
      : dialog.open(dialogComponent, dialogConfig);
  };
