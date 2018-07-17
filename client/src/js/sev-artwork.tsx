import * as React from 'react';

import * as models from '../../../server/models';

export enum SevArtworkSize {
  Large = 'large',
  Medium = 'medium',
  Small = 'small',
  XSmall = 'x-small',
  XXSmall = 'xx-small',
}

interface SevArtworkProps {
  sevArtwork: models.SevArtwork
  size: SevArtworkSize;
}

export class SevArtwork extends React.Component<SevArtworkProps, {}> {
  public static displayName = 'SevArtwork';

  public render(): JSX.Element {
    return (
      <div className={`sev-artwork-wrapper sev-artwork-wrapper--${this.props.size}`}>
        <div className={`bg-${this.props.sevArtwork.name} sev-artwork`}></div>
      </div>
    )
  }
}
