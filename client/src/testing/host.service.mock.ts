import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Hunt } from '../app/hunts/hunt';
import { HostService } from '../app/hosts/host.service';
import { CompleteHunt } from 'src/app/hunts/completeHunt';
import { StartedHunt } from 'src/app/startHunt/startedHunt';
import { EndedHunt } from 'src/app/endedHunts/endedHunt';

@Injectable({
  providedIn: AppComponent,
})
export class MockHostService extends HostService {
  static testHunts: Hunt[] = [
    {
      _id: 'ann_id',
      hostId: 'ann_hid',
      name: 'Anns Hunt',
      description: 'exciting hunt',
      est: 30,
      numberOfTasks: 3,
    },
    {
      _id: 'fran_id',
      hostId: 'fran_hid',
      name: 'Frans Hunt',
      description: 'super exciting hunt',
      est: 45,
      numberOfTasks: 2,
    },
    {
      _id: 'jan_id',
      hostId: 'jan_hid',
      name: 'Jans Hunt',
      description: 'super fun and exciting hunt',
      est: 60,
      numberOfTasks: 4,
    },
  ];

  static testCompleteHunts: CompleteHunt[] = [
    {
      hunt: MockHostService.testHunts[0],
      tasks: [
        {
          _id: '588935f57546a2daea54de8c',
          huntId: 'ann_id',
          name: 'Take a picture of a bird',
          status: false,
          photo: '',
        },
        {
          _id: '588935f57546a2daea54de9c',
          huntId: 'ann_id',
          name: 'Take a picture of a dog',
          status: false,
          photo: '',
        },
        {
          _id: '588935f57546a3daea54de8c',
          huntId: 'ann_id',
          name: 'Take a picture of a Stop sign',
          status: false,
          photo: '',
        },
      ],
    },
    {
      hunt: MockHostService.testHunts[1],
      tasks: [
        {
          _id: '588935f57556a2daea54de8c',
          huntId: 'fran_id',
          name: 'Take a picture of a restaurant',
          status: false,
          photo: '',
        },
        {
          _id: '588935f56536a3daea54de8c',
          huntId: 'fran_id',
          name: 'Take a picture of a cat',
          status: false,
          photo: '',
        },
      ],
    },
    {
      hunt: MockHostService.testHunts[2],
      tasks: [
        {
          _id: '588933f57556a3daea54de8c',
          huntId: 'jan_id',
          name: 'Take a picture of a red car',
          status: false,
          photo: '',
        },
        {
          _id: '588535f57556a3daea54de8c',
          huntId: 'jan_id',
          name: 'Take a picture of a slide',
          status: false,
          photo: '',
        },
        {
          _id: '583935f57556a3daea54de8c',
          huntId: 'jan_id',
          name: 'Take a picture of a Yield sign',
          status: false,
          photo: '',
        },
        {
          _id: '548935f57556a3daea54de8c',
          huntId: 'jan_id',
          name: 'Take a picture of a football field',
          status: false,
          photo: '',
        },
      ],
    },
  ];

  static testStartedHunts: StartedHunt[] = [
    {
      _id: 'ann_id',
      accessCode: 'ann_code',
      completeHunt: {
        hunt: MockHostService.testHunts[0],
        tasks: [
          {
            _id: '588935f57546a2daea54de8c',
            huntId: 'ann_id',
            name: 'Take a picture of a bird',
            status: false,
            photo: '',
          },
          {
            _id: '588935f57546a2daea54de9c',
            huntId: 'ann_id',
            name: 'Take a picture of a dog',
            status: false,
            photo: '',
          },
          {
            _id: '588935f57546a3daea54de8c',
            huntId: 'ann_id',
            name: 'Take a picture of a Stop sign',
            status: false,
            photo: '',
          },
        ],
      },
    },
    {
      _id: 'fran_id',
      accessCode: 'fran_code',
      completeHunt: {
        hunt: MockHostService.testHunts[1],
        tasks: [
          {
            _id: '588935f57556a2daea54de8c',
            huntId: 'fran_id',
            name: 'Take a picture of a restaurant',
            status: false,
            photo: '',
          },
          {
            _id: '588935f56536a3daea54de8c',
            huntId: 'fran_id',
            name: 'Take a picture of a cat',
            status: false,
            photo: '',
          },
        ],
      },
    },
    {
      _id: 'jan_id',
      accessCode: 'jan_code',
      completeHunt: {
        hunt: MockHostService.testHunts[2],
        tasks: [
          {
            _id: '588933f57556a3daea54de8c',
            huntId: 'jan_id',
            name: 'Take a picture of a red car',
            status: false,
            photo: '',
          },
          {
            _id: '588535f57556a3daea54de8c',
            huntId: 'jan_id',
            name: 'Take a picture of a slide',
            status: false,
            photo: '',
          },
          {
            _id: '583935f57556a3daea54de8c',
            huntId: 'jan_id',
            name: 'Take a picture of a Yield sign',
            status: false,
            photo: '',
          },
          {
            _id: '548935f57556a3daea54de8c',
            huntId: 'jan_id',
            name: 'Take a picture of a football field',
            status: false,
            photo: '',
          },
        ],
      },
    },
    {
      _id: 'jan_id',
      accessCode: '1',
      completeHunt: {
        hunt: MockHostService.testHunts[2],
        tasks: [
          {
            _id: '588933f57556a3daea54de8c',
            huntId: 'jan_id',
            name: 'Take a picture of a red car',
            status: false,
            photo: '',
          },
          {
            _id: '588535f57556a3daea54de8c',
            huntId: 'jan_id',
            name: 'Take a picture of a slide',
            status: false,
            photo: '',
          },
          {
            _id: '583935f57556a3daea54de8c',
            huntId: 'jan_id',
            name: 'Take a picture of a Yield sign',
            status: false,
            photo: '',
          },
          {
            _id: '548935f57556a3daea54de8c',
            huntId: 'jan_id',
            name: 'Take a picture of a football field',
            status: false,
            photo: '',
          },
        ],
      },
    },
  ];

  static testEndedHunts: EndedHunt[] = [
    {
      startedHunt: MockHostService.testStartedHunts[0],
      finishedTasks: [],
    },
  ];

  constructor() {
    super(null);
  }

  getHunts(): Observable<Hunt[]> {
    return of(MockHostService.testHunts);
  }

  getHuntById(id: string): Observable<CompleteHunt> {
    if (id === MockHostService.testCompleteHunts[0].hunt._id) {
      return of(MockHostService.testCompleteHunts[0]);
    } else if (id === MockHostService.testCompleteHunts[1].hunt._id) {
      return of(MockHostService.testCompleteHunts[1]);
    } else {
      return of(null);
    }
  }

  getStartedHunt(accessCode: string): Observable<StartedHunt> {
    if (accessCode === MockHostService.testStartedHunts[0].accessCode) {
      return of(MockHostService.testStartedHunts[0]);
    } else if (accessCode === MockHostService.testStartedHunts[1].accessCode) {
      return of(MockHostService.testStartedHunts[1]);
    } else {
      return of(null);
    }
  }

  getEndedHunts(): Observable<StartedHunt[]> {
    return of(MockHostService.testStartedHunts);
  }

  getEndedHuntById(id: string): Observable<EndedHunt> {
    if (id === MockHostService.testEndedHunts[0].startedHunt._id) {
      return of(MockHostService.testEndedHunts[0]);
    }
  }
}
