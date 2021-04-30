import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { FRAMEWORKS_LIST, NOT_SELECTED_FRAMEWORK } from '@Constants/frameworks';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledTextField,
} from '@Components/styledComponents';
import { selectIfCurrentUserHasPermission } from '@Redux/permissions/selectors';
import { Framework, FrameworkName, UserProjectPermission } from '@Src/types';
import {
  selectCurrentScreenId,
  selectCurrentUIFramework,
  selectMasterScreenEnabled,
} from '@Redux/project/selectors/screen';
import {
  editScreenNameAndData,
  updateProjectUIFramework,
} from '@Redux/project/actions';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';

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

const FrameworkSection = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const masterScreenEnabled = useSelector(selectMasterScreenEnabled);
  const currentProjectId = useSelector(selectCurrentProjectId);
  const currentScreenId = useSelector(selectCurrentScreenId);
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
    (newFramework: Framework) => {
      if (masterScreenEnabled) {
        dispatch(updateProjectUIFramework(currentProjectId, newFramework));
      } else {
        dispatch(
          editScreenNameAndData(currentProjectId, currentScreenId, {
            data: {
              uiFramework: newFramework,
            },
          }),
        );
      }
    },
    [currentProjectId, currentScreenId, dispatch, masterScreenEnabled],
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
      const newUIFramework: Framework = {
        name: newFrameworkName,
        version: newFrameworkVersion,
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
      const newUIFramework: Framework = {
        name: frameworkName || NOT_SELECTED_FRAMEWORK.name,
        version: newVersion,
      };
      updateFrameworkData(newUIFramework);
    },
    [currentUIFramework, frameworkName, updateFrameworkData],
  );

  return (
    <StyledAccordion defaultExpanded>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        UI Framework
      </StyledAccordionSummary>

      <StyledAccordionDetails className={classes.details}>
        <div className={classes.selectWrapper}>
          <StyledTextField
            fullWidth
            margin="dense"
            label="Framework"
            select
            disabled={!canEditProject}
            value={
              frameworkName ||
              currentUIFramework?.name ||
              NOT_SELECTED_FRAMEWORK.name
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleFrameworkChange(e.target.value as FrameworkName);
            }}
          >
            {FRAMEWORKS_LIST.map((framework) => (
              <MenuItem key={framework.name} value={framework.name}>
                {framework.label}
              </MenuItem>
            ))}
          </StyledTextField>

          {!!currentUIFramework?.version && (
            <StyledTextField
              fullWidth
              margin="dense"
              label="Version"
              select
              disabled={!canEditProject}
              value={versionName || currentUIFramework.version.name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleVersionChange(event.target.value);
              }}
            >
              {availableVersions.map((version) => (
                <MenuItem key={version.name} value={version.name}>
                  {version.name}
                </MenuItem>
              ))}
            </StyledTextField>
          )}
        </div>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default FrameworkSection;
