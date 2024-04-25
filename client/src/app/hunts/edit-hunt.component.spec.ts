import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditHuntComponent } from './edit-hunt.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HostService } from '../hosts/host.service';
import { of } from 'rxjs';

describe('EditHuntComponent', () => {
  let component: EditHuntComponent;
  let fixture: ComponentFixture<EditHuntComponent>;
  let mockHostService;
  let mockSnackBar;
  let mockRouter;

  beforeEach(async () => {
    mockHostService = jasmine.createSpyObj(['updateHunt']);
    mockSnackBar = jasmine.createSpyObj(['open']);
    mockRouter = jasmine.createSpyObj(['navigate', 'navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [ EditHuntComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: HostService, useValue: mockHostService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter },
        { provide: MAT_DIALOG_DATA, useValue: { huntToEdit: { name: 'Test Hunt', description: 'Test Description', est: 120 } } },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHuntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with hunt data', () => {
    expect(component.editHuntForm.value).toEqual({ name: 'Test Hunt', description: 'Test Description', est: 120 });
  });

  it('should submit form', () => {
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
});
