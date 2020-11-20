import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import LinkIcon from '@material-ui/icons/Link';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useDebouncedCallback } from 'use-debounce';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import {
  selectActiveElementParams,
  selectScreens,
} from '../../../../../redux/project/selectors';
import {
  ExternalLink,
  HyperlinkElement,
  InternalLink,
  LinkParams,
  PropertiesChangeProps,
} from '../../../../../types';

const ActionBlock: React.FC<PropertiesChangeProps<HyperlinkElement>> = ({
  updateParams,
}) => {
  const { action }: { action: LinkParams } = useSelector(
    selectActiveElementParams,
  );
  const screens = useSelector(selectScreens);

  const [linkType, setLinkType] = useState(action?.type);

  const getCurrentUrl = React.useCallback(
    (currentType: InternalLink['type'] | ExternalLink['type']): string => {
      return (
        (action &&
          currentType === action.type &&
          (action.type === 'external-link'
            ? action.url
            : String(action.screenID))) ||
        ''
      );
    },
    [action],
  );

  const debounced = useDebouncedCallback((value) => {
    updateParams({
      action: {
        type: 'external-link',
        url: value,
      },
    });
  }, 500);

  const handleUrlChange = (ev) => {
    const { value } = ev.target;
    updateParams({
      action: {
        type: 'internal-link',
        screenID: value === 'noScreen' ? value : +value,
      },
    });
  };

  const handleLinkTypeChange = (
    ev: React.MouseEvent<HTMLElement>,
    newLinkType: 'internal-link' | 'external-link',
  ) => {
    if (!newLinkType) return;
    setLinkType(newLinkType);
  };

  return (
    <div>
      <ToggleButtonGroup
        value={linkType}
        onChange={handleLinkTypeChange}
        size="small"
        exclusive
      >
        <ToggleButton value="internal-link" title="Internal link">
          <LinkIcon />
        </ToggleButton>

        <ToggleButton value="external-link" title="External link">
          <InsertDriveFileIcon />
        </ToggleButton>
      </ToggleButtonGroup>

      <div>
        {linkType === 'external-link' ? (
          <TextField
            fullWidth
            label="URL"
            placeholder="Enter a page URL"
            defaultValue={getCurrentUrl('external-link')}
            onChange={(e) => debounced.callback(e.target.value)}
            margin="dense"
          />
        ) : (
          <FormControl margin="dense" fullWidth>
            <InputLabel>Screen Id</InputLabel>

            <Select
              label="Screen Id"
              value={getCurrentUrl('internal-link')}
              onChange={handleUrlChange}
            >
              <MenuItem value="noScreen" dense>
                No screen
              </MenuItem>

              {screens.map(({ name, id }) => (
                <MenuItem key={id} value={id} dense>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
    </div>
  );
};

export default withConfigurableProperties(ActionBlock);
