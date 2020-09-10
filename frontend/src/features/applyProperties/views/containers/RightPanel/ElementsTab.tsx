import React, { useState } from 'react';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import ListIcon from '@material-ui/icons/List';
import Crop169Icon from '@material-ui/icons/Crop169';
import NotesIcon from '@material-ui/icons/Notes';
import LineWeightIcon from '@material-ui/icons/LineWeight';
import LinkIcon from '@material-ui/icons/Link';
import ImageIcon from '@material-ui/icons/Image';
import MovieIcon from '@material-ui/icons/Movie';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import MessageIcon from '@material-ui/icons/Message';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import LabelIcon from '@material-ui/icons/Label';
import TocIcon from '@material-ui/icons/Toc';
import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import withStyles from '@material-ui/core/styles/withStyles';
import TitleOutlinedIcon from '@material-ui/icons/TitleOutlined';
import ElementsBlock from './ElementsBlock';
import Section from './Section';

const styles = require('./PropertiesPanel.scss');

const sections = ['elements', 'templates', 'library'];

const elementsBlocks = {
  elements: {
    layout: {},
    basic: {
      button: { type: 'button', icon: SlideshowIcon },
      list: { type: 'list', icon: ListIcon },
      divBlock: { type: 'divBlock', icon: Crop169Icon },
      paragraph: { type: 'paragraph', icon: NotesIcon },
      heading: { type: 'heading', icon: LineWeightIcon },
      hyperlink: { type: 'hyperlink', icon: LinkIcon },
      image: { type: 'image', icon: ImageIcon },
      video: { type: 'video', icon: MovieIcon },
      textBlock: { type: 'textBlock', icon: TitleOutlinedIcon },
      // map: 'map',
      // calendar: 'calendar',
      // clock: 'clock',
      // undefined: 'undefined',
    },
    form: {
      dropdown: { type: 'dropdown', icon: ArrowDropDownCircleIcon },
      textinput: { type: 'textinput', icon: MessageIcon },
      textarea: { type: 'textarea', icon: TextFieldsIcon },
      checkbox: { type: 'checkbox', icon: CheckBoxIcon },
      radiobutton: { type: 'radiobutton', icon: RadioButtonCheckedIcon },
      label: { type: 'label', icon: LabelIcon },
      select: { type: 'select', icon: TocIcon },
    },
  },
  templates: {
    pageTemplate: { type: 'pageTemplate', icon: null },
    screenshot: { type: 'screenshot', icon: CropOriginalIcon },
    featureSection: { type: 'featureSection', icon: null },
  },
  library: {
    adeviLibrary: {
      subscribeForm: { type: 'subscribeForm', icon: null },
      cardsSection: { type: 'cardsSection', icon: null },
    },
    customUI: {},
  },
} as const;

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
        {Object.entries(elementsBlocks.elements).map(([key, value]) => (
          <ElementsBlock key={key} title={key} elements={value} expandable />
        ))}
      </Section>

      <Section title="templates" activeSection={section}>
        <ElementsBlock elements={elementsBlocks.templates} />
      </Section>

      <Section title="library" activeSection={section}>
        {Object.entries(elementsBlocks.library).map(([key, value]) => (
          <ElementsBlock key={key} title={key} elements={value} expandable />
        ))}
      </Section>
    </div>
  );
};

export default ElementsTab;
