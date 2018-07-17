import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import {Team} from '../../../server/models';

import CreateTeamForm from './create-team-form';
import TeamList from './team-list';
import teams from './teams';
import TeamView from './team-view';

interface AdminState {
  isCreating: boolean;
  isOpening: boolean;
}

export default class Admin extends React.Component<{}, AdminState> {
  public static displayName = 'Admin';

  public constructor(props: {}) {
    super(props);
    this.state = {
      isCreating: false,
      isOpening: false,
    }
  }

  private handleCreateTeamClick = (): void => {
    this.setState({isCreating: true});
  }

  private closeCreationModal = (): void => {
    this.setState({isCreating: false});
  }

  private handleTeamOpen = (team: Team) => {
    teams.select(team);
    this.setState({isOpening: true});
  }

  private closeTeamModal = (): void => {
    teams.select(null);
    this.setState({isOpening: false});
  }

  private renderCreateModal(): JSX.Element {
    return <CreateTeamForm open={this.state.isCreating} onClose={this.closeCreationModal} />
  }

  private renderTeamModal(): JSX.Element | undefined {
    if (!teams.current) {
      return undefined;
    }
    return <TeamView open={this.state.isOpening} onClose={this.closeTeamModal} team={teams.current} />;
  }

  public render(): JSX.Element {
    return (
      <React.Fragment>
        <AppBar position="sticky" color="primary">
          <Toolbar>
            <Typography variant="title" color="inherit" style={{flex: 1}}>
              Dropscape 3.0 | Admin
            </Typography>
            <Button color="inherit" onClick={this.handleCreateTeamClick}>
              Add Team
            </Button>
          </Toolbar>
        </AppBar>
        <div style={{padding: 32}}>
          <TeamList onTeamOpen={this.handleTeamOpen} />
        </div>
        {this.state.isCreating ? this.renderCreateModal() : null}
        {this.state.isOpening ? this.renderTeamModal() : null}
      </React.Fragment>
    );
  }
}
