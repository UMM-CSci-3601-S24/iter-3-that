import { Observable, of, Subject, throwError } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HunterViewComponent } from './hunter-view.component';
import { HostService } from 'src/app/hosts/host.service';
import { StartedHunt } from 'src/app/startHunt/startedHunt'
import { Task } from 'src/app/hunts/task';
import { WebcamImage } from 'ngx-webcam';

describe('HunterViewComponent', () => {
  let component: HunterViewComponent;
  let fixture: ComponentFixture<HunterViewComponent>;
  let mockHostService: jasmine.SpyObj<HostService>;
  let mockRoute: { paramMap: Subject<ParamMap> };
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    mockHostService = jasmine.createSpyObj('HostService', ['getStartedHunt', 'submitPhoto', 'replacePhoto']);
    mockRoute = {
      paramMap: new Subject<ParamMap>()
    };
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    await TestBed.configureTestingModule({
      imports: [HunterViewComponent],
      providers: [
        { provide: HostService, useValue: mockHostService },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HunterViewComponent);
    component = fixture.componentInstance;

    const initialStartedHunt: StartedHunt = {
      _id: '',
      completeHunt: {
        hunt: {
          _id: '',
          hostId: '',
          name: '',
          description: '',
          est: 0,
          numberOfTasks: 0
        },
        tasks: []
      },
      accessCode: ''
    };
    component.startedHunt = initialStartedHunt;

    fixture.detectChanges();
  });

  it('should navigate to the right hunt page by access code',() => {
    const startedHunt: StartedHunt = {
      _id: '',
      completeHunt: {
        hunt: {
          _id: '1',
          hostId: '1',
          name: 'Hunt 1',
          description: 'Hunt 1 Description',
          est: 10,
          numberOfTasks: 1
        },
        tasks: [
          {
            _id: '1',
            huntId: '1',
            name: 'Task 1',
            status: true,
            photos: []
          }
        ]
      },
      accessCode: '123456'
    };
    mockHostService.getStartedHunt.and.returnValue(of(startedHunt));
    // Emit a paramMap event to trigger the hunt retrieval
    mockRoute.paramMap.next({ get: () => '123456', has: () => true, getAll: () => [], keys: [] });
    component.ngOnInit();
    expect(component.startedHunt).toEqual(startedHunt);

  });

  it('should handle error when getting hunt by access code', () => {
    const error = { message: 'Error', error: { title: 'Error Title' } };
    mockHostService.getStartedHunt.and.returnValue(throwError(error));
    // Emit a paramMap event to trigger the hunt retrieval
    mockRoute.paramMap.next({ get: () => '1', has: () => true, getAll: () => [], keys: [] });
    component.ngOnInit();
    expect(component.error).toEqual({
      help: 'There is an error trying to load the tasks - Please try to run the hunt again',
      httpResponse: error.message,
      message: error.error.title,
    });
  });

  it('should start capture', () => {
    const taskId = '123';

    component.startCapture(taskId);

    expect(component['currentTaskId']).toBe(taskId);
    expect(component['status']).toBe('Camera is getting accessed');
    expect(component['btnLabel']).toBe('Capture image');
    expect(component['showWebcam']).toBe(true);
  });

  it('should handle snapshot when task has no photos', () => {
    const task: Task = { _id: '1', huntId: '1', name: 'Task 1', status: true, photos: [] };
    const event: WebcamImage = { imageAsDataUrl: 'data:image/jpeg;base64,' } as WebcamImage;
    spyOn(component, 'dataURItoBlob' as keyof HunterViewComponent).and.returnValue(new Blob());
    spyOn(component, 'submitPhoto');

    component.snapshot(event, task);

    expect(component.imageUrls[task._id]).toBe(event.imageAsDataUrl);
    expect(component.submitPhoto).toHaveBeenCalled();
  });

  it('should handle snapshot when task has photos', () => {
    const task: Task = { _id: '1', huntId: '1', name: 'Task 1', status: true, photos: ['photoId'] };
    const event: WebcamImage = { imageAsDataUrl: 'data:image/jpeg;base64,' } as WebcamImage;
    spyOn(component, 'dataURItoBlob' as keyof HunterViewComponent).and.returnValue(new Blob());
    spyOn(component, 'replacePhoto');

    component.snapshot(event, task);

    expect(component.imageUrls[task._id]).toBe(event.imageAsDataUrl);
    expect(component.replacePhoto).toHaveBeenCalled();
  });

  it('should convert data URI to Blob', () => {
    const dataURI = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA';
    const blob = component['dataURItoBlob'](dataURI);

    expect(blob).toBeTruthy();
    expect(blob.type).toBe('image/jpeg');
  });

  it('should capture image', () => {
    const nextSpy = spyOn(component['trigger'], 'next');

    component['showWebcam'] = true;
    component['status'] = 'active';
    component['currentTaskId'] = '123';

    component.captureImage();

    expect(component['showWebcam']).toBe(false);
    expect(component['status']).toBeNull();
    expect(component['currentTaskId']).toBeNull();
    expect(nextSpy).toHaveBeenCalled();
  });

  it('should cancel capture', () => {
    component['showWebcam'] = true;
    component['status'] = 'active';
    component['currentTaskId'] = '123';

    component.cancelCapture();

    expect(component['showWebcam']).toBe(false);
    expect(component['status']).toBeNull();
    expect(component['currentTaskId']).toBeNull();
  });

  it('should submitted photo successfully', () => {
    const task: Task = { _id: '1', huntId: '1', name: 'Task 1', status: true, photos: [] };
    const photoId = 'photoId';
    const file = new File([''], 'photo.jpg', { type: 'image/jpeg' });
    mockHostService.submitPhoto.and.returnValue(of(photoId));

    component.submitPhoto(file, task, '1');

    expect(task.photos).toContain(photoId);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Photo uploaded successfully', 'Close', { duration: 3000 });
  });

  it('should handle error when fail to submit photo', () => {
    const task: Task = { _id: '1', huntId: '1', name: 'Task 1', status: true, photos: [] };
    const file = new File([''], 'photo.jpg', { type: 'image/jpeg' });
    mockHostService.submitPhoto.and.returnValue(throwError('Error message'));

    component.submitPhoto(file, task, '1');

    expect(mockSnackBar.open).toHaveBeenCalledWith('Error uploading photo. Please try again', 'Close', { duration: 3000 });
  });

  it('should replace photo successfully', () => {
    const task: Task = { _id: '1', huntId: '1', name: 'Task 1', status: true, photos: ['photoId'] };
    const photoId = 'newPhotoId';
    const file = new File([''], 'photo.jpg', { type: 'image/jpeg' });
    mockHostService.replacePhoto.and.returnValue(of(photoId));

    component.replacePhoto(file, task, '1');

    expect(task.photos[0]).toBe(photoId);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Photo replaced successfully', 'Close', { duration: 3000 });
  });

  it('should handle error when fail to replace photo', () => {
    const task: Task = { _id: '1', huntId: '1', name: 'Task 1', status: true, photos: ['photoId'] };
    const file = new File([''], 'photo.jpg', { type: 'image/jpeg' });
    mockHostService.replacePhoto.and.returnValue(throwError('Error message'));

    component.replacePhoto(file, task, '1');

    expect(mockSnackBar.open).toHaveBeenCalledWith('Error replacing photo. Please try again', 'Close', { duration: 3000 });

  });

  it('should set stream to true when camera is available and authorized', (done) => {
    spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.resolve({} as MediaStream));

    component.checkPermission();

    setTimeout(() => {
      expect(component['stream']).toBeTruthy();
      done();
    }, 0);
  });

  it('should set stream to null and log error when camera is not available or not authorized', (done) => {
    spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.reject(new Error('Not authorized')));
    spyOn(console, 'error');

    component.checkPermission();

    setTimeout(() => {
      expect(component['stream']).toBeNull();
      expect(console.error).toHaveBeenCalledWith(new Error('Not authorized'));
      done();
    }, 0);
  });

  it('should get the trigger observable', () => {
    expect(component.$trigger).toBeInstanceOf(Observable);
  });

  it('should open image in a new tab if image exists', () => {
    const spy = spyOn(window, 'open').and.callFake(() => window);
    const taskId = 'testTaskId';
    component.imageUrls[taskId] = 'data:image/jpeg;base64,';

    component.openImage(taskId);

    expect(spy).toHaveBeenCalled();
  });

  it('should not open image in a new tab if image does not exist', () => {
    const spy = spyOn(window, 'open').and.callFake(() => window);
    const taskId = 'testTaskId';

    component.openImage(taskId);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should stop all tracks if stream exists', () => {
    const track = jasmine.createSpyObj('track', ['stop']);
    component.stream = { getTracks: () => [track] } as MediaStream;

    component.switchCamera();

    expect(track.stop).toHaveBeenCalled();
  });

  it('should switch between multiple video devices', (done) => {
    component.videoDevices = [{
      deviceId: '1',
      groupId: '',
      kind: 'audioinput',
      label: '',
      toJSON: function () {
        throw new Error('Function not implemented.');
      }
    }, {
      deviceId: '2',
      groupId: '',
      kind: 'audioinput',
      label: '',
      toJSON: function () {
        throw new Error('Function not implemented.');
      }
    }];
    component.currentDeviceIndex = 0;
    const mockStream = {} as MediaStream;
    spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.resolve(mockStream));

    component.switchCamera();

    setTimeout(() => {
      expect(component.currentDeviceIndex).toBe(1);
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ video: { deviceId: '2' } });
      expect(component.stream).toBe(mockStream);
      done();
    }, 0);
  });
});

