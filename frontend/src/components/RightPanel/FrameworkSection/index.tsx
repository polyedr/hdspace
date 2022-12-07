import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import {
  FRAMEWORKS_LIST,
  NOT_SELECTED_FRAMEWORK,
} from '@Constants/frameworks/index';
import {
  PropertyAccordianSummary,
  PropertyAccordion,
  PropertyAccordionDetails,
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledTextField,
} from '@Components/styledComponents';
import { selectIfCurrentUserHasPermission } from '@Redux/permissions/selectors';
import { FrameworkName, UIFramework, UserProjectPermission } from '@Src/types';
import { updateCurrentUIFramework } from '@Redux/project/actions';
import { selectCurrentUIFramework } from '@Redux/project/selectors/base';
import { Typography } from '@mui/material';
import styled from 'styled-components';

const useStyles = makeStyles({
  details: {
    flexDirection: 'column',
  },
  selectWrapper: {
    padding: '0 1em',
  },
  name: {
    textTransrorm: 'capitalize',
  },
});

const CustomTypography = styled(Typography)`
  font-size: '14px';
`;
const FrameworkSection = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const canEditProject = useSelector(
    selectIfCurrentUserHasPermission(UserProjectPermission.CHANGE_PROJECT),
  );
  const currentUIFramework = useSelector(selectCurrentUIFramework);

  const availableVersions = useMemo(() => {
    return currentUIFramework
      ? FRAMEWORKS_LIST.find((fr) => fr.name === currentUIFramework.name)
          ?.versions || []
      : [];
  }, [currentUIFramework]);

  const [frameworkName, setFrameworkName] = useState<FrameworkName | null>(
    currentUIFramework?.name || null,
  );

  const [versionName, setVersionName] = useState<string | null>(
    currentUIFramework?.version?.name || null,
  );

  useEffect(() => {
    const updatedFrName =
      currentUIFramework?.name || NOT_SELECTED_FRAMEWORK.name;
    if (updatedFrName !== frameworkName) {
      setFrameworkName(updatedFrName);
    }
  }, [currentUIFramework?.name, frameworkName]);

  const updateFrameworkData = useCallback(
    (newFramework: UIFramework) => {
      dispatch(updateCurrentUIFramework(newFramework));
    },
    [dispatch],
  );

  const handleFrameworkChange = useCallback(
    (newFrameworkName: FrameworkName) => {
      if (newFrameworkName === frameworkName) {
        return;
      }
      const selectedFramework = FRAMEWORKS_LIST.find(
        (fr) => fr.name === newFrameworkName,
      );
      const newFrameworkVersion = selectedFramework?.versions?.length
        ? selectedFramework.versions[0]
        : null;
      setFrameworkName(newFrameworkName);
      setVersionName(newFrameworkVersion?.name || null);
      const newUIFramework: UIFramework = {
        name: newFrameworkName,
        version: newFrameworkVersion,
        themeVariables: {},
      };
      updateFrameworkData(newUIFramework);
    },
    [frameworkName, updateFrameworkData],
  );

  const handleVersionChange = useCallback(
    (versionName: string) => {
      setVersionName(versionName);
      if (!currentUIFramework) {
        return;
      }
      const selectedFrameworkVersions = FRAMEWORKS_LIST.find(
        (fr) => fr.name === currentUIFramework.name,
      )?.versions;
      const newVersion =
        selectedFrameworkVersions?.find((frV) => frV.name === versionName) ||
        null;
      const newFrameworkName = frameworkName || NOT_SELECTED_FRAMEWORK?.name;
      const newUIFramework: UIFramework = {
        name: newFrameworkName,
        version: newVersion,
        themeVariables: {},
      };
      updateFrameworkData(newUIFramework);
    },
    [currentUIFramework, frameworkName, updateFrameworkData],
  );

  return (
    <PropertyAccordion>
      <PropertyAccordianSummary expandIcon={<ExpandMoreIcon />}>
        {currentUIFramework?.name === NOT_SELECTED_FRAMEWORK?.name
          ? FRAMEWORKS_LIST[0].label
          : currentUIFramework?.name}
      </PropertyAccordianSummary>

      <PropertyAccordionDetails className={classes.details}>
        <div className={classes.selectWrapper}>
          <StyledTextField
            fullWidth
            margin="dense"
            label="Framework"
            select
            InputProps={{ disableUnderline: true }}
            disabled={!canEditProject}
            value={
              frameworkName ||
              currentUIFramework?.name ||
              NOT_SELECTED_FRAMEWORK?.name
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleFrameworkChange(e.target.value as FrameworkName);
            }}
          >
            {FRAMEWORKS_LIST.map((framework) => (
              <MenuItem key={framework.name} value={framework.name}>
                <CustomTypography>{framework.label}</CustomTypography>
              </MenuItem>
            ))}
          </StyledTextField>

          {!!currentUIFramework?.version && (
            <StyledTextField
              fullWidth
              margin="dense"
              label="Version"
              select
              InputProps={{ disableUnderline: true }}
              disabled={!canEditProject}
              value={versionName || currentUIFramework.version.name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleVersionChange(event.target.value);
              }}
            >
              {availableVersions.map((version) => (
                <MenuItem key={version.name} value={version.name}>
                  <CustomTypography>{version.name}</CustomTypography>
                </MenuItem>
              ))}
            </StyledTextField>
          )}
        </div>
      </PropertyAccordionDetails>
    </PropertyAccordion>
  );
};

export default FrameworkSection;
