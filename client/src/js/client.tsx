import * as React from 'react';
import * as models from '../../../server/models';
import teams from './teams';
import artworks from './artworks';
import ClientContent from './client-content';

interface ClientProps {
}

interface ClientState {
  team?: models.Team;
  sevArtworks: models.SevArtwork[];
}

export default class Client extends React.Component<ClientProps, ClientState> {
  public static displayName = 'Client';

  public constructor(props: ClientProps) {
    super(props);
    this.state = {
      team: undefined,
      sevArtworks: [],
    }
    teams.addListener('changed', this.getTeamInfo);
    artworks.addListener('changed', this.getArtworks);
  }

  public componentDidMount(): void {
    this.getTeamInfo();
    this.getArtworks();
  }

  public componentWillUnmount(): void {
    teams.removeListener('changed', this.getTeamInfo);
    artworks.removeListener('changed', this.getArtworks);
  }

  private getTeamInfo = (): void => {
    const currentTeam = teams.all.filter(t => t.isPresenting)[0];
    this.setState({team: currentTeam});
  }

  private getArtworks = (): void => {
    this.setState({sevArtworks: artworks.all});
  }

  public render(): JSX.Element {
    const team = this.state.team;
    const sevArtwork = team && this.state.sevArtworks.filter(a => a.name === team.name)[0];
    if (!team || !sevArtwork) {
      return <React.Fragment></React.Fragment>;
    }
    return (
      <div style={{
        backgroundColor: '#30363C',
      }}>
        <ClientContent team={team} artwork={sevArtwork} />
      </div>
    );
  }
}
