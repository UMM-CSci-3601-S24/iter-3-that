import { TeamHunt } from "../hunters/join-hunt/teamHunt";
import { FinishedTask } from "./finishedTask";

export interface EndedHunt {
  teamHunts: TeamHunt[];
  finishedTasks: FinishedTask[];
}
