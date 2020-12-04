import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import LinkIcon from '@material-ui/icons/Link';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import MenuItem from '@material-ui/core/MenuItem';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { selectActiveElementParams } from '@Redux/project/selectors/element';
import {
  selectCurrentScreenId,
  selectScreens,
} from '@Redux/project/selectors/screen';

import {
  HyperlinkElement,
  LinkParams,
  PropertiesChangeProps,
  Screen,
} from '@Src/types';
import {
  StyledTextField,
  StyledToggleButton,
} from '@Components/styledComponents';

type StateProps = {
  screens: Screen[];
  action: LinkParams;
};

const ActionBlock: React.FC<PropertiesChangeProps<HyperlinkElement>> = ({
  updateParams,
}) => {
  const { action }: { action: LinkParams } = useSelector(
    selectActiveElementParams,
  );
  const screens = useSelector(selectScreens);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const [type, setType] = useState(action?.type);

  const debounced = useDebouncedCallback((value) => {
    updateParams({
      action: {
        type: 'external-link',
        url: value,
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
    },
    [],
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
            defaultValue={action?.url}
            onChange={({ target: { value } }) => {
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
                  type: 'internal-link',
                  screenId:
                    value === 'noScreen' ? value : parseInt(value as string),
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
                <MenuItem key={id} value={id} dense>
                  {name}
                </MenuItem>
              ))}
          </StyledTextField>
        )}
      </div>
    </div>
  );
};

export default withConfigurableProperties(ActionBlock);
