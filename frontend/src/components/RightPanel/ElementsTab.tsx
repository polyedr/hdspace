import React, { useState } from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import withStyles from '@material-ui/core/styles/withStyles';
import { useSelector } from 'react-redux';
import ElementsBlock from './ElementsBlock';
import Section from './Section';
import { LIBRARY_ELEMENTS } from '../../domain/libraryElements/libraryElements';
import { selectCustomLibraryElements } from '../../redux/project/selectors';
import {
  createCustomElementsHierarchy,
  createElementsHierarchy,
} from '../../utils/parseScenario';

const styles = require('./styles.scss');

const sections = ['elements', 'templates', 'library'];

const StyledToggleButtonGroup = withStyles({
  root: {
    width: '100%',
    display: 'flex',
  },
  grouped: {
    flex: 1,
    '&:not(:first-child)': {},
    '&:first-child': {},
  },
})(ToggleButtonGroup);

const StyledToggleButton = withStyles({
  root: {
    textTransform: 'none',
    '&$selected': {
      backgroundColor: '#fff',
      '&:hover': {
        backgroundColor: '#fff',
        color: '#1cc09f',
      },
    },
  },
  disabled: {},
  selected: {
    backgroundColor: '#fff',
  },
  label: {},
})(ToggleButton);

const ElementsTab = () => {
  const [section, setSection] = useState(sections[0]);

  const libraryElements = LIBRARY_ELEMENTS;
  const customElements = useSelector(selectCustomLibraryElements);

  const { elements, templates, library } = createElementsHierarchy(
    libraryElements,
  );

  const libraryWithCustomUI = {
    ...library,
    ...createCustomElementsHierarchy(customElements),
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
    <div className={styles.elementsTab}>
      <StyledToggleButtonGroup
        value={section}
        onChange={handleChangeSection}
        exclusive
        size="small"
      >
        <StyledToggleButton value="elements">Elements</StyledToggleButton>

        <StyledToggleButton value="templates">Templates</StyledToggleButton>

        <StyledToggleButton value="library">Library</StyledToggleButton>
      </StyledToggleButtonGroup>

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
      </Section>
    </div>
  );
};

export default ElementsTab;
