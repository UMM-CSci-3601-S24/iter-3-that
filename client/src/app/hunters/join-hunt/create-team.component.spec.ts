import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { CreateTeamComponent } from './create-team.component';
import { HostService } from 'src/app/hosts/host.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateTeamComponent', () => {
  let component: CreateTeamComponent;
  let fixture: ComponentFixture<CreateTeamComponent>;
  let mockHostService;
  let mockRouter;
  let mockSnackBar;

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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a team when the form is valid', () => {
    mockHostService.createTeam.and.returnValue(of('123'));
    component.teamForm.setValue({ teamName: 'Test Team', members: ['Test Member'], startedHuntId: '' });

    component.submitForm();

    expect(mockHostService.createTeam).toHaveBeenCalledWith(component.teamForm.value);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Team created successfully', 'Close', { duration: 5000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/team', '123']);
  });

  it('should not create a team when the form is invalid', () => {
    component.teamForm.setValue({ teamName: '', members: [''], startedHuntId: '' });

    component.submitForm();

    expect(mockHostService.createTeam).not.toHaveBeenCalled();
  });
});
