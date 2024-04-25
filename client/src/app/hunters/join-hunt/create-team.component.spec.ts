import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { CreateTeamComponent } from './create-team.component';
import { HostService } from 'src/app/hosts/host.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateTeamComponent', () => {
  let createTeamComponent: CreateTeamComponent;
  let fixture: ComponentFixture<CreateTeamComponent>;
  let mockHostService;
  let mockRouter;
  let mockSnackBar;
  let teamForm: FormGroup;

  beforeEach(async () => {
    mockHostService = jasmine.createSpyObj(['createTeam']);
    mockRouter = jasmine.createSpyObj(['navigate']);
    mockSnackBar = jasmine.createSpyObj(['open']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CreateTeamComponent,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: HostService, useValue: mockHostService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTeamComponent);
    createTeamComponent = fixture.componentInstance;
    fixture.detectChanges();
    teamForm = createTeamComponent.teamForm;
    expect(teamForm).toBeDefined();
    expect(teamForm.controls).toBeDefined();
  });

  it('should create the component and form', () => {
    expect(createTeamComponent).toBeTruthy();
    expect(teamForm).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(teamForm.valid).toBeFalsy();
  });

  describe('The teamName field', () => {
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = createTeamComponent.teamForm.controls.teamName;
    });

    it('should not allow empty names', () => {
      nameControl.setValue('');
      expect(nameControl.valid).toBeFalsy();
    });

    it('should be fine with "The Best Hunt"', () => {
      nameControl.setValue('The Best Hunt');
      expect(nameControl.valid).toBeTruthy();
    });

    it('should fail on really long names', () => {
      nameControl.setValue('t'.repeat(100));
      expect(nameControl.valid).toBeFalsy();
      expect(nameControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the name', () => {
      nameControl.setValue('Bad2Th3B0ne');
      expect(nameControl.valid).toBeTruthy();
    });
  });

  describe('The members field', () => {
    let membersArray: FormArray;

    beforeEach(() => {
      membersArray = createTeamComponent.teamForm.get('members') as FormArray;
    });

    it('should not allow empty names', () => {
      const memberControl = membersArray.at(0);
      memberControl.setValue('');
      expect(memberControl.valid).toBeFalsy();
    });

    it('should be fine with "The Best Hunt"', () => {
      const memberControl = membersArray.at(0);
      memberControl.setValue('The Best Hunt');
      expect(memberControl.valid).toBeTruthy();
    });

    it('should fail on really long names', () => {
      const memberControl = membersArray.at(0);
      memberControl.setValue('t'.repeat(100));
      expect(memberControl.valid).toBeFalsy();
      expect(memberControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the name', () => {
      const memberControl = membersArray.at(0);
      memberControl.setValue('Bad2Th3B0ne');
      expect(memberControl.valid).toBeTruthy();
    });
  });

  it('should create a team when the form is valid', () => {
    mockHostService.createTeam.and.returnValue(of('123'));
    createTeamComponent.teamForm.setValue({ teamName: 'Test Team', members: ['Test Member'], startedHuntId: '' });

    createTeamComponent.submitForm();

    expect(mockHostService.createTeam).toHaveBeenCalledWith(createTeamComponent.teamForm.value);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Team created successfully', 'Close', { duration: 5000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/team', '123']);
  });

  describe('formControlHasError', () => {
    it('should return the correct error message for name', () => {
      createTeamComponent.teamForm.get('teamName').setErrors({ required: true });
      expect(createTeamComponent.getErrorMessage('teamName')).toBe('Team name is required');

      createTeamComponent.teamForm.get('teamName').setErrors({ minlength: true });
      expect(createTeamComponent.getErrorMessage('teamName')).toBe('Team name must be at least 1 character long');

      createTeamComponent.teamForm.get('teamName').setErrors({ maxlength: true });
      expect(createTeamComponent.getErrorMessage('teamName')).toBe('Team name cannot be more than 50 characters long');
    });

    it('should return the correct error message for members', () => {
      createTeamComponent.teamForm.get('members').setErrors({ required: true });
      expect(createTeamComponent.getErrorMessage('members')).toBe('At least one member is required');

      createTeamComponent.teamForm.get('members').setErrors({ minlength: true });
      expect(createTeamComponent.getErrorMessage('members')).toBe('Team name must be at least 1 character long');

      createTeamComponent.teamForm.get('members').setErrors({ maxlength: true });
      expect(createTeamComponent.getErrorMessage('members')).toBe('Team name cannot be more than 50 characters long');
    });
  });

  it('should log an error if creating a team fails', () => {
    const error = new Error('Error creating team');
    mockHostService.createTeam.and.returnValue(throwError(error));
    spyOn(console, 'error');

    createTeamComponent.submitForm();

    expect(console.error).toHaveBeenCalledWith('Error creating team:', error);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Error creating team', 'Close', { duration: 5000 });
  });

  it('should add a member control to the members form array', () => {
    createTeamComponent.addMember();
    const members = createTeamComponent.teamForm.get('members') as FormArray;
    expect(members.length).toBe(2);

    const control = members.at(1);
    const validator = Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(85)]);
    expect(validator(control)).toEqual(control.validator(control));
  });

  it('should remove a member control from the members form array', () => {
    createTeamComponent.addMember();
    createTeamComponent.removeMember(0);
    const members = createTeamComponent.teamForm.get('members') as FormArray;
    expect(members.length).toBe(1);
  });

  it('should return Unknown error if the error type is not recognized', () => {
    createTeamComponent.teamForm.get('teamName').setErrors({ unknown: true });
    expect(createTeamComponent.getErrorMessage('teamName')).toBe('Unknown error');
  });
});
