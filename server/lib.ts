import {Team} from './models';
import {DB} from './db';

export enum TeamFilter {
  InProgress
}

class Teams {
  private teams: Team[] = [];

  public constructor() {
    this.load();
  }

  fetch(filter?: TeamFilter): Team[] {
    if (!filter) {
      return this.teams;
    }
    if (filter === TeamFilter.InProgress) {
      return this.teams.filter(t => t.endTime === undefined && t.startTime !== undefined);
    }
  }

  update(...teams: Team[]): void {
    for (let team of teams) {
      this.teams = this.teams
        .filter(t => team.id !== t.id)
        .concat(team)
        .sort((t1, t2) => {
          if (t2.startTime === undefined && t1.startTime === undefined) {
            return 0;
          }
          if (t2.startTime !== undefined && t1.startTime === undefined) {
            return -1;
          }
          if (t2.startTime === undefined && t1.startTime !== undefined) {
            return 1;
          }
          return t2.startTime - t1.startTime;
        });
    }
    this.save();
  }

  public all(): Team[] {
    return this.teams;
  }

  public get(teamName: string): Team | undefined {
    return this.teams.filter(t => t.name === teamName)[0];
  }

  private load(): void {
    this.teams = DB.loadTeams().filter(t => !t.deleted);
  }

  private save(): void {
    DB.saveTeams(this.teams);
    this.load();
  }
}

export const teams = new Teams();
