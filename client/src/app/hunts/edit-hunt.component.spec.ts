import { EditHuntComponent } from './edit-hunt.component';
import { of, throwError } from 'rxjs';
//import { HostService } from '../hosts/host.service';
//import { MatSnackBar } from '@angular/material/snack-bar';
//import { Router } from '@angular/router';

describe('EditHuntComponent', () => {
  let component: EditHuntComponent;
  let mockHostService;
  let mockSnackBar;
  let mockRouter;

  beforeEach(() => {
    mockHostService = jasmine.createSpyObj(['updateHunt']);
    mockSnackBar = jasmine.createSpyObj(['open']);
    mockRouter = jasmine.createSpyObj(['navigate', 'navigateByUrl']);

    mockRouter.navigateByUrl.and.returnValue(Promise.resolve(true));

    component = new EditHuntComponent(
      { huntToEdit: {
        name: 'Test Hunt', description: 'Test Description', est: 120,
        _id: '',
        hostId: '',
        numberOfTasks: 0
      } },
      mockHostService,
      mockSnackBar,
      mockRouter
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with hunt data', () => {
    component.ngOnInit();
    expect(component.editHuntForm.value).toEqual({ name: 'Test Hunt', description: 'Test Description', est: 120 });
  });

  it('should submit form', () => {
    component.ngOnInit();
    mockHostService.updateHunt.and.returnValue(of({}));
    component.submitForm();
    expect(mockHostService.updateHunt).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalled();
  });

  it('should navigate to hosts', () => {
    component.navigateToHosts();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/hosts']);
  });

  it('should return true if form control has error and is dirty or touched', () => {
    component.ngOnInit();
    const control = component.editHuntForm.get('name');
    control.setValue('');
    control.markAsDirty();
    expect(component.formControlHasError('name')).toBeTrue();
    control.markAsPristine();
    control.markAsTouched();
    expect(component.formControlHasError('name')).toBeTrue();
  });

  it('should return false if form control has no error', () => {
    component.ngOnInit();
    component.editHuntForm.get('name').setValue('Valid Name');
    expect(component.formControlHasError('name')).toBeFalse();
  });

  it('should return error message if form control has error', () => {
    component.ngOnInit();
    component.editHuntForm.get('name').setValue('');
    expect(component.getErrorMessage('name')).toBe('Name is required');
  });

  it('should return "Unknown error" if form control has no error', () => {
    component.ngOnInit();
    component.editHuntForm.get('name').setValue('Valid Name');
    expect(component.getErrorMessage('name')).toBe('Unknown error');
  });

  it('should handle error when submitting form', () => {
    component.ngOnInit();
    const errorResponse = { status: 500, message: 'Server error' };
    mockHostService.updateHunt.and.returnValue(throwError(errorResponse));
    component.submitForm();
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      `Problem contacting the server – Error Code: ${errorResponse.status}\nMessage: ${errorResponse.message}`,
      'OK',
      { duration: 5000 }
    );
  });

});
