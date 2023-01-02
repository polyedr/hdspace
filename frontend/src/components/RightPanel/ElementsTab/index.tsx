import React, { memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ToggleButton from '@mui/material/ToggleButton';
import { ToggleButtonGroup, Theme } from '@mui/material';
import { isLibraryTab } from '@Redux/project/actions';
import { makeStyles } from '@mui/styles';
import { LIBRARY_ELEMENTS } from '@Domain/libraryElements/libraryElements';
import { createElementsHierarchy } from '@Utils/elementsHierarchy';
import { selectFreeCanvasMode } from '@Redux/project/selectors/screen';
import styled from 'styled-components';
import CustomElementsBlocks from '../CustomElementsLibrary/CustomElementsBlocks';
import GeneratedElementsBlocks from '../CustomElementsLibrary/GeneratedElementBlocks';
import ElementsBlock from './ElementsBlock';
import ElementGroups from '../ElementGroups';
import Section from './Section';

const sections = ['elements', 'templates', 'library'];

const useStyles = makeStyles<Theme>(({ typography }) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: typography.fontSize,
    fontFamily: typography.fontFamily,
  },
  section: {
    backgroundColor: '#ffffff',
  },
}));

const CustomToggleButtonGroup = styled(ToggleButtonGroup)`
  display: flex;
`;

const CustomToggleButton = styled(ToggleButton)`
  text-transform: none;
  font-size: 80% !important;
  font-weight: 600 !important;
  color: #81818e;
  &.Mui-selected {
    background: #fff;
    border-bottom: 3px solid #5064ff;
  }
`;

const ElementsTab = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isFreeCanvasMode = useSelector(selectFreeCanvasMode);

  const [section, setSection] = useState(sections[0]);

  const { elements, templates, generators, library } =
    createElementsHierarchy(LIBRARY_ELEMENTS);
  const libraryWithCustomUI = {
    ...library,
  };

  const handleChangeSection = (
    ev: React.MouseEvent<HTMLElement>,
    newSection: string,
  ) => {
    if (newSection) {
      setSection(newSection);
      if (newSection === 'library') {
        dispatch(isLibraryTab(true));
      } else {
        dispatch(isLibraryTab(false));
      }
    }
  };

  return (
    <div className={classes.root}>
      {isFreeCanvasMode ? (
        <Section title="elements" activeSection="elements">
          {Object.entries(elements).map(([key, value]) => (
            <ElementsBlock key={key} title={key} elements={value} expandable />
          ))}
        </Section>
      ) : (
        <>
          <CustomToggleButtonGroup
            value={section}
            onChange={handleChangeSection}
            exclusive
            size="small"
          >
            <CustomToggleButton value="elements">Elements</CustomToggleButton>
            <CustomToggleButton value="templates">Templates</CustomToggleButton>
            <CustomToggleButton value="generators">
              Generators
            </CustomToggleButton>
            <CustomToggleButton value="library">Library</CustomToggleButton>
          </CustomToggleButtonGroup>

          <Section title="elements" activeSection={section}>
            {Object.entries(elements).map(([key, value]) => (
              <ElementsBlock
                key={key}
                title={key}
                elements={value}
                expandable
              />
            ))}
            <ElementGroups />
          </Section>
          <Section
            title="templates"
            activeSection={section}
            className={classes.section}
          >
            <ElementsBlock
              key="templates"
              title="templates"
              elements={templates}
              expandable
            />
          </Section>

          <Section
            title="generators"
            activeSection={section}
            className={classes.section}
          >
            <ElementsBlock
              key="generators"
              title="generators"
              elements={generators}
              expandable
            />
            <GeneratedElementsBlocks />
          </Section>

          <Section title="library" activeSection={section}>
            {Object.entries(libraryWithCustomUI).map(([key, value]) => (
              <ElementsBlock
                key={key}
                title={key}
                elements={value}
                expandable
              />
            ))}
            <CustomElementsBlocks />
          </Section>
        </>
      )}
    </div>
  );
};

export default memo(ElementsTab);
