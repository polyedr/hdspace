import React, { useState } from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ElementsBlock from './ElementsBlock';
import Section from './Section';
import { LIBRARY_ELEMENTS } from '../../domain/libraryElements/libraryElements';
import { createElementsHierarchy } from '../../utils/parseScenario';
import CustomElementsBlock from './CustomElementsLibrary/CustomElementsBlock';

const sections = ['elements', 'templates', 'library'];

const useStyles = makeStyles({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
});

const useToggleButtonGroupStyles = makeStyles({
  root: {
    width: '100%',
    display: 'flex',
  },
  grouped: {
    flex: 1,
  },
});

const useToggleButtonStyles = makeStyles({
  root: {
    textTransform: 'none',
  },
  disabled: {},
  selected: {},
  label: {},
});

const ElementsTab = () => {
  const classes = useStyles();
  const toggleButtonGroupClasses = useToggleButtonGroupStyles();
  const toggleButtonClasses = useToggleButtonStyles();

  const [section, setSection] = useState(sections[0]);

  const libraryElements = LIBRARY_ELEMENTS;

  const { elements, templates, library } = createElementsHierarchy(
    libraryElements,
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
      <ToggleButtonGroup
        classes={toggleButtonGroupClasses}
        value={section}
        onChange={handleChangeSection}
        exclusive
        size="small"
      >
        <ToggleButton classes={toggleButtonClasses} value="elements">
          Elements
        </ToggleButton>

        <ToggleButton classes={toggleButtonClasses} value="templates">
          Templates
        </ToggleButton>

        <ToggleButton classes={toggleButtonClasses} value="library">
          Library
        </ToggleButton>
      </ToggleButtonGroup>

      <Section title="elements" activeSection={section}>
        {Object.entries(elements).map(([key, value]) => (
          <ElementsBlock key={key} title={key} elements={value} expandable />
        ))}
      </Section>

      <Section title="templates" activeSection={section}>
        <ElementsBlock elements={templates} />
      </Section>

      <Section title="library" activeSection={section}>
        {Object.entries(libraryWithCustomUI).map(([key, value]) => (
          <ElementsBlock key={key} title={key} elements={value} expandable />
        ))}
        <CustomElementsBlock />
      </Section>
    </div>
  );
};

export default ElementsTab;
