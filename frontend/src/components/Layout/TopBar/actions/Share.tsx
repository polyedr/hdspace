import React, { FC, useState, useCallback } from 'react';
import ShareIcon from '@mui/icons-material/Share';
import { Button, Popover, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ToggleButton from '@mui/material/ToggleButton';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { enqueueSnackbar } from '@Redux/notification/actions';
import {
  selectUserData,
  selectProjectViewTokenPair,
} from '@Redux/user/selectors';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';

import { setProjectViewStart } from '@Redux/user/actions';
import { shorten_url_api_key } from '@Constants/defaultParams';
import * as Actions from '@Redux/permissions/actions';

const useStyles = makeStyles({
  popup: {
    padding: '1em',
    display: 'flex',
    flexDirection: 'column',
  },
  icon: {
    height: '16px',
  },
  togglebutton: {
    '&.MuiToggleButton-root': {
      width: '32px',
      height: '32px',
      border: 'none',
      borderRadius: '50%',
      color: '#81818E',

      '& svg': {
        height: '20px',
      },
    },
    '&.Mui-selected': {
      color: '#000  !important',
    },
  },
});

interface Props {
  className?: string;
}

const Share: FC<Props> = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector(selectUserData);
  const projectId = useSelector(selectCurrentProjectId);
  const screenId = useSelector(selectCurrentScreenId);
  const viewToken = useSelector(selectProjectViewTokenPair);
  localStorage.setItem('viewToken', JSON.stringify(viewToken));
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const handleClick = (ev: {
    currentTarget: React.SetStateAction<HTMLElement | null>;
  }) => {
    setAnchor(ev.currentTarget);
    dispatch(setProjectViewStart());
    dispatch(Actions.getUsersList());
  };

  const handleClose = () => {
    setAnchor(null);
  };
  const open = Boolean(anchor);

  const handleCopyLink = useCallback(
    (includeElement = false) => {
      const { origin } = window.location;
      const token = localStorage.getItem('viewToken');
      let jsonToken;
      if (typeof token === 'string') {
        jsonToken = JSON.parse(token);
      }
      const data = {
        user: user.id,
        pmap: 'edit',
        project_id: projectId,
      };
      axios
        .post(
          'https://api-staging.adevi.info/api/v1/accounts/sharedlinks/',
          data,
          {
            headers: {
              Authorization: `Bearer ${jsonToken.access}`,
            },
          },
        )
        .then((response) => {
          const url = `${origin}/share/${response.data.project_id}/${screenId}/${response.data.shortuuid_token}`;
          // navigator.clipboard.writeText(url);
          axios
            .post('https://api.apilayer.com/short_url/hash', url, {
              headers: {
                apikey: shorten_url_api_key,
              },
            })
            .then(
              async (response) =>
                await navigator.clipboard.writeText(response.data.short_url),
            );
        });
      handleClose();
      if (includeElement) {
        dispatch(
          enqueueSnackbar({
            message: 'Element link was successfully copied to the clipboard',
            options: {
              variant: 'success',
            },
          }),
        );
      } else {
        dispatch(
          enqueueSnackbar({
            message: 'Screen link was successfully copied to the clipboard',
            options: {
              variant: 'success',
            },
          }),
        );
      }
    },
    [dispatch, projectId, screenId, user.id],
  );

  return (
    <>
      <ToggleButton
        value="Share"
        title="Share"
        selected={open}
        className={classes.togglebutton}
        onClick={handleClick}
      >
        <ShareIcon className={classes.icon} />
      </ToggleButton>

      <Popover
        open={open}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Container maxWidth="xs" className={classes.popup}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleCopyLink()}
          >
            Copy screen link
          </Button>
        </Container>
      </Popover>
    </>
  );
};

export default Share;
