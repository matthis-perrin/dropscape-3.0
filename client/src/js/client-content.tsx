import * as React from 'react';
import {Typography} from '@material-ui/core';
import * as models from '../../../server/models';
import { SevArtworkSize, SevArtwork } from './sev-artwork';
import TimerCountdown from './timer-countdown';
import {teamStatus} from './utils';
import {TeamStatusType} from './team-status';
import teams from './teams';

interface ClientContentProps {
  team: models.Team;
  artwork: models.SevArtwork;
}

interface ClientContentState {
  isPlaying: boolean;
}

export default class ClientContent extends React.Component<ClientContentProps, ClientContentState> {
  public static displayName = 'ClientContent';
  private video: HTMLVideoElement | null = null;

  public constructor(props: ClientContentProps) {
    super(props);
    this.state = {
      isPlaying: false,
    }
  }

  public shouldComponentUpdate(nextProps: ClientContentProps, nextState: ClientContentState): boolean {
    return (
      JSON.stringify(this.props.team) !== JSON.stringify(nextProps.team) ||
      this.state.isPlaying !== nextState.isPlaying
    );
  }

  public componentDidUpdate(prevProps: ClientContentProps): void {
    const prevTeam = prevProps.team;
    const currentTeam = this.props.team;
    const prevStatus = teamStatus(prevTeam);
    const currentStatus = teamStatus(currentTeam);

    if (currentStatus === TeamStatusType.Won && currentTeam.videoStatus === models.VideoStatus.NotPlayed) {
      if (prevStatus !== TeamStatusType.Won) {
        this.handleTeamWon();
      } else if (prevStatus === TeamStatusType.Won && prevTeam.videoStatus !== models.VideoStatus.NotPlayed) {
        this.replayVideo();
      }
    }
    if (prevStatus === TeamStatusType.Won && currentStatus !== TeamStatusType.Won) {
      this.setState({isPlaying: false});
      if (this.video) {
        this.video.currentTime = 0;
        this.video.pause();
        teams.setVideoStatus(this.props.team.name, models.VideoStatus.NotPlayed);
      }
    }
  }

  private handleTeamWon(): void {
    this.replayVideo();
  }

  private replayVideo(): void {
    this.setState({isPlaying: true});
    if (this.video) {
      this.video.currentTime = 0;
      this.video.play();
      teams.setVideoStatus(this.props.team.name, models.VideoStatus.Playing);
    }
  }

  private handleVideoEnded = (): void => {
    teams.setVideoStatus(this.props.team.name, models.VideoStatus.Played);
  }

  public render(): JSX.Element {
    const team = this.props.team;
    const artwork = this.props.artwork;

    return (
      <React.Fragment>
        <SevArtwork sevArtwork={artwork} size={SevArtworkSize.Medium} />
        <Typography style={{color: 'rgba(255, 255, 255, 0.4)'}} variant="display2">{`Team ${artwork.label}`}</Typography>
        <Typography style={{color: 'rgba(255, 255, 255, 0.8)'}} variant="display4"><TimerCountdown team={team} /></Typography>
        <video
          width={800}
          preload="auto"
          src="win-video.mp4"
          ref={v => {
            this.video = v;
            if (this.video) {
              this.video.onended = this.handleVideoEnded;
            }
          }}
          style={{
            opacity: this.state.isPlaying ? 1 : 0,
            transition: 'opacity ease-in 600ms'
          }}
        />
      </React.Fragment>
    );
  }
}
