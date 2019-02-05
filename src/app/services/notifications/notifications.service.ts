import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, config } from 'rxjs';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackBarMessage } from './SnackBarMessage';

@Injectable({
  providedIn: 'root'
})
  export class NotificationsService implements OnDestroy {
    private messageQueue: Array<any> = Array<any>();
    private subscription: Subscription;
    private snackBarRef: MatSnackBarRef<SimpleSnackBar>;
    private isInstanceVisible = false;
  
    constructor(public snackBar: MatSnackBar) {}
  
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    /**
     * Add a message
     * @param message The message to show in the snackbar.
     * @param action The label for the snackbar action.
     * @param config Additional configuration options for the snackbar.
     * @param classOverride Adds a css class on the snackbar so you can add color.
  
     */
    show(
      message: string,
      action?: string,
      config?: MatSnackBarConfig | {panelClass:string | string[],duration:number},
      classOverride: string = 'blue-snackbar'
    ): void {
      if (!config) {
        config = new MatSnackBarConfig();
        config.duration = 3000;
        config.verticalPosition = 'bottom';
        config.horizontalPosition = 'end';
        config.panelClass = [classOverride];
      }
  
      const sbMessage = new SnackBarMessage();
      sbMessage.message = message;
      sbMessage.action = action;
      sbMessage.config = config;
  
      this.messageQueue.push(sbMessage);
  
      if (!this.isInstanceVisible) {
        this.showNext();
      }
    }
  
    private showNext() {
      if (this.messageQueue.length === 0) {
        return;
      }
  
      const message = this.messageQueue.shift();
      this.isInstanceVisible = true;
  
      this.snackBarRef = this.snackBar.open(
        message.message,
        message.action,
        message.config
      );
  
      this.snackBarRef.afterDismissed().subscribe(() => {
        this.isInstanceVisible = false;
        this.showNext();
      });
    }
  }