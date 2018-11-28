import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.css']
})

export class DialogoComponent implements OnInit {

  Template: any = [DialogoOverview, DialogoConfirm];
  TemplateOptions = [
    {
      "minWidth": "40%",
      "minHeight": "80%",
      "class":"custom-modalbox"
    },
    {
      "minWidth": "20%",
      "minHeight": "10%",
      "class":""
    }
  ]

  /* Notifique at current component of the isntance of this class component */
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();

  constructor(public dialog: MatDialog, private AppComp: AppComponent) { }

  ngOnInit() {
  }

  @Input()
  OpenDialog(options: any, option?: number): void {
    if (!option) {
      option = 0;
    }
    const dialogRef = this.dialog.open(this.Template[option], {
      minWidth: this.TemplateOptions[option]["minWidth"],
      minHeight:  this.TemplateOptions[option]["minHeight"],
      disableClose: true,
      panelClass: this.TemplateOptions[option]["class"],
      data: options
    });
    dialogRef.afterClosed().subscribe(result => {
      this.notify.emit({ "action": options['action'], "data": result });
    })
  }
}

@Component({
  selector: 'app-dialog-overview',
  templateUrl: './dialogo-overview.component.html'
})
export class DialogoOverview {

  constructor(
    private dialogRef: MatDialogRef<DialogoOverview>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  close(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialogo-confirm.component.html'
})
export class DialogoConfirm {

  constructor(
    private dialogRef: MatDialogRef<DialogoConfirm>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  close(): void {
    this.dialogRef.close();
  }
}


