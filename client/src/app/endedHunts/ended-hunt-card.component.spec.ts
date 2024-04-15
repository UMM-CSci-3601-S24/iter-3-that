import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { HostService } from "../hosts/host.service";
import { EndedHuntCardComponent } from "./ended-hunt-card.component";

describe('EndedHuntCardComponent', () => {
  let component: EndedHuntCardComponent;
  let hostService: HostService;
  let router: Router;

  beforeEach(() => {
    hostService = jasmine.createSpyObj('HostService', ['deleteEndedHunt']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        EndedHuntCardComponent,
        { provide: HostService, useValue: hostService },
        { provide: Router, useValue: router }
      ]
    });

    component = TestBed.inject(EndedHuntCardComponent);
  });

  it('should call hostService.deleteEndedHunt and huntDeleted.emit when deleteEndedHunt is called', () => {
    const id = 'testId';
    (hostService.deleteEndedHunt as jasmine.Spy).and.returnValue(of(undefined));

    spyOn(window, 'confirm').and.returnValue(true); // Add this line

    // Create a spy for huntDeleted.emit
    spyOn(component.huntDeleted, 'emit');

    component.deleteEndedHunt(id);

    expect(hostService.deleteEndedHunt).toHaveBeenCalledWith(id);
    expect(component.huntDeleted.emit).toHaveBeenCalledWith(id);
  });
});
