import React, { useMemo } from 'react';
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
import { FrameworkName, UserProjectPermission } from '@Src/types';
import {
  selectCurrentScreenId,
  selectCurrentUIFramework,
} from '@Redux/project/selectors/screen';
import { editScreenNameAndData } from '@Redux/project/actions';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { useDebouncedInputChange } from '@Utils/debounceHooks';

const useStyles = makeStyles({
  details: {
    flexDirection: 'column',
  },
  select: {
    padding: '0 1em',
  },
});

const FrameworkSection = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
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

  const [
    selectedFrameworkName,
    handleSelectFramework,
  ] = useDebouncedInputChange(
    (
      FRAMEWORKS_LIST.find(
        (fr) => currentUIFramework && fr.name === currentUIFramework.name,
      ) || NOT_SELECTED_FRAMEWORK
    ).name,
    (newFrameworkName: FrameworkName) => {
      const selectedFramework = FRAMEWORKS_LIST.find(
        (fr) => fr.name === newFrameworkName,
      );
      const frameworkVersions = selectedFramework?.versions || [];
      dispatch(
        editScreenNameAndData(currentProjectId, currentScreenId, {
          data: {
            uiFramework: !selectedFrameworkName
              ? NOT_SELECTED_FRAMEWORK
              : {
                  name: newFrameworkName,
                  version: frameworkVersions.length
                    ? frameworkVersions[0]
                    : null,
                },
          },
        }),
      );
    },
  );

  const [selectedVersionName, handleSelectVersion] = useDebouncedInputChange(
    (currentUIFramework || NOT_SELECTED_FRAMEWORK).version?.name || '',
    (selectedVersion: string) => {
      const frameworkVersions =
        FRAMEWORKS_LIST.find(
          (fr) => currentUIFramework && fr.name === currentUIFramework.name,
        )?.versions || [];
      dispatch(
        editScreenNameAndData(currentProjectId, currentScreenId, {
          data: {
            uiFramework: {
              name: selectedFrameworkName,
              version:
                frameworkVersions.find((frV) => frV.name === selectedVersion) ||
                null,
            },
          },
        }),
      );
    },
  );

  return (
    <StyledAccordion defaultExpanded>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        UI Framework
      </StyledAccordionSummary>

      <StyledAccordionDetails className={classes.details}>
        <div>
          <StyledTextField
            className={classes.select}
            fullWidth
            margin="dense"
            label="Framework"
            select
            disabled={!canEditProject}
            value={selectedFrameworkName}
            onChange={handleSelectFramework}
          >
            {FRAMEWORKS_LIST.map((framework) => (
              <MenuItem key={framework.name} value={framework.name}>
                {framework.name}
              </MenuItem>
            ))}
          </StyledTextField>
        </div>

        {!!currentUIFramework?.version && (
          <div>
            <StyledTextField
              className={classes.select}
              fullWidth
              margin="dense"
              label="Version"
              select
              disabled={!canEditProject}
              value={selectedVersionName}
              onChange={handleSelectVersion}
            >
              {availableVersions.map((version) => (
                <MenuItem key={version.name} value={version.name}>
                  {version.name}
                </MenuItem>
              ))}
            </StyledTextField>
          </div>
        )}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default FrameworkSection;
