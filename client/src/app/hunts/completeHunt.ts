import { Hunt } from "./hunt";
import { Task } from "./task";


export interface CompleteHunt {
  hunt: Hunt;
  tasks: Task[];
}
