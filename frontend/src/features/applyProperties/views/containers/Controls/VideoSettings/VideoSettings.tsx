import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Checkbox } from '@material-ui/core';
import Switch from '../../../../../../components/UI/Switch/Switch';
import { AppReduxState } from '../../../../../../shared/types/app';
import { VideoElement, VideoSettingsType } from '../../../../../../api/types';
import { selectActiveElementParams } from '../../../../../../redux/project/selectors';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { extractPlayerLinkInfo } from '../../../../../../utils/extractVideoLink';

type StateProps = {
  videoSettings: VideoSettingsType;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);

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
    <div>
      <div>
        <h4>Video link</h4>

        <textarea
          name="link"
          value={linkInputValue}
          onChange={handleLinkInputChange}
        />

        {!isValidLink && <p>Enter the URL of another player</p>}
      </div>

      {isYoutubeVideo && (
        <>
          <div>
            <h4>Autoplay</h4>

            <Switch checked={autoplay} onChange={handleSwitchChange} />
          </div>

          <div>
            <h4>Start at</h4>

            <input
              name="start"
              type="number"
              value={start}
              onChange={handleStartInputChange}
              min={0}
            />
          </div>

          <div>
            <h4>End at</h4>

            <input
              name="end"
              type="number"
              value={end}
              onChange={handleEndInputChange}
              min={0}
            />
          </div>

          <div>
            <h4>Loop</h4>

            <Checkbox
              value="loop"
              name="loop"
              checked={loop}
              onChange={handleLoopCheckboxChange}
            />
          </div>

          <div>
            <h4>Show only channel related videos</h4>

            <Checkbox
              value="show related videos"
              name="show related videos"
              checked={rel}
              onChange={handleRelCheckboxChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(VideoSettings));
