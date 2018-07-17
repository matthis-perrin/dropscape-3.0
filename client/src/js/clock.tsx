import * as React from 'react';
import { extractTimeComponents } from './utils';

interface ClockProps {
  time?: number;
  duration?: number;
}

export default class Clock extends React.Component<ClockProps, {}> {
  public static displayName = 'Clock';

  private doubleDigit(value: number): string {
    if (value < 10) {
      return `0${value}`;
    }
    return String(value);
  }

  public render(): JSX.Element {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    if (this.props.time) {
      hours = new Date(this.props.time).getHours();
      minutes = new Date(this.props.time).getMinutes();
      seconds = new Date(this.props.time).getSeconds();
    } else if (this.props.duration) {
      const c = extractTimeComponents(this.props.duration);
      hours = c.hours;
      minutes = c.minutes;
      seconds = c.seconds;
    }
    return (
      <React.Fragment>
        {hours > 0 ? `${this.doubleDigit(hours)}:` : null}
        {this.doubleDigit(minutes)}:{this.doubleDigit(seconds)}
      </React.Fragment>
    )
  }
}
