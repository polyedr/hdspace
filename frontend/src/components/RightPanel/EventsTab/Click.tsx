import React, { FC, MouseEvent, useEffect } from 'react';
import ToggleButtonGroup from '@mui/lab/ToggleButtonGroup';
import {
  StyledTextField,
  StyledToggleButton,
} from '@Components/styledComponents';
import {
  InsertDriveFile as InsertDriveFileIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { ElementClickEvent, LinkType } from '@Src/types';
import { useSelector } from 'react-redux';
import {
  selectCurrentScreenId,
  selectSortedScreens,
} from '@Redux/project/selectors/screen';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { MenuItem } from '@mui/material';

type Props = {
  eventData: ElementClickEvent['data'];
  setEventData: React.Dispatch<any>;
};

const Click: FC<Props> = ({ eventData, setEventData }) => {
  const screens = useSelector(selectSortedScreens);
  const currentProjectId = useSelector(selectCurrentProjectId);
  const currentScreenId = useSelector(selectCurrentScreenId);

  const { linkType, url, screenId } = eventData;

  useEffect(() => {
    if (!eventData.linkType) {
      setEventData((prev) => ({
        ...prev,
        linkType: 'internal',
        screenId: 'noScreen',
        url: '',
      }));
    }
  }, [eventData, setEventData]);

  const handleLinkTypeChange = (
    ev: MouseEvent<HTMLElement>,
    newType: LinkType,
  ) => {
    if (!newType) return;
    // setLinkType(newType);
    setEventData((prev) => ({ ...prev, linkType: newType }));
  };

  return (
    <div>
      <ToggleButtonGroup
        value={eventData.linkType || 'internal'}
        onChange={handleLinkTypeChange}
        size="small"
        exclusive
      >
        <StyledToggleButton value="internal" title="Internal">
          <LinkIcon />
        </StyledToggleButton>

        <StyledToggleButton value="external" title="External">
          <InsertDriveFileIcon />
        </StyledToggleButton>
      </ToggleButtonGroup>

      <div>
        {linkType === 'external' && (
          <StyledTextField
            fullWidth
            label="URL"
            placeholder="Enter a page URL"
            value={url || ''}
            onChange={({ target: { value } }) => {
              setEventData((prev) => ({ ...prev, url: value }));
            }}
            margin="dense"
          />
        )}

        {linkType === 'internal' && (
          <StyledTextField
            fullWidth
            label="Screen Id"
            value={screenId || 'noScreen'}
            onChange={({ target: { value } }) => {
              setEventData((prev) => ({ ...prev, screenId: value }));
            }}
            margin="dense"
            select
          >
            <MenuItem value="noScreen" dense>
              No screen
            </MenuItem>

            {screens
              .filter((screen) => screen.id !== currentScreenId)
              .map(({ name, id }) => (
                <MenuItem
                  key={id}
                  value={`/project/${currentProjectId}/${id}`}
                  dense
                >
                  {name}
                </MenuItem>
              ))}
          </StyledTextField>
        )}
      </div>
    </div>
  );
};

export default Click;
