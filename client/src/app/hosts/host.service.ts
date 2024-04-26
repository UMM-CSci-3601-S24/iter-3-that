import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Hunt } from '../hunts/hunt';
import { Task } from '../hunts/task';
import { StartedHunt } from '../startHunt/startedHunt';
import { EndedHunt } from '../endedHunts/endedHunt';
import { TeamHunt } from '../hunters/join-hunt/teamHunt';
import { CompleteHunt } from '../hunts/completeHunt';

@Injectable({
  providedIn: 'root'
})
export class HostService {
  readonly hostUrl: string = `${environment.apiUrl}hosts`;
  readonly huntUrl: string = `${environment.apiUrl}hunts`;
  readonly taskUrl: string = `${environment.apiUrl}tasks`;
  readonly startHuntUrl: string = `${environment.apiUrl}startHunt`;
  readonly startedHuntUrl: string = `${environment.apiUrl}startedHunts`;
  readonly endHuntUrl: string = `${environment.apiUrl}endHunt`;
  readonly endedHuntsUrl: string = `${environment.apiUrl}endedHunts`;
  readonly endedHuntUrl: string = `${environment.apiUrl}teamHunt`;
  readonly teamUrl: string = `${environment.apiUrl}teamHunts`;
  readonly teamHuntUrl: string = `${environment.apiUrl}teamHunt`;

  constructor(private httpClient: HttpClient){
  }

  getHunts(): Observable<Hunt[]> {
    return this.httpClient.get<Hunt[]>(`${this.hostUrl}/588945f57546a2daea44de7c`);
  }

  getHuntById(id: string): Observable<CompleteHunt> {
    return this.httpClient.get<CompleteHunt>(`${this.huntUrl}/${id}`);
  }

  addHunt(newHunt: Partial<Hunt>): Observable<string> {
    newHunt.hostId = "588945f57546a2daea44de7c";
    return this.httpClient.post<{id: string}>(this.huntUrl, newHunt).pipe(map(result => result.id));
  }

  addTask(newTask: Partial<Task>): Observable<string> {
    return this.httpClient.post<{id: string}>(this.taskUrl, newTask).pipe(map(res => res.id));
  }

  deleteHunt(id: string): Observable<void> {
    return this.httpClient.delete<void>(`/api/hunts/${id}`);
  }

  deleteTask(id: string): Observable<void> {
    return this.httpClient.delete<void>(`/api/tasks/${id}`);
  }

  startHunt(id: string, numTeams: number): Observable<string> {
    return this.httpClient.get<string>(`${this.startHuntUrl}/${id}/teams/${numTeams}`);
  }

  getStartedHunt(accessCode: string): Observable<StartedHunt> {
    return this.httpClient.get<StartedHunt>(`${this.startedHuntUrl}/${accessCode}`);
  }

  getTeamHunt(id: string): Observable<TeamHunt> {
    return this.httpClient.get<TeamHunt>(`${this.teamUrl}/${id}`);
  }

  getTeamsByCode (accessCode: string): Observable<TeamHunt[]> {
    return this.httpClient.get<TeamHunt[]>(`${this.teamHuntUrl}/${accessCode}`);
  }

  createTeam(newTeamHunt: Partial<TeamHunt>): Observable<string> {
    return this.httpClient.post<{id: string}>(this.teamUrl, newTeamHunt).pipe(map(res => res.id));
  }

  // This is a put request that ends the hunt by setting its status to false
  endStartedHunt(id: string): Observable<void> {
    return this.httpClient.put<void>(`${this.endHuntUrl}/${id}`, null);
  }

  // This is a get request that gets all the ended StartedHunts
  getEndedHunts(hostId: string): Observable<StartedHunt[]> {
    return this.httpClient.get<StartedHunt[]>(`${this.hostUrl}/${hostId}/endedHunts`);
  }

  // This is a delete request that deletes the ended StartedHunt
  deleteEndedHunt(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.endedHuntsUrl}/${id}`);
  }

  submitPhoto(teamHuntId: string, taskId: string, photo: File): Observable<string> {
    const formData = new FormData();
    formData.append('photo', photo);
    return this.httpClient.post<{id: string}>(`${this.endedHuntUrl}/${teamHuntId}/tasks/${taskId}/photo`, formData).pipe(map(result => result.id));
  }

  getEndedHuntById(id: string): Observable<EndedHunt> {
    return this.httpClient.get<EndedHunt>(`${this.endedHuntsUrl}/${id}`);
  }

  updateHunt(id: string, updatedHunt: Partial<Hunt>): Observable<Hunt> {
    return this.httpClient.put<Hunt>(`${this.huntUrl}/${id}`, updatedHunt);
  }

}
