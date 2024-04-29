import { Task } from 'src/app/hunts/task';

export interface TeamHunt {
  _id: string;
  startedHuntId: string;
  teamName: string;
  members: string[];
  tasks: Task[];
}
