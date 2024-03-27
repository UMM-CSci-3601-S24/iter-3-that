import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ActivatedRouteStub } from "src/testing/activated-route-stub";
import { MockHostService } from "src/testing/host.service.mock";
import { StartHuntComponent } from "./start-hunt.component";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatCardModule } from "@angular/material/card";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { HostService } from "../hosts/host.service";
import { HuntCardComponent } from "../hunts/hunt-card.component";
import { StartedHunt } from "./startedHunt";
import { throwError } from "rxjs";

describe('StartHuntComponent', () => {
  let component: StartHuntComponent;
  let fixture: ComponentFixture<StartHuntComponent>;
  const mockHostService = new MockHostService();
  const accessCode = 'access_code';
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub({
    accessCode: accessCode
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        HttpClientModule,
        RouterTestingModule,
        MatCardModule,
        StartHuntComponent, HuntCardComponent, HttpClientModule, HttpClientTestingModule
    ],
    providers: [
        { provide: HostService, useValue: mockHostService },
        { provide: ActivatedRoute, useValue: activatedRoute }
    ]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartHuntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to a specific started hunt', () => {
    const expectedStartedHunt: StartedHunt = MockHostService.testStartedHunts[0];
    activatedRoute.setParamMap({ accessCode: expectedStartedHunt.accessCode });
    expect(component.startedHunt).toEqual(expectedStartedHunt);
  });

  it('should navigate to correct startedHunt when the accessCode parameter changes', () => {
    let expectedStartedHunt: StartedHunt = MockHostService.testStartedHunts[0];
    activatedRoute.setParamMap({ accessCode: expectedStartedHunt.accessCode });
    expect(component.startedHunt).toEqual(expectedStartedHunt);

    expectedStartedHunt = MockHostService.testStartedHunts[1];
    activatedRoute.setParamMap({ accessCode: expectedStartedHunt.accessCode });
    expect(component.startedHunt).toEqual(expectedStartedHunt);
  });

  it('should have `null` for the started hunt for a bad accessCode', () => {
    activatedRoute.setParamMap({ accessCode: 'badID' });
    expect(component.startedHunt).toBeNull();
  });

  it('should set error data on observable error', () => {
    activatedRoute.setParamMap({ accessCode: accessCode });

    const mockError = { message: 'Test Error', error: { title: 'Error Title' } };
    const getStartedHuntSpy = spyOn(mockHostService, 'getStartedHunt')
      .and
      .returnValue(throwError(() => mockError));

    component.ngOnInit();

    expect(component.error).toEqual({
      help: 'There was a problem starting the hunt – try again.',
      httpResponse: mockError.message,
      message: mockError.error.title,
    });
    expect(getStartedHuntSpy).toHaveBeenCalledWith(accessCode);
  });
});