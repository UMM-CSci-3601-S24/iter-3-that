import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockHostService } from 'src/testing/host.service.mock';
import { EndedHuntDetailsComponent } from './ended-hunt.details.component';
import { HostService } from 'src/app/hosts/host.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { EndedHuntCardComponent } from '../ended-hunt-card.component';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { EndedHunt } from '../endedHunt';
import { throwError } from 'rxjs';

describe('EndedHuntDetailsComponent', () => {
  let component: EndedHuntDetailsComponent;
  let fixture: ComponentFixture<EndedHuntDetailsComponent>;
  const mockHostService = new MockHostService();
  const chrisId = 'chris_id';
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub({
    id: chrisId,
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        MatCardModule,
        EndedHuntDetailsComponent,
        EndedHuntCardComponent,
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: HostService, useValue: mockHostService },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndedHuntDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to a specific hunt profile', () => {
    const expectedHunt: EndedHunt = MockHostService.testEndedHunts[0];
    activatedRoute.setParamMap({ id: expectedHunt.startedHunt._id });
    expect(component.endedHunt).toEqual(expectedHunt);
  });

  it('should navigate to correct hunt when the id parameter changes', () => {
    let expectedHunt: EndedHunt = MockHostService.testEndedHunts[0];
    activatedRoute.setParamMap({ id: expectedHunt.startedHunt._id });
    expect(component.endedHunt).toEqual(expectedHunt);

    expectedHunt = MockHostService.testEndedHunts[1];
    activatedRoute.setParamMap({ id: expectedHunt.startedHunt._id });
    expect(component.endedHunt).toEqual(expectedHunt);
  });

  it('should have `null` for the hunt for a bad ID', () => {
    activatedRoute.setParamMap({ id: 'badID' });
    expect(component.endedHunt).toBeNull();
  });

  it('should set error data on observable error', () => {
    activatedRoute.setParamMap({ id: chrisId });

    const mockError = {
      message: 'Test Error',
      error: { title: 'Error Title' },
    };
    const getHuntSpy = spyOn(mockHostService, 'getEndedHuntById').and.returnValue(
      throwError(() => mockError)
    );

    component.ngOnInit();

    expect(component.error).toEqual({
      help: 'There was a problem loading the endedHunt – try again.',
      httpResponse: mockError.message,
      message: mockError.error.title,
    });
    expect(getHuntSpy).toHaveBeenCalledWith(chrisId);
  });
});
