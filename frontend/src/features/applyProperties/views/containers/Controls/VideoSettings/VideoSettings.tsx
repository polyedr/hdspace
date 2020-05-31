import React from 'react';
import { connect } from 'react-redux';
import { Checkbox } from '@material-ui/core';

import { AppReduxState } from '$shared/types/app';
import { ElementParameters, VideoSettings } from '$redux/project/types';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { Switch } from '$components/UI/Switch/Switch';

import { ControlSection } from '../../../components/ControlSection/ControlSection';
const styles = require('./VideoSettings.scss');

type StateProps = {
  videoSettings: VideoSettings['videoSettings'];
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as ElementParameters;

  return {
    videoSettings: activeItemParams.videoSettings as VideoSettings['videoSettings'],
  };
}

type Props = StateProps & PropertiesChangeProps;

const VideoSettings: React.FC<Props> = ({
  videoSettings,
  updateParams,
}) => {
  const { link, autoplay, start, end, loop, rel } = videoSettings;

  const handleLinkInputChange = ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateParams({ videoSettings: { ...videoSettings, link: value } });
  };

  const handleSwitchChange = () => {
    updateParams({ videoSettings: { ...videoSettings, autoplay: !autoplay } });
  };

  const handleStartInputChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    updateParams({ videoSettings: { ...videoSettings, start: Number(value) } });
  };

  const handleEndInputChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    updateParams({ videoSettings: { ...videoSettings, end: Number(value) } });
  };

  const handleLoopCheckboxChange = ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
    updateParams({ videoSettings: { ...videoSettings, loop: checked } });
  };

  const handleRelCheckboxChange = ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
    updateParams({ videoSettings: { ...videoSettings, rel: checked } });
  };

  return (
    <>
      <ControlSection title="Video link">
        <textarea
          className={styles.videoSettingsField}
          name="link"
          value={link}
          onChange={handleLinkInputChange}
        />
      </ControlSection>
      <ControlSection title="Autoplay">
        <Switch checked={!!autoplay} onChange={handleSwitchChange} />
      </ControlSection>
      <ControlSection title="Start at">
        <input
          className={styles.videoSettingsField}
          name="start"
          type="number"
          value={start}
          onChange={handleStartInputChange}
          min={0}
        />
      </ControlSection>
      <ControlSection title="End at">
        <input
          className={styles.videoSettingsField}
          name="end"
          type="number"
          value={end}
          onChange={handleEndInputChange}
          min={0}
        />
      </ControlSection>
      <ControlSection title="Loop">
        <Checkbox
          color="default"
          value="loop"
          name="loop"
          checked={loop}
          onChange={handleLoopCheckboxChange}
        />
      </ControlSection>
      <ControlSection title="Show only channel related videos">
        <Checkbox
          color="default"
          value="show related videos"
          name="show related videos"
          checked={rel}
          onChange={handleRelCheckboxChange}
        />
      </ControlSection>
    </>
  );
};

const Component = connect(mapState)(withConfigurableProperties(VideoSettings));
export { Component as VideoSettings };
