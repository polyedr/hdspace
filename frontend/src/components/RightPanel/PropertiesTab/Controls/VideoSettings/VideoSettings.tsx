import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Checkbox, FormControlLabel, Switch } from '@mui/material';
import { selectActiveElementParamByName } from '@Redux/project/selectors/element';
import { extractPlayerLinkInfo } from '@Utils/extractVideoLink';
import { PropertiesChangeProps, VideoElement } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import { makeStyles } from '@mui/styles';
import { useDebouncedInputChange } from '@Utils/debounceHooks';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  text: {
    width: 70,
  },
});

const VideoSettings: React.FC<PropertiesChangeProps<VideoElement>> = ({
  updateParams,
  canEdit,
}) => {
  const classes = useStyles();
  const videoSettings =
    useSelector(selectActiveElementParamByName('videoSettings')) || {};
  const { link, autoplay, start, end, loop, rel } = videoSettings;

  const [isValidLink, setIsValidLink] = useState(true);

  const handleLinkInputChange = (value: string) => {
    if (value && !extractPlayerLinkInfo(value).link) {
      setIsValidLink(false);
    } else {
      setIsValidLink(true);
      updateParams({ videoSettings: { ...videoSettings, link: value } });
    }
  };

  const [linkInputValue, handleChangeLinkInputValue] = useDebouncedInputChange(
    link,
    handleLinkInputChange,
    300,
  );

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
        <StyledTextField
          variant="outlined"
          value={linkInputValue}
          onChange={handleChangeLinkInputValue}
          label="Link"
          margin="dense"
          fullWidth
          multiline
          disabled={!canEdit}
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
                  disabled={!canEdit}
                />
              }
              label="Loop"
            />
          </div>

          <div className={classes.wrapper}>
            <StyledTextField
              value={start || 0}
              onChange={handleStartInputChange}
              type="number"
              label="Start"
              margin="dense"
              className={classes.text}
              disabled={!canEdit}
            />

            <StyledTextField
              value={end || 0}
              type="number"
              onChange={handleEndInputChange}
              label="End"
              margin="dense"
              className={classes.text}
              disabled={!canEdit}
            />
          </div>

          <FormControlLabel
            control={
              <Checkbox
                value="show related videos"
                name="show related videos"
                checked={rel}
                onChange={handleRelCheckboxChange}
                disabled={!canEdit}
              />
            }
            label="Show only channel related videos"
          />
        </>
      )}
    </div>
  );
};

export default VideoSettings;
