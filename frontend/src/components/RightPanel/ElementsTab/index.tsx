import React, { useState } from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useSelector } from 'react-redux';
import { lighten } from '@material-ui/core';
import ElementsBlock from './ElementsBlock';
import Section from './Section';
import { LIBRARY_ELEMENTS } from '../../../domain/libraryElements/libraryElements';
import { createElementsHierarchy } from '../../../utils/elementsHierarchy';
import CustomElementsBlock from '../CustomElementsLibrary/CustomElementsBlock';
import { selectFreeCanvasMode } from '../../../redux/project/selectors';

const sections = ['elements', 'templates', 'library'];

const useStyles = makeStyles(({ typography, palette }) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  title: {
    fontSize: typography.fontSize,
    fontFamily: typography.fontFamily,
  },
  section: {
    backgroundColor: palette.panel.light,
  },
}));

const useToggleButtonGroupStyles = makeStyles({
  root: {
    width: '100%',
    display: 'flex',
  },
  grouped: {
    flex: 1,
  },
});

const useToggleButtonStyles = makeStyles(({ palette }) => ({
  root: {
    textTransform: 'none',
    '&.Mui-selected': {
      backgroundColor: palette.panel.light,
    },
    '&:hover': {
      backgroundColor: lighten(palette.panel.main, 0.03),
    },
  },
  disabled: {},
  selected: {},
  label: {
    color: palette.common.white,
  },
}));

const ElementsTab = () => {
  const classes = useStyles();
  const toggleButtonGroupClasses = useToggleButtonGroupStyles();
  const toggleButtonClasses = useToggleButtonStyles();
  const isFreeCanvasMode = useSelector(selectFreeCanvasMode);

  const [section, setSection] = useState(sections[0]);

  const { elements, templates, library } = createElementsHierarchy(
    LIBRARY_ELEMENTS,
  );

  const libraryWithCustomUI = {
    ...library,
  };

  const handleChangeSection = (
    ev: React.MouseEvent<HTMLElement>,
    newSection: string,
  ) => {
    if (newSection) {
      setSection(newSection);
    }
  };

  return (
    <div className={classes.root}>
      {isFreeCanvasMode ? (
        <Section title="elements" activeSection={section}>
          {Object.entries(elements).map(([key, value]) => (
            <ElementsBlock key={key} title={key} elements={value} expandable />
          ))}
        </Section>
      ) : (
        <>
          <ToggleButtonGroup
            classes={toggleButtonGroupClasses}
            value={section}
            onChange={handleChangeSection}
            exclusive
            size="small"
          >
            <ToggleButton classes={toggleButtonClasses} value="elements">
              <span className={classes.title}>Elements</span>
            </ToggleButton>

            <ToggleButton classes={toggleButtonClasses} value="templates">
              <span className={classes.title}>Templates</span>
            </ToggleButton>

            <ToggleButton classes={toggleButtonClasses} value="library">
              <span className={classes.title}>Library</span>
            </ToggleButton>
          </ToggleButtonGroup>

          <Section title="elements" activeSection={section}>
            {Object.entries(elements).map(([key, value]) => (
              <ElementsBlock
                key={key}
                title={key}
                elements={value}
                expandable
              />
            ))}
          </Section>

          <Section
            title="templates"
            activeSection={section}
            className={classes.section}
          >
            <ElementsBlock elements={templates} />
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
            <CustomElementsBlock />
          </Section>
        </>
      )}
    </div>
  );
};

export default ElementsTab;
