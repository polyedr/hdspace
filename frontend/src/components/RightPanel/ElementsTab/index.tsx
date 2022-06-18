import React, { memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { isLibraryTab } from '@Redux/project/actions';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { LIBRARY_ELEMENTS } from '@Domain/libraryElements/libraryElements';
import { createElementsHierarchy } from '@Utils/elementsHierarchy';
import { selectFreeCanvasMode } from '@Redux/project/selectors/screen';
import CustomElementsBlocks from '../CustomElementsLibrary/CustomElementsBlocks';
import GeneratedElementsBlocks from '../CustomElementsLibrary/GeneratedElementBlocks';
import ElementsBlock from './ElementsBlock';
import ElementGroups from '../ElementGroups';
import Section from './Section';

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
  const dispatch = useDispatch();
  const toggleButtonGroupClasses = useToggleButtonGroupStyles();
  const toggleButtonClasses = useToggleButtonStyles();
  const isFreeCanvasMode = useSelector(selectFreeCanvasMode);

  const [section, setSection] = useState(sections[0]);

  const { elements, templates, generators, library } = createElementsHierarchy(
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

            <ToggleButton classes={toggleButtonClasses} value="generators">
              <span className={classes.title}>Generators</span>
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
            <ElementGroups />
          </Section>

          <Section
            title="templates"
            activeSection={section}
            className={classes.section}
          >
            <ElementsBlock elements={templates} />
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
