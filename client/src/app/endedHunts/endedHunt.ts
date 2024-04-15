import { StartedHunt } from "../startHunt/startedHunt";
import { FinishedTask } from "./finishedTask";

export interface EndedHunt {
  startedHunt: StartedHunt;
  finishedTasks: FinishedTask[];
}
