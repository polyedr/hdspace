import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import LinkIcon from '@material-ui/icons/Link';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import MenuItem from '@material-ui/core/MenuItem';
import { selectActiveElementParams } from '@Redux/project/selectors/element';
import {
  selectCurrentScreenId,
  selectScreens,
} from '@Redux/project/selectors/screen';

import {
  HyperlinkElement,
  LinkParams,
  PropertiesChangeProps,
} from '@Src/types';
import {
  StyledTextField,
  StyledToggleButton,
} from '@Components/styledComponents';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';

const ActionBlock: React.FC<PropertiesChangeProps<HyperlinkElement>> = ({
  updateParams,
}) => {
  const { action }: { action: LinkParams } = useSelector(
    selectActiveElementParams,
  );
  const screens = useSelector(selectScreens);
  const currentProjectId = useSelector(selectCurrentProjectId);
  const currentScreenId = useSelector(selectCurrentScreenId);

  const [type, setType] = useState(action?.type);
  useEffect(() => {
    setType(action.type);
  }, [action]);

  const [url, setUrl] = useState(action.url);
  useEffect(() => {
    setUrl(action.url);
  }, [action]);

  const debounced = useDebouncedCallback((value) => {
    updateParams({
      action: {
        type: 'external-link',
        url: value,
        screenId: action.screenId,
      },
    });
  }, 500);

  const handleTypeChange = useCallback(
    (
      event: React.MouseEvent<HTMLElement>,
      newType: 'internal-link' | 'external-link',
    ) => {
      if (!newType) {
        return;
      }
      setType(newType);
      updateParams({
        action: {
          type: newType,
          url: action.url,
          screenId: action.screenId,
        },
      });
    },
    [action, updateParams],
  );

  return (
    <div>
      <ToggleButtonGroup
        value={type}
        onChange={handleTypeChange}
        size="small"
        exclusive
      >
        <StyledToggleButton value="internal-link" title="Internal link">
          <LinkIcon />
        </StyledToggleButton>

        <StyledToggleButton value="external-link" title="External link">
          <InsertDriveFileIcon />
        </StyledToggleButton>
      </ToggleButtonGroup>

      <div>
        {type === 'external-link' && (
          <StyledTextField
            fullWidth
            label="URL"
            placeholder="Enter a page URL"
            value={url || ''}
            onChange={({ target: { value } }) => {
              setUrl(value);
              debounced.callback(value);
            }}
            margin="dense"
          />
        )}

        {type === 'internal-link' && (
          <StyledTextField
            fullWidth
            label="Screen Id"
            value={action.screenId || 'noScreen'}
            onChange={({ target: { value } }) => {
              updateParams({
                action: {
                  url: action.url,
                  type: 'internal-link',
                  screenId: value,
                },
              });
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

export default ActionBlock;
