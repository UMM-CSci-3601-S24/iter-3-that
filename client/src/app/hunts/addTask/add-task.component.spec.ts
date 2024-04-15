import { Location } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { MockHostService } from 'src/testing/host.service.mock';
import { HostService } from 'src/app/hosts/host.service';
import { HuntProfileComponent } from '../hunt-profile.component';
import { AddTaskComponent } from './add-task.component';
import { input } from '@angular/core';


describe('AddTaskComponent', () => {
  let addTaskComponent: AddTaskComponent;
  let addTaskForm: FormGroup;
  let fixture: ComponentFixture<AddTaskComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(HostService, { useValue: new MockHostService() });
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        AddTaskComponent
      ]
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaskComponent);
    addTaskComponent = fixture.componentInstance;
    fixture.detectChanges();
    addTaskForm = addTaskComponent.addTaskForm;
    expect(addTaskForm).toBeDefined();
    expect(addTaskForm.controls).toBeDefined();
  });

  it('should create the component and form', () => {
    expect(addTaskComponent).toBeTruthy();
    expect(addTaskForm).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(addTaskForm.valid).toBeFalsy();
  });

  describe('The name field', () => {
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = addTaskComponent.addTaskForm.controls.name;
    });

    it('should not allow empty names', () => {
      nameControl.setValue('');
      expect(nameControl.valid).toBeFalsy();
    });

    it('should be fine with "The Best Task"', () => {
      nameControl.setValue('The Best Task');
      expect(nameControl.valid).toBeTruthy();
    });

    it('should fail on really long names', () => {
      nameControl.setValue('t'.repeat(300));
      expect(nameControl.valid).toBeFalsy();
      expect(nameControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the task', () => {
      nameControl.setValue('Bad2Th3B0ne');
      expect(nameControl.valid).toBeTruthy();
    });
  });

  describe('getErrorMessage()', () => {
    it('should return the correct error message', () => {
      const controlName: keyof typeof addTaskComponent.addTaskValidationMessages = 'name';
      addTaskComponent.addTaskForm.get(controlName).setErrors({'required': true});
      expect(addTaskComponent.getErrorMessage(controlName)).toEqual('Task name is required');
    });

    it('should return "Unknown error" if no error message is found', () => {
      const controlName: keyof typeof addTaskComponent.addTaskValidationMessages = 'name';
      addTaskComponent.addTaskForm.get(controlName).setErrors({'unknown': true});
      expect(addTaskComponent.getErrorMessage(controlName)).toEqual('Unknown error');
    });
  });
});

describe('AddTaskComponent#submitForm()', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;
  let hostService: HostService;
  let location: Location;

  beforeEach(() => {
    TestBed.overrideProvider(HostService, { useValue: new MockHostService() });
    TestBed.configureTestingModule({
    imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        AddTaskComponent, HuntProfileComponent
    ],
}).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    hostService = TestBed.inject(HostService);
    location = TestBed.inject(Location);
    TestBed.inject(Router);
    TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.addTaskForm.controls.name.setValue('Take a picture of a dog');
    component.addTaskForm.controls.huntId.setValue('1');
    component.completeHunt = input({ hunt: { _id: '1', hostId: '', name: '', description: '', est: 0, numberOfTasks: 0 }, tasks: [] });
  });

  it('should call addTask() and handle error response', () => {
    const path = location.path();
    const errorResponse = { status: 500, message: 'Server error' };
    const addTaskSpy = spyOn(hostService, 'addTask')
      .and
      .returnValue(throwError(() => errorResponse));
    component.submitForm();
    expect(addTaskSpy).toHaveBeenCalledWith(component.addTaskForm.value);
    expect(location.path()).toBe(path);
  });

  it('should return true when the control is invalid and either dirty or touched', () => {
    const controlName = 'name';
    component.addTaskForm.get(controlName).setValue('');
    component.addTaskForm.get(controlName).markAsDirty();
    expect(component.formControlHasError(controlName)).toBeTruthy();
  });

  it('should return false when the control is valid', () => {
    const controlName = 'name';
    component.addTaskForm.get(controlName).setValue('Valid Name');
    expect(component.formControlHasError(controlName)).toBeFalsy();
  });

  it('should return false when the control is invalid but not dirty or touched', () => {
    const controlName = 'name';
    component.addTaskForm.get(controlName).setValue('');
    expect(component.formControlHasError(controlName)).toBeFalsy();
  });

  it('should call hostService.addTask and update completeHunt', () => {
    const task = {
      huntId: 'huntId',
      status: false,
      name: 'Task Name',
      _id: ''
    };

    component.addTaskForm.setValue(task);
    const completeHuntSpy = spyOn(component, 'completeHunt').and.returnValue({
      hunt: { _id: 'huntId', hostId: '', name: '', description: '', est: 0, numberOfTasks: 0 },
      tasks: []
    });

    const addTaskSpy = spyOn(hostService, 'addTask').and.returnValue(of(''));
    const resetSpy = spyOn(component.addTaskForm, 'reset');

    component.submitForm();

    expect(addTaskSpy).toHaveBeenCalledWith(task);
    expect(resetSpy).toHaveBeenCalled();
    expect(completeHuntSpy().tasks.length).toBe(1);
    expect(completeHuntSpy().hunt.numberOfTasks).toBe(1);
  });
});

