import * as React from 'react';
import * as models from '../../../server/models';
import {extractTimeComponents, TimeComponents, timeLeft} from './utils';

interface TimerCountdownProps {
  team: models.Team;
  prefix?: string | JSX.Element;
}
interface TimerCountdownState extends TimeComponents {}

export default class TimerCountdown extends React.Component<TimerCountdownProps, TimerCountdownState> {
  public static displayName = 'TimerCountdown';
  private updateLoopTimer: NodeJS.Timer | undefined;

  public constructor(props: TimerCountdownProps) {
    super(props);
    this.state = this.getNewState();
  }

  public componentDidMount() {
    this.stateUpdateLoop();
  }

  public componentWillUnmount() {
    if (this.updateLoopTimer) {
      clearTimeout(this.updateLoopTimer);
    }
  }

  private getNewState (): TimerCountdownState {
    let left = timeLeft(this.props.team);
    return extractTimeComponents(left);
  }

  private stateUpdateLoop = () => {
    this.setState(this.getNewState(), () => {
      this.updateLoopTimer = setTimeout(this.stateUpdateLoop, 500);
    });
  }

  private doubleDigit(value: number): string {
    if (value < 10) {
      return `0${value}`;
    }
    return String(value);
  }

  public render(): JSX.Element {
    const minutes = this.state.hours * 60 + this.state.minutes;
    return (
      <React.Fragment>
        {this.props.prefix}
        {this.doubleDigit(minutes)}
        :
        {this.doubleDigit(this.state.seconds)}
      </React.Fragment>
    );
  }
}
