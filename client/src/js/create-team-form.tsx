import * as React from 'react';
import * as models from '../../../server/models';
import SevArtworkChooser from './sev-artwork-chooser';
import teams from './teams';
import {
  Zoom,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';

interface CreateTeamFormProps {
  open: boolean;
  onClose: () => void;
}

interface CreateTeamFormState {
  sevArtwork?: models.SevArtwork;
  duration: string;
  isCreating: boolean;
}

export default class CreateTeamForm extends React.Component<CreateTeamFormProps, CreateTeamFormState> {
  public static displayName = 'CreateTeamForm';

  public constructor(props: CreateTeamFormProps) {
    super(props);
    this.state = {
      sevArtwork: undefined,
      duration: '45',
      isCreating: false,
    }
  }

  private handleSevArtworkChanged = (sevArtwork: models.SevArtwork): void => {
    this.setState({sevArtwork});
  }

  private handleDurationChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({duration: event.target.value});
  }

  private createTeam = async (): Promise<void> => {
    if (!this.canSubmit()) {
      return;
    }
    const duration = this.getDuration();
    if (!duration || !this.state.sevArtwork) {
      return;
    }
    this.setState({isCreating: true});
    await teams.create(this.state.sevArtwork.name, duration);
    this.setState({isCreating: false});
    this.props.onClose();
  }

  private getDuration(): number | undefined {
    try {
      return Math.round(parseFloat(this.state.duration) * 60 * 1000);
    } catch {
      return undefined;
    }
  }

  private canSubmit(): boolean {
    return (
      !this.state.isCreating &&
      this.state.sevArtwork !== undefined &&
      Boolean(this.getDuration())
    );
  }

  public render(): JSX.Element {
    return (
      <Dialog open={this.props.open} onClose={this.props.onClose} scroll='paper' TransitionComponent={Zoom}>
        <DialogTitle>Add a new team</DialogTitle>
        <DialogContent>
          <SevArtworkChooser onChoose={this.handleSevArtworkChanged} />
          <TextField
            label="Duration"
            value={this.state.duration}
            onChange={this.handleDurationChanged}
            type="number"
            style={{width: '100%', marginTop: 24}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} variant="raised">
            Cancel
          </Button>
          <Button onClick={this.createTeam} variant="raised" color="primary" disabled={!this.canSubmit()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
