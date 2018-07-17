import * as React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';

import * as models from '../../../server/models';

import {SevArtwork, SevArtworkSize} from './sev-artwork';
import artworks from './artworks';
import TeamStatus, { TeamStatusType } from './team-status';
import { teamStatus } from './utils';

interface Props {
  team: models.Team;
  onClick?: () => void;
}

interface State {
  sevArtworks: models.SevArtwork[];
  now: number;
}

const StatusColor = {
  [TeamStatusType.NotStarted]: grey[300],
  [TeamStatusType.Won]: green[300],
  [TeamStatusType.Paused]: blue[300],
  [TeamStatusType.Running]: blue[300],
  [TeamStatusType.Lost]: red[300],
}

export default class TeamCard extends React.Component<Props, State> {
  static displayName = 'TeamCard';
  private refreshInterval: NodeJS.Timer | undefined;

  public constructor(props: Props) {
    super(props);
    this.state = {
      sevArtworks: artworks.all,
      now: new Date().getTime(),
    }
    artworks.addListener('changed', this.handleSevArtworksChanged);
  }

  public componentDidMount(): void {
    this.refreshInterval = setInterval(() => this.setState({now: new Date().getTime()}), 500);
  }

  public componentWillUnmount(): void {
    artworks.removeListener('changed', this.handleSevArtworksChanged);
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  private handleSevArtworksChanged = () => {
    this.setState({sevArtworks: artworks.all})
  }

  private getArtwork(name: string): models.SevArtwork {
    return this.state.sevArtworks.filter(a => a.name === name)[0];
  }

  public render(): JSX.Element {
    const team = this.props.team;
    const artwork = this.getArtwork(team.name);

    return (
      <Card elevation={team.isPresenting ? 4 : 1} onClick={this.props.onClick} style={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
      }}>
        <div style={{
          height: 100,
          width: 8,
          marginRight: 16,
          backgroundColor: StatusColor[teamStatus(team)],
        }}></div>
        <SevArtwork sevArtwork={artwork} size={SevArtworkSize.Small} />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          margin: '0 8px 0 16px',
        }}>
          <Typography variant="headline" style={{fontSize: 19}}>
            {artwork.label}
          </Typography>
          <TeamStatus team={team} />
        </div>
      </Card>
    );
  }
}
