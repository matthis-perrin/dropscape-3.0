import axios from 'axios';
import * as EventEmitter from 'events';
import {Team, VideoStatus} from '../../../server/models';

const RETRY_ON_ERROR_TIMEOUT = 100;
const REFRESH_TIMEOUT = 500;

class Teams extends EventEmitter {
  private teams: Team[] = [];
  private currentTeam: Team | null = null;

  public constructor() {
    super();
    this.load();
  }

  public get all(): Team[] {
    return this.teams;
  }

  public get current(): Team | null {
    return this.currentTeam;
  }

  public select(team: Team | null): void {
    this.currentTeam = team;
    this.emit('changed');
  }

  private load = async (): Promise<void> =>  {
    try {
      const res = await axios.get('/teams/list');
      this.teams = res.data as Team[];
      this.emit('changed');
      setTimeout(this.load, REFRESH_TIMEOUT);
    } catch {
      setTimeout(this.load, RETRY_ON_ERROR_TIMEOUT);
    }
  }

  public create = async (teamName: string, duration: number): Promise<void> => {
    await axios.post('/teams/create', {teamName, duration})
    await this.load();
  }
  public start = async (teamName: string): Promise<void> => {
    await axios.post('/team/start', {teamName});
    await this.load();
  }
  public pause = async (teamName: string): Promise<void> => {
    await axios.post('/team/pause', {teamName});
    await this.load();
  }
  public reset = async (teamName: string): Promise<void> => {
    await axios.post('/team/reset', {teamName});
    await this.load();
  }
  public updateDuration = async (teamName: string, durationDelta: number): Promise<void> => {
    await axios.post('/team/update-duration', {teamName, durationDelta});
    await this.load();
  }
  public markWin = async (teamName: string): Promise<void> => {
    await axios.post('/team/mark-win', {teamName});
    await this.load();
  }
  public delete = async (teamName: string): Promise<void> => {
    await axios.post('/team/delete', {teamName});
    await this.load();
  }
  public setVideoStatus = async (teamName: string, videoStatus: VideoStatus): Promise<void> => {
    await axios.post('/team/set-video-status', {teamName, videoStatus});
    await this.load();
  }
  public setIsPresenting = async (teamName: string): Promise<void> => {
    await axios.post('/team/present', {teamName});
    await this.load();
  }
}

const teams = new Teams();
export default teams;
