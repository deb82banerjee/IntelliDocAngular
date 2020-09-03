import { Component } from '@angular/core';
import { UploadService } from '../services/upload-service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { combineLatest, forkJoin } from 'rxjs';
import { CustomerService } from '../services/customer-service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  selectedFile: any = [];
  fileList: FileList;
  isLoading = false;

  constructor(private uploadService: UploadService,
    public alertController: AlertController, private router: Router, private customerSvc: CustomerService) {

  }

  onFileUpload(event) {
    if (!!event && !!event.target && !!event.target.files && event.target.files.length > 0) {
      this.fileList = event.target.files;
      let files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        if (this.selectedFile != null && this.selectedFile.length > 0
          && this.isFileFoundInArray(this.selectedFile, files[i])) {
          this.duplicateFileUploadAlert();
        }
        else {
          this.selectedFile.push(files[i]);
        }
      }
    }
  }

  isFileFoundInArray(arr, obj): boolean {
    let isFileFound: boolean = arr.findIndex(x => x.name == obj.name) != -1;
    return isFileFound;
  }


  async duplicateFileUploadAlert() {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert',
      mode: 'ios',
      header: 'Duplicate File Found',
      message: 'You have tried to upload duplicate file. We will remove the duplicate files.',
      buttons: [{
        text: 'Dismiss'
      }]
    });
    await alert.present();
  }

  async uploadFileConfirmation() {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert',
      mode: 'ios',
      header: 'Confirm Submit',
      message: 'Are you sure to submit the documents?',
      buttons: [
        {
          text: 'Cancel', handler: () => {
            alert.dismiss();
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.uploadFilesToServer();
          }
        }
      ]
    });
    await alert.present();
  }

  uploadFileClickEvent(event) {
    this.uploadFileConfirmation();
  }

  uploadFilesToServer() {
    this.isLoading = true;
    const response = [];
    for (var i = 0; i < this.selectedFile.length; i++) {
      response[i] = this.uploadService.upload(this.selectedFile[i]);
    }
    forkJoin(response).subscribe((resp: Array<any>) => {
      if (!!resp && resp.length > 0) {
        const successfulResults = resp.filter(x => x.statusText === "OK" && x.body.message.includes("Uploaded the file successfully"));
        if (!!successfulResults && successfulResults.length > 0) {
          this.uploadService.process().then((result) => {
            // Check customer details here
            if (!!result) {
              this.customerSvc.showInboxBadge = true;
              this.customerSvc.customer = result.body;
            }
            this.isLoading = false;

          });
          this.router.navigate(['app/tabs/tab2']);
        } else {
          // TODO: Show error message here
          this.isLoading = false;
        }
      }
    },
      err => { this.isLoading = false; console.log(err) });
  }

  deleteFile(index: number) {
    if (index !== -1) {
      this.selectedFile.splice(index, 1);
    }
  }
}
