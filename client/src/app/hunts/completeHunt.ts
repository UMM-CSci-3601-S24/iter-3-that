import { Hunt } from "./hunt";
import { Task } from "./task";
import { Team } from "./team";


export interface CompleteHunt {
  hunt: Hunt;
  tasks: Task[];
  teams: Team[];
}
