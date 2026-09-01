import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Container,
  FormControl,
  MenuItem,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import {
  History as HistoryIcon,
  FilterList as FilterListIcon,
  Cached as CachedIcon,
} from '@mui/icons-material';
import {
  clearHistoryAction,
  requestGetAction,
} from '@Redux/pmtools/activity/actions';
import selectActions from '@Redux/pmtools/activity/selectors';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import {
  StyledAccordionSummary,
  StyledIconButton,
  StyledTextField,
} from '@Components/styledComponents';
import { ActionTypePM, PlatformActionData } from '@Src/types/pmtools/types';
import History from './History';

const useStyles = makeStyles({
  date: {
    color: '#81818E',
    fontSize: 12,
    fontWeight: 400,
  },
  content: {
    marginBottom: '30px',
    height: '550px',
    overflowY: 'auto',
  },
  filter: {
    display: 'flex',
    alignItems: 'flex-start',
    margin: '10px 0',

    '& button': {
      color: '#81818E',
      background: '#F3F4F6',
      boxShadow: 'none',
    },
  },
  accordianRoot: {
    flex: 1,
    margin: 0,
    border: 0,
    boxShadow: 'none',

    '&.Mui-expanded': {
      margin: 0,
    },

    '&:before': {
      display: 'none',
    },
  },
  accordianSummary: {
    minHeight: '36px',
    display: 'inline-flex',

    '&.Mui-expanded': {
      minHeight: '36px',
    },

    '& div': {
      margin: 0,
      padding: 0,
    },
  },
});

function ActivityTab() {
  const dispatch = useDispatch();
  const project = useSelector(selectCurrentProjectId);
  const actions: ActionTypePM[] = useSelector(selectActions);
  const [platform, setPlatform] = useState<PlatformActionData>('ALL');
  const classes = useStyles();

  useEffect(() => {
    dispatch(requestGetAction(project));
  }, [dispatch, project]);

  if (!actions) {
    return <p>Loading... </p>;
  }

  return (
    <Container>
      <StyledAccordionSummary
        expandIcon={
          <StyledIconButton
            size="small"
            title="Project history"
            disabled={!actions.length}
            onClick={() => dispatch(clearHistoryAction(project))}
          >
            <HistoryIcon fontSize="small" />
          </StyledIconButton>
        }
      >
        History
      </StyledAccordionSummary>

      <div className={classes.filter}>
        <Button variant="contained">
          <CachedIcon style={{ marginRight: '5px' }} /> Refresh
        </Button>

        <Accordion className={classes.accordianRoot}>
          <AccordionSummary
            expandIcon={<FilterListIcon />}
            // aria-controls="panel1a-content"
            id="panel1a-header"
            className={classes.accordianSummary}
          />
          <AccordionDetails style={{ display: 'inherit' }}>
            <Typography>
              <FormControl fullWidth style={{ margin: 0 }}>
                <StyledTextField
                  fullWidth
                  margin="dense"
                  label="Platform"
                  select
                  value={platform}
                  onChange={(e: any) => setPlatform(e.target.value)}
                >
                  <MenuItem value="PM-TOOLS">panel</MenuItem>
                  <MenuItem value="MAIN-APP">adevi</MenuItem>
                  <MenuItem value="ALL">all</MenuItem>
                </StyledTextField>
              </FormControl>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>

      {/* <FormControl fullWidth style={{ margin: 0 }}>
        <StyledTextField
          fullWidth
          margin="dense"
          label="Platform"
          select
          value={platform}
          onChange={(e: any) => setPlatform(e.target.value)}
        >
          <MenuItem value="PM-TOOLS">panel</MenuItem>
          <MenuItem value="MAIN-APP">adevi</MenuItem>
          <MenuItem value="ALL">all</MenuItem>
        </StyledTextField>
      </FormControl> */}
      <div className={classes.content}>
        <h3 className={classes.date}>Today, April 04</h3>
        {actions.map((action, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <History key={i} activity={action} platform={platform} />
        ))}
      </div>
    </Container>
  );
}

export default ActivityTab;
