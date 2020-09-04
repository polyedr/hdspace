import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Checkbox } from '@material-ui/core';
import cn from 'classnames';
import ControlSection from '../../../components/ControlSection/ControlSection';
import Switch from '../../../../../../components/UI/Switch/Switch';
import { AppReduxState } from '../../../../../../shared/types/app';
import { VideoElement, VideoSettingsType } from '../../../../../../api/types';
import { selectActiveItemParams } from '../../../../../../redux/project/selectors';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { extractPlayerLinkInfo } from '../../../../../../utils/extractVideoLink';

const styles = require('./VideoSettings.scss');

type StateProps = {
  videoSettings: VideoSettingsType;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveItemParams<VideoElement>(state);

  return {
    videoSettings: activeItemParams.videoSettings as VideoSettingsType,
  };
}

type Props = StateProps & PropertiesChangeProps<VideoElement>;

const VideoSettings: React.FC<Props> = ({ videoSettings, updateParams }) => {
  const { link, autoplay, start, end, loop, rel } = videoSettings;

  const [linkInputValue, setLinkInputValue] = useState(link);
  const [isValidLink, setIsValidLink] = useState(true);

  const handleLinkInputChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (value && !extractPlayerLinkInfo(value).link) {
      setIsValidLink(false);
      setLinkInputValue(value);
    } else {
      setIsValidLink(true);
      setLinkInputValue(value);
      updateParams({ videoSettings: { ...videoSettings, link: value } });
    }
  };

  const handleSwitchChange = () => {
    updateParams({ videoSettings: { ...videoSettings, autoplay: !autoplay } });
  };

  const handleStartInputChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    updateParams({ videoSettings: { ...videoSettings, start: Number(value) } });
  };

  const handleEndInputChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    updateParams({ videoSettings: { ...videoSettings, end: Number(value) } });
  };

  const handleLoopCheckboxChange = ({
    target: { checked },
  }: React.ChangeEvent<HTMLInputElement>) => {
    updateParams({ videoSettings: { ...videoSettings, loop: checked } });
  };

  const handleRelCheckboxChange = ({
    target: { checked },
  }: React.ChangeEvent<HTMLInputElement>) => {
    updateParams({ videoSettings: { ...videoSettings, rel: checked } });
  };

  const isYoutubeVideo = extractPlayerLinkInfo(link).player === 'youtube';

  return (
    <>
      <ControlSection title="Video link">
        <>
          <textarea
            className={cn(
              styles.videoSettingsField,
              !isValidLink && styles.videoSettingsField_withError,
            )}
            name="link"
            value={linkInputValue}
            onChange={handleLinkInputChange}
          />
          {!isValidLink && (
            <p className={styles.videoSettingsErrorText}>
              Enter the URL of another player
            </p>
          )}
        </>
      </ControlSection>
      {isYoutubeVideo && (
        <>
          <ControlSection title="Autoplay">
            <Switch checked={autoplay} onChange={handleSwitchChange} />
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
      )}
    </>
  );
};

export default connect(mapState)(withConfigurableProperties(VideoSettings));
