import * as React from 'react';
import Typography from '@material-ui/core/Typography';

import * as models from '../../../server/models';

import { timeLeft, teamStatus } from './utils';
import Clock from './clock';
import TimerCountdown from './timer-countdown';

interface Props {
  team: models.Team;
}

interface State {
  now: number;
}
export enum TeamStatusType {
  Running = 10,
  Paused = 20,
  NotStarted = 30,
  Won = 40,
  Lost = 50,
}

export default class TeamStatus extends React.Component<Props, State> {
  static displayName = 'TeamStatus';
  private refreshInterval: NodeJS.Timer | undefined;

  public constructor(props: Props) {
    super(props);
    this.state = {
      now: new Date().getTime(),
    }
  }

  public componentDidMount(): void {
    this.refreshInterval = setInterval(() => this.setState({now: new Date().getTime()}), 500);
  }

  public componentWillUnmount(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  public render(): JSX.Element {
    const team = this.props.team;
    const status = teamStatus(team);
    if (status === TeamStatusType.NotStarted) {
      return <Typography noWrap>Not started</Typography>;
    }
    const left = timeLeft(team);
    if (status === TeamStatusType.Won) {
      return <Typography noWrap>Won in <Clock duration={team.duration - left} /></Typography>
    } else if (status === TeamStatusType.Paused) {
      return <Typography noWrap>Paused <Clock duration={left} /></Typography>
    } else if (status === TeamStatusType.Running) {
      return <Typography noWrap><TimerCountdown prefix="Running " team={team} /></Typography>;
    }
    return <Typography noWrap>Lost</Typography>;
  }
}
