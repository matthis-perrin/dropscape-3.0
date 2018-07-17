import * as models from '../../../server/models';
import {TeamStatusType} from './team-status';

export interface TimeComponents {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export function extractTimeComponents(duration: number): TimeComponents {
  const hours = Math.floor(duration / (60 * 60 * 1000));
  duration -= hours * 60 * 60 * 1000;
  const minutes = Math.floor(duration / (60 * 1000));
  duration -= minutes * 60 * 1000;
  const seconds = Math.floor(duration / 1000);
  duration -= seconds * 1000;
  const milliseconds = duration
  return {hours, minutes, seconds, milliseconds};
}

export function timeSpentInPause(pauses: models.Pause[], now: number): number {
  return pauses.reduce((acc: number, p: models.Pause): number => {
    const end = p.endTime || now;
    return acc + end - p.startTime;
  }, 0);
}

export function timeLeft(team: models.Team): number {
  if (!team.startTime) {
    return team.duration;
  }
  const now = new Date().getTime();
  const pauseTime = timeSpentInPause(team.pauses, now);
  const elapsedTime = (team.endTime || now) - team.startTime - pauseTime;
  return Math.max(0, team.duration - elapsedTime);
}

export function teamStatus(team: models.Team): TeamStatusType {
  if (team.startTime === undefined) {
    return TeamStatusType.NotStarted;
  }
  const left = timeLeft(team);
  if (team.endTime !== undefined) {
    return TeamStatusType.Won;
  }
  if (team.pauses.filter(p => p.endTime === undefined).length > 0) {
    return TeamStatusType.Paused;
  }
  if (left > 0) {
    return TeamStatusType.Running;
  }
  return TeamStatusType.Lost;
}
