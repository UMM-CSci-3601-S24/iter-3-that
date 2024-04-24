import { TestBed } from '@angular/core/testing';
import { HuntCardComponent } from './hunt-card.component';
import { HostService } from '../hosts/host.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('HuntCardComponent', () => {
  let component: HuntCardComponent;
  let hostService: HostService;
  let router: Router;

  beforeEach(() => {
    hostService = jasmine.createSpyObj('HostService', ['startHunt']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        HuntCardComponent,
        { provide: HostService, useValue: hostService },
        { provide: Router, useValue: router }
      ]
    });

    component = TestBed.inject(HuntCardComponent);
  });

  it('should call hostService.startHunt and router.navigate when startHunt is called', () => {
    const id = 'testId';
    const accessCode = 'accessCode';
    (hostService.startHunt as jasmine.Spy).and.returnValue(of(accessCode));

    component.startHunt(id);

    expect(hostService.startHunt).toHaveBeenCalledWith(id, null);
    expect(router.navigate).toHaveBeenCalledWith(['/startedHunts/', accessCode]);
  });

  describe('estHours', () => {
    it('should return 0 for less than 60 minutes', () => {
      expect(component.estHours(59)).toBe(0);
    });

    it('should return 1 for 60 minutes', () => {
      expect(component.estHours(60)).toBe(1);
    });

    it('should return 1 for more than 60 but less than 120 minutes', () => {
      expect(component.estHours(119)).toBe(1);
    });

    it('should return 2 for 120 minutes', () => {
      expect(component.estHours(120)).toBe(2);
    });
  });

  describe('getErrorMessage for numTeams', () => {
    it('should return the correct error message', () => {

      component.NumberofTeamsForm.get('numTeam').setErrors({ required: true });
      expect(component.getErrorMessage('numTeam')).toBe('Please provide the number of teams');

      component.NumberofTeamsForm.get('numTeam').setErrors({ min: true });
      expect(component.getErrorMessage('numTeam')).toBe('Number of teams must be at least 1');
    });

    it('should return "Cannot have more than 20 teams" if the number is more than 20', () => {
      component.NumberofTeamsForm.get('numTeam').setErrors({ max: true });
      expect(component.getErrorMessage('numTeam')).toBe('Cannot have more than 20 teams');
    });
  });
});
