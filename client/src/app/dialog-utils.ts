import {ComponentType} from "@angular/cdk/portal";
import {MatDialog, MatDialogConfig} from "@angular/material";

export const openDialog: <T>(dialog: MatDialog, dialogComponent: ComponentType<T>, hasToRefresh: boolean, data?: Object) => void =
  <T>(dialog: MatDialog, dialogComponent: ComponentType<T>, hasToRefresh: boolean, data?: Object, ) => {
  const dialogConfig: MatDialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = true;
  if (data) { dialogConfig.data = data; }
  hasToRefresh ? dialog.open(dialogComponent, dialogConfig).afterClosed().subscribe(() => window.location.reload()) :
    dialog.open(dialogComponent, dialogConfig).afterClosed();
};
