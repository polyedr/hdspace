import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Checkbox } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Switch from '../../../../UI/Switch/Switch';
import { AppReduxState } from '../../../../../shared/types/app';
import { VideoElement, VideoSettingsType } from '../../../../../api/types';
import { selectActiveElementParams } from '../../../../../redux/project/selectors';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../utils/withConfigurableProperties';
import { extractPlayerLinkInfo } from '../../../../../utils/extractVideoLink';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  text: {
    width: 70,
  },
});

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
  const classes = useStyles();
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
        <TextField
          variant="outlined"
          value={linkInputValue}
          onChange={handleLinkInputChange}
          label="Link"
          margin="dense"
          fullWidth
          multiline
        />

        {!isValidLink && <p>Enter the URL of another player</p>}
      </div>

      {isYoutubeVideo && (
        <>
          <div className={classes.wrapper}>
            <FormControlLabel
              control={
                <Switch checked={autoplay} onChange={handleSwitchChange} />
              }
              label="Autoplay"
            />

            <FormControlLabel
              control={
                <Checkbox
                  value="loop"
                  name="loop"
                  checked={loop}
                  onChange={handleLoopCheckboxChange}
                />
              }
              label="Loop"
            />
          </div>

          <div className={classes.wrapper}>
            <TextField
              value={start}
              onChange={handleStartInputChange}
              type="number"
              label="Start"
              margin="dense"
              className={classes.text}
            />

            <TextField
              value={end}
              type="number"
              onChange={handleEndInputChange}
              label="End"
              margin="dense"
              className={classes.text}
            />
          </div>

          <FormControlLabel
            control={
              <Checkbox
                value="show related videos"
                name="show related videos"
                checked={rel}
                onChange={handleRelCheckboxChange}
              />
            }
            label="Show only channel related videos"
          />
        </>
      )}
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(VideoSettings));
