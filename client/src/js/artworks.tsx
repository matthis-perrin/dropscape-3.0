import axios from 'axios';
import * as EventEmitter from 'events';
import {SevArtwork} from '../../../server/models';

const RETRY_ON_ERROR_TIMEOUT = 100;

class Artworks extends EventEmitter {
  private artworks: SevArtwork[] = [];

  public constructor() {
    super();
    this.load();
  }

  public get all(): SevArtwork[] {
    return this.artworks;
  }

  private load = (): void =>  {
    axios.get('/sev-artworks/list')
      .then((res) => {
        this.artworks = res.data as SevArtwork[];
        this.emit('changed');
      })
      .catch(() => setTimeout(this.load, RETRY_ON_ERROR_TIMEOUT))
  }
}

const artworks = new Artworks();
export default artworks;
