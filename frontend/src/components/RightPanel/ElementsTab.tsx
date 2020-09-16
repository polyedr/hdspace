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

// const elements = {
//   layout: {
//     grid: { type: 'grid', icon: GridOnIcon },
//     columns: { type: 'columns', icon: ViewColumnIcon },
//   },
//   basic: {
//     button: { type: 'button', icon: SlideshowIcon },
//     list: { type: 'list', icon: ListIcon },
//     divBlock: { type: 'divBlock', icon: Crop169Icon },
//     paragraph: { type: 'paragraph', icon: NotesIcon },
//     heading: { type: 'heading', icon: LineWeightIcon },
//     hyperlink: { type: 'hyperlink', icon: LinkIcon },
//     image: { type: 'image', icon: ImageIcon },
//     video: { type: 'video', icon: MovieIcon },
//     textBlock: { type: 'textBlock', icon: TitleOutlinedIcon },
//     undefined: { type: 'undefined', icon: HelpOutlineIcon },
//   },
//   form: {
//     dropdown: { type: 'dropdown', icon: ArrowDropDownCircleIcon },
//     textinput: { type: 'textinput', icon: MessageIcon },
//     textarea: { type: 'textarea', icon: TextFieldsIcon },
//     checkbox: { type: 'checkbox', icon: CheckBoxIcon },
//     radiobutton: { type: 'radiobutton', icon: RadioButtonCheckedIcon },
//     label: { type: 'label', icon: LabelIcon },
//     select: { type: 'select', icon: TocIcon },
//   },
//   widget: {
//     map: { type: 'map', icon: MapIcon },
//     calendar: { type: 'calendar', icon: CalendarTodayIcon },
//     clock: { type: 'clock', icon: QueryBuilderIcon },
//   },
// } as const;

// const templates: {
//   [key: string]: ElementData | ElementData[];
// } = {
//   pageTemplate: [
//     { type: 'pageTemplate', icon: undefined },
//     { type: 'emptyPageTemplate', icon: undefined },
//   ],
//   screenshot: { type: 'screenshot', icon: CropOriginalIcon },
//   featureSection: { type: 'featureSection', icon: undefined },
// };

// const library = {
//   adeviLibrary: {
//     subscribeForm: { type: 'subscribeForm', icon: undefined },
//     cardsSection: { type: 'cardsSection', icon: undefined },
//   },
//   customUI: {},
// } as const;

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
