import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { StartedHunt } from 'src/app/startHunt/startedHunt';
import { Task } from 'src/app/hunts/task';
import { HuntCardComponent } from 'src/app/hunts/hunt-card.component';
import { HostService } from 'src/app/hosts/host.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-hunter-view',
  standalone: true,
  imports: [HuntCardComponent, CommonModule, MatCardModule, MatIconModule, WebcamModule],
  templateUrl: './hunter-view.component.html',
  styleUrl: './hunter-view.component.scss'
})

export class HunterViewComponent implements OnInit, OnDestroy {
  startedHunt: StartedHunt;
  tasks: Task[] = [];
  error: { help: string, httpResponse: string, message: string };
  imageUrls = {};

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private hostService: HostService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  stream = null;
  status = null;
  trigger: Subject<void> = new Subject<void>();
  previewImage: string = '';
  btnLabel: string = 'Capture image';
  showWebcam: boolean = false;

  get $trigger(): Observable<void> {
    return this.trigger.asObservable();
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('accessCode')),
      switchMap((accessCode: string) => this.hostService.getStartedHunt(accessCode)),

      takeUntil(this.ngUnsubscribe)
      ).subscribe({
        next: startedHunt => {
          for (const task of startedHunt.completeHunt.tasks) {
            task.photos = [];
          }
          this.startedHunt = startedHunt;
          return;
        },
        error: _err => {
          this.error = {
            help: 'There is an error trying to load the tasks - Please try to run the hunt again',
            httpResponse: _err.message,
            message: _err.error?.title,
          };
        }
      });

    this.checkPermission();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // onFileSelected(event, task: Task): void {
  //   const file: File = event.target.files[0];
  //   const fileType = file.type;
  //   if (fileType.match(/image\/*/)) {
  //     if (this.imageUrls[task._id] && !window.confirm('An image has already been uploaded for this task. Are you sure you want to replace it?')) {
  //       return;
  //     }

  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = (event: ProgressEvent<FileReader>) => {
  //       this.imageUrls[task._id] = event.target.result.toString();
  //     };

  //     if (file) {
  //       if (task.photos.length > 0) {
  //         this.replacePhoto(file, task, this.startedHunt._id);
  //       }
  //       else {
  //         this.submitPhoto(file, task, this.startedHunt._id);
  //       }
  //     }
  //   }
  // }

  submitPhoto(file: File, task: Task, startedHuntId: string): void {
    this.hostService.submitPhoto(startedHuntId, task._id, file).subscribe({
      next: (photoId: string) => {
        task.status = true;
        task.photos.push(photoId);
        this.snackBar.open('Photo uploaded successfully', 'Close', {
          duration: 3000
        });
      },
      error: (error: Error) => {
        console.error('Error uploading photo', error);
        this.snackBar.open('Error uploading photo. Please try again', 'Close', {
          duration: 3000
        });
      },
    });
  }

  replacePhoto(file: File, task: Task, startedHuntId: string): void {
    this.hostService.replacePhoto(startedHuntId, task._id, task.photos[0], file).subscribe({
      next: (photoId: string) => {
        task.photos[0] = photoId;
        this.snackBar.open('Photo replaced successfully', 'Close', {
          duration: 3000
        });
      },
      error: (error: Error) => {
        console.error('Error replacing photo', error);
        this.snackBar.open('Error replacing photo. Please try again', 'Close', {
          duration: 3000
        });
      },
    });
  }

  currentTaskId: string;

  startCapture(taskId: string) {
    this.checkPermission();
    this.currentTaskId = taskId;
    this.status = 'Camera is getting accessed';
    this.btnLabel = 'Capture image';
    this.showWebcam = true;
  }

  snapshot(event: WebcamImage, task: Task) {
    console.log(event);
    this.imageUrls[task._id] = event.imageAsDataUrl;
    const photo: File = new File([this.dataURItoBlob(event.imageAsDataUrl)], 'photo.jpg');

    if (photo) {
      if (task.photos.length > 0) {
        this.replacePhoto(photo, task, this.startedHunt._id);
      }
      else {
        this.submitPhoto(photo, task, this.startedHunt._id);
      }
    }
  }

  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  cancelCapture() {
    this.showWebcam = false;
    this.status = null;
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.currentTaskId = null;
  }

  captureImage() {
    this.trigger.next();
    this.showWebcam = false;
    this.status = null;
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.currentTaskId = null;
  }

  checkPermission() {
    if (this.stream) {
      // If camera is already authorized, stop the stream and reset the permission
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        // Camera is available and authorized
        this.stream = stream;
      })
      .catch(err => {
        // Camera is not available or not authorized
        console.error(err);
        this.stream = null;
      });
  }
}
