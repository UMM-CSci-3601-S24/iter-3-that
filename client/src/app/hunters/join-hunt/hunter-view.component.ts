import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { Task } from 'src/app/hunts/task';
import { HuntCardComponent } from 'src/app/hunts/hunt-card.component';
import { HostService } from 'src/app/hosts/host.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { Observable } from 'rxjs';
import { TeamHunt } from './teamHunt';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-hunter-view',
  standalone: true,
  imports: [
    HuntCardComponent,
    CommonModule,
    MatCardModule,
    MatIconModule,
    WebcamModule,
  ],
  templateUrl: './hunter-view.component.html',
  styleUrl: './hunter-view.component.scss',
})
export class HunterViewComponent implements OnInit, OnDestroy {
  teamHunt: TeamHunt;
  tasks: Task[] = [];
  error: { help: string; httpResponse: string; message: string };
  imageUrls = {};
  currentDeviceId: string;
  videoDevices: MediaDeviceInfo[] = [];
  currentDeviceIndex = 0;
  currentFacingMode: string = 'user';

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private hostService: HostService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) {}

  stream = null;
  status = null;
  trigger: Subject<void> = new Subject<void>();
  btnLabel: string = 'Capture image';
  showWebcam: boolean = false;

  get $trigger(): Observable<void> {
    return this.trigger.asObservable();
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params: ParamMap) => params.get('id')),
        switchMap((id: string) => this.hostService.getTeamHunt(id)),

        takeUntil(this.ngUnsubscribe)
      )
      .subscribe({
        next: (teamHunt) => {
          this.teamHunt = teamHunt;
          return;
        },
        error: (_err) => {
          this.error = {
            help: 'There is an error trying to load the tasks - Please try to run the hunt again',
            httpResponse: _err.message,
            message: _err.error?.title,
          };
        },
      });

    this.checkPermission();

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      this.videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      );
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  submitPhoto(file: File, task: Task, teamHuntId: string): void {
    this.hostService.submitPhoto(teamHuntId, task._id, file).subscribe({
      next: (photoId: string) => {
        task.status = true;
        task.photo = photoId;
        this.snackBar.open('Photo uploaded successfully', 'Close', {
          duration: 3000,
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error uploading photo', error);
        this.snackBar.open('Error uploading photo: ' + error.error.title, 'Close', {
          duration: 3000,
        });
      },
    });
  }

  currentTaskId: string;

  startCapture(taskId: string) {
    this.currentTaskId = taskId;
    this.status = 'Camera is getting accessed';
    this.btnLabel = 'Capture image';
    this.showWebcam = true;
  }

  snapshot(event: WebcamImage, task: Task) {
    console.log(event);
    this.imageUrls[task._id] = event.imageAsDataUrl;
    const photo: File = new File(
      [this.dataURItoBlob(event.imageAsDataUrl)],
      'photo.jpg'
    );

    if (photo) {
      this.submitPhoto(photo, task, this.teamHunt._id);
    }
  }

  // Transform the image data into the blob format to save into the database.
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
    this.currentTaskId = null;
  }

  captureImage() {
    this.trigger.next();
    this.showWebcam = false;
    this.status = null;
    this.currentTaskId = null;
  }

  private permissionChecked = false;

  checkPermission() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // Camera is available and authorized
        this.stream = stream;
      })
      .catch((err) => {
        // Camera is not available or not authorized
        console.error(err);
        this.stream = null;
      });
  }

  openImage(taskId: string) {
    const image = this.imageUrls[taskId];
    if (image) {
      const imageBlob = this.dataURItoBlob(image);
      const imageUrl = URL.createObjectURL(imageBlob);
      window.open(imageUrl, '_blank');
    }
  }

  switchCamera() {
    if (this.stream) {
      // Stop all tracks of the current stream before requesting a new one
      this.stream.getTracks().forEach((track) => track.stop());
    }

    if (this.videoDevices.length > 1) {
      // If there are multiple video devices, switch between them
      this.currentDeviceIndex =
        (this.currentDeviceIndex + 1) % this.videoDevices.length;
      const deviceId = this.videoDevices[this.currentDeviceIndex].deviceId;

      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: deviceId,
          },
        })
        .then((stream) => {
          this.stream = stream;
        })
        .catch((err) => {
          console.error(err);
          this.stream = null;
        });
    } else {
      // If there is only one video device, switch between 'user' and 'environment'
      this.currentFacingMode =
        this.currentFacingMode === 'user' ? 'environment' : 'user';

      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: this.currentFacingMode,
          },
        })
        .then((stream) => {
          this.stream = stream;
        })
        .catch((err) => {
          console.error(err);
          this.stream = null;
        });
    }
  }
}
