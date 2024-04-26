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
});
