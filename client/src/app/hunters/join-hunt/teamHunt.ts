import { StartedHunt } from "src/app/startHunt/startedHunt";

export interface TeamHunt {
  _id: string;
  startedHunt: StartedHunt;
  teamName: string;
  members: string[];
}
