import { TeamHunt } from "../hunters/join-hunt/teamHunt";
import { StartedHunt } from "../startHunt/startedHunt";

export interface EndedHunt {
  startedHunt: StartedHunt;
  teamHunts: TeamHunt[];
}
