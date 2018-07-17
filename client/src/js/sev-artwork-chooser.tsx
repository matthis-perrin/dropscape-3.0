import * as React from 'react';
import * as models from '../../../server/models';
import {SevArtwork, SevArtworkSize} from './sev-artwork';
import teams from './teams';
import artworks from './artworks';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select/Select';
import MenuItem from '@material-ui/core/MenuItem';

interface Props {
  value?: models.SevArtwork;
  onChoose?: (sevArtwork: models.SevArtwork) => void;
}

interface State {
  sevArtworks: models.SevArtwork[];
  teams: models.Team[];
  selectedSevArtwork: models.SevArtwork;
}

export default class SevArtworkChooser extends React.Component<Props, State> {
  static displayName = 'SevArtworkChooser';

  public constructor(props: {}) {
    super(props);

    this.state = {
      sevArtworks: artworks.all,
      teams: teams.all,
      selectedSevArtwork: this.getAvailableArtworks(teams.all, artworks.all)[0],
    }
    teams.addListener('changed', this.handleTeamsChanged);
    artworks.addListener('changed', this.handleSevArtworksChanged);
  }

  public componentDidMount() {
    if (this.props.onChoose) {
      this.props.onChoose(this.state.selectedSevArtwork);
    }
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

  private handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sevArtwork = this.state.sevArtworks.filter(a => a.name === event.target.value)[0];
    this.setState({selectedSevArtwork: sevArtwork});
    if (this.props.onChoose) {
      this.props.onChoose(sevArtwork);
    }
  }

  private getAvailableArtworks(teams: models.Team[], artworks: models.SevArtwork[]): models.SevArtwork[] {
    const usedArtworks = teams.map(t => t.name);
    const selectableSevArworks = artworks.filter(sevArtwork => {
      return usedArtworks.indexOf(sevArtwork.name) === -1;
    })
    return selectableSevArworks;
  }

  public render(): JSX.Element {
    return (
      <React.Fragment>
        <form autoComplete="off">
          <FormControl style={{width: 256}}>
            <InputLabel htmlFor="team-name">Team Name</InputLabel>
            <Select
              value={this.state.selectedSevArtwork.name}
              onChange={this.handleChange}
              inputProps={{id: 'team-name', name: 'teamName'}}
              renderValue={name => {
                const artwork = this.state.sevArtworks.filter(a => a.name === name)[0];
                if (!artwork) {
                  return name;
                }
                return (
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <SevArtwork sevArtwork={artwork} size={SevArtworkSize.XXSmall} />
                    <Typography variant="body1" style={{marginLeft: 8}}>{artwork.label}</Typography>
                  </div>
                );
              }}
            >
              {this.getAvailableArtworks(this.state.teams, this.state.sevArtworks).map(a => (
                <MenuItem key={a.name} value={a.name} style={{height: 32}}>
                  <SevArtwork sevArtwork={a} size={SevArtworkSize.XSmall} />
                  <span style={{paddingLeft: 12}}>{a.label}</span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </form>
      </React.Fragment>
    );
  }
}
