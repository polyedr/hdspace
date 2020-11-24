import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import LinkIcon from '@material-ui/icons/Link';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
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
import {
  StyledTextField,
  StyledToggleButton,
} from '../../../../styledComponents';

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

  const [state, setState] = useState(getCurrentUrl('external-link'));
  useEffect(() => {
    setState(getCurrentUrl('external-link'));
  }, [getCurrentUrl]);

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
        <StyledToggleButton value="internal-link" title="Internal link">
          <LinkIcon />
        </StyledToggleButton>

        <StyledToggleButton value="external-link" title="External link">
          <InsertDriveFileIcon />
        </StyledToggleButton>
      </ToggleButtonGroup>

      <div>
        {linkType === 'external-link' ? (
          <StyledTextField
            fullWidth
            label="URL"
            placeholder="Enter a page URL"
            value={state}
            onChange={({ target: { value } }) => {
              setState(value);
              debounced.callback(value);
            }}
            margin="dense"
          />
        ) : (
          <StyledTextField
            fullWidth
            label="Screen Id"
            value={getCurrentUrl('internal-link')}
            onChange={handleUrlChange}
            margin="dense"
            select
          >
            <MenuItem value="noScreen" dense>
              No screen
            </MenuItem>

            {screens.map(({ name, id }) => (
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
