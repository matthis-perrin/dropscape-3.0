import * as React from 'react';
import * as models from '../../../server/models';
import teams from './teams';
import artworks from './artworks';
import TimerCountdown from './timer-countdown';
import Clock from './clock';
import TeamCard from './team-card';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
  Zoom,
} from '@material-ui/core';
import PauseIcon from '@material-ui/icons/Pause';
import {TeamStatusType} from './team-status';
import {teamStatus} from './utils';

interface Props {
  team: models.Team;
  open: boolean;
  onClose: () => void;
}

interface State {
  sevArtworks: models.SevArtwork[];
  teams: models.Team[];
  newTeamDuration?: string;
}

export default class TeamView extends React.Component<Props, State> {
  static displayName = 'TeamView';

  public constructor(props: Props) {
    super(props);
    this.state = {
      sevArtworks: artworks.all,
      teams: teams.all,
      newTeamDuration: undefined,
    }
    teams.addListener('changed', this.handleTeamsChanged);
    artworks.addListener('changed', this.handleSevArtworksChanged);
  }

  public componentWillUnmount() {
    teams.removeListener('changed', this.handleTeamsChanged);
    artworks.removeListener('changed', this.handleSevArtworksChanged);
  }

  private handleTeamsChanged = () => {
    this.setState({teams: teams.all})
  }

  private handleSevArtworksChanged = () => {
    this.setState({sevArtworks: artworks.all})
  }

  private getTeam(): models.Team {
    return this.state.teams.filter(t => t.name === this.props.team.name)[0];
  }

  private teamStatusIn(statuses: TeamStatusType[]): boolean {
    return statuses.indexOf(teamStatus(this.getTeam())) !== -1;
  }

  private canStart(): boolean {
    return this.teamStatusIn([TeamStatusType.NotStarted, TeamStatusType.Paused]);
  }

  private canPause(): boolean {
    return this.teamStatusIn([TeamStatusType.Running]);
  }

  private canUpdateDuration(): boolean {
    return this.teamStatusIn([TeamStatusType.NotStarted, TeamStatusType.Paused, TeamStatusType.Running]);
  }

  private canWin(): boolean {
    return this.teamStatusIn([TeamStatusType.Paused, TeamStatusType.Running]);
  }

  private canReplayVideo(): boolean {
    return this.teamStatusIn([TeamStatusType.Won]);
  }

  private canSetIsPresenting(): boolean {
    return !this.getTeam().isPresenting;
  }

  private canReset(): boolean {
    return this.teamStatusIn([TeamStatusType.Paused, TeamStatusType.Running, TeamStatusType.Won, TeamStatusType.Lost]);
  }

  public render(): JSX.Element {
    const team = this.getTeam();
    if (!team) {
      return <React.Fragment />
    }
    const buttonStyles = {marginRight: 16};
    const headerStyles = {margin: '16px 0 8px 0'};
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        scroll='paper'
        maxWidth='md'
        fullWidth
        TransitionComponent={Zoom}>
        <DialogTitle>
          <TeamCard team={team} />
        </DialogTitle>
        <DialogContent>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <span>
              <Typography variant="headline" style={headerStyles}>
                Timer (
                  {team.startTime
                  ? <React.Fragment>Started at <Clock time={team.startTime} /></React.Fragment>
                  : 'Not started'})
              </Typography>
              <Button
                variant="contained"
                style={buttonStyles}
                color="primary"
                disabled={!this.canStart()}
                onClick={teams.start.bind(this, team.name)}
              >Start</Button>
              <Button
                variant="contained"
                style={buttonStyles}
                color="primary"
                disabled={!this.canPause()}
                onClick={teams.pause.bind(this, team.name)}
              >Pause</Button>
            </span>
            <Typography variant="display2"><TimerCountdown team={team} /></Typography>
          </div>

          <Typography variant="headline" style={headerStyles}>
            {`Duration (${Math.round(team.duration / 60 / 1000)} min)`}
          </Typography>
          <Button
            variant="contained"
            style={buttonStyles}
            color="default"
            disabled={!this.canUpdateDuration()}
            onClick={teams.updateDuration.bind(this, team.name, 60 * 1000)}
          >Add 1 min</Button>
          <Button
            variant="contained"
            style={buttonStyles}
            color="default"
            disabled={!this.canUpdateDuration()}
            onClick={teams.updateDuration.bind(this, team.name, 60 * 5 * 1000)}
          >Add 5 min</Button>
          <Button
            variant="contained"
            style={buttonStyles}
            color="default"
            disabled={!this.canUpdateDuration()}
            onClick={teams.updateDuration.bind(this, team.name, -60 * 1000)}
          >Remove 1 min</Button>
          <Button
            variant="contained"
            style={buttonStyles}
            color="default"
            disabled={!this.canUpdateDuration()}
            onClick={teams.updateDuration.bind(this, team.name, -60 * 5 * 1000)}
          >Remove 5 min</Button>

          <Typography variant="headline" style={headerStyles}>Actions</Typography>
          <Button
            variant="contained"
            style={buttonStyles}
            color="primary"
            disabled={!this.canSetIsPresenting()}
            onClick={teams.setIsPresenting.bind(this, team.name)}
          >Present</Button>
          <Button
            variant="contained"
            style={buttonStyles}
            color="primary"
            disabled={!this.canWin()}
            onClick={teams.markWin.bind(this, team.name)}
          >Mark Win</Button>
          <Button
            variant="contained"
            style={buttonStyles}
            color="primary"
            disabled={!this.canReplayVideo()}
            onClick={teams.setVideoStatus.bind(this, team.name, models.VideoStatus.NotPlayed)}
          >Replay Video</Button>
          <Button
            variant="contained"
            style={buttonStyles}
            color="secondary"
            disabled={!this.canReset()}
            onClick={teams.reset.bind(this, team.name)}
          >Reset</Button>
          <Button
            variant="contained"
            style={buttonStyles}
            color="secondary"
            onClick={teams.delete.bind(this, team.name)}
          >Delete</Button>

          {team.pauses.length > 0
            ? (
              <React.Fragment>
                <Typography variant="headline" style={headerStyles}>
                  {`${team.pauses.length} Pause${team.pauses.length > 1 ? 's' : ''}`}
                </Typography>
                <List>
                  {team.pauses.reverse().map((p, i) => (
                    <ListItem disableGutters divider={i < team.pauses.length - 1}>
                      <ListItemIcon style={{marginRight: 0}}>
                        <PauseIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={p.endTime
                          ? (
                            <span>
                              Paused from <Clock time={p.startTime} />&nbsp;
                              to <Clock time={p.endTime} />
                            </span>
                          ) : (
                            <span>
                              Pause started at <Clock time={p.startTime} />
                            </span>
                          )
                        }
                        secondary={p.endTime && <Clock duration={p.endTime - p.startTime} />}
                      />
                    </ListItem>
                  ))}
                </List>
              </React.Fragment>
            ): null}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
