import * as React from 'react';
import * as models from '../../../server/models';
import teams from './teams';
import TeamCard from './team-card';
import {teamStatus, timeLeft} from './utils';
import {TeamStatusType} from './team-status';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

interface Props {
  onTeamOpen: (team: models.Team) => void;
}

interface State {
  teams: models.Team[];
}

export default class TeamList extends React.Component<Props, State> {
  static displayName = 'TeamList';

  public constructor(props: Props) {
    super(props);
    this.state = {
      teams: this.sortTeam(teams.all),
    }
    teams.addListener('changed', this.handleTeamsChanged);
  }

  public componentWillUnmount() {
    teams.removeListener('changed', this.handleTeamsChanged);
  }

  private sortTeam(teams: models.Team[]): models.Team[] {
    return teams.sort((t1, t2) => {
      const status1 = teamStatus(t1);
      const status2 = teamStatus(t2);
      if (status1 !== status2) {
        return status1 - status2;
      }
      if ([TeamStatusType.Running, TeamStatusType.Paused].indexOf(status1) > -1) {
        return timeLeft(t1) - timeLeft(t2);
      }
      return t2.creationTime - t1.creationTime;
    });
  }

  private handleTeamsChanged = () => {
    const sortedTeams = this.sortTeam(teams.all);
    this.setState({teams: sortedTeams})
  }

  private renderTeams = (teams: models.Team[]): JSX.Element[] => {
    const chunks: models.Team[][] = [[]];
    for (const team of teams) {
      let chunk = chunks[chunks.length - 1];
      if (chunk.length >= 3) {
        chunks.push([team])
      } else {
        chunk.push(team)
      }
    }
    return chunks.map((c, i) => (
      <Grid key={i} container spacing={16}>
        {c.map(t => (
          <Grid item xs={4} key={t.name} style={{marginBottom: 16}}>
            <TeamCard team={t} onClick={this.props.onTeamOpen.bind(this, t)} />
          </Grid>
        ))}
      </Grid>
    ));
  }

  public render(): JSX.Element {
    if (this.state.teams.length === 0) {
      return <Typography variant="display1" align="center" style={{marginTop: 32}}>No teams yet. Create one!</Typography>
    }
    const inProgressTeams = this.state.teams.filter(t => [TeamStatusType.Running, TeamStatusType.Paused].indexOf(teamStatus(t)) > -1);
    const notStartedTeams = this.state.teams.filter(t => teamStatus(t) === TeamStatusType.NotStarted);
    const finishedTeams = this.state.teams.filter(t => [TeamStatusType.Won, TeamStatusType.Lost].indexOf(teamStatus(t)) > -1);
    return (
      <React.Fragment>
        {[
          {label: 'In Progress', teams: inProgressTeams},
          {label: 'Ready to start', teams: notStartedTeams},
          {label: 'Finished', teams: finishedTeams},
        ].map(data => {
          return data.teams.length > 0
            ? (
              <React.Fragment key={data.label}>
                <Typography variant="headline" paragraph style={{marginTop: 16}}>{data.label}</Typography>
                {this.renderTeams(data.teams)}
              </React.Fragment>
            ) : null
        })}
      </React.Fragment>
    );
  }
}
