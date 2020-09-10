import React from 'react';
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
import ElementsBlock from './ElementsBlock';

const styles = require('./PropertiesPanel.scss');

const elementsBlocks = {
  layout: {
    pageTemplate: { type: 'pageTemplate', icon: null },
    screenshot: { type: 'screenshot', icon: CropOriginalIcon },
    subscribeForm: { type: 'subscribeForm', icon: null },
    cardsSection: { type: 'cardsSection', icon: null },
    featureSection: { type: 'featureSection', icon: null },
  },
  basic: {
    button: { type: 'button', icon: SlideshowIcon },
    list: { type: 'list', icon: ListIcon },
    divBlock: { type: 'divBlock', icon: Crop169Icon },
    paragraph: { type: 'paragraph', icon: NotesIcon },
    heading: { type: 'heading', icon: LineWeightIcon },
    hyperlink: { type: 'hyperlink', icon: LinkIcon },
    image: { type: 'image', icon: ImageIcon },
    video: { type: 'video', icon: MovieIcon },
    // textBlock: { type: 'textBlock', icon: null },
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
} as const;

const ElementsTab = () => {
  return (
    <>
      <section className={styles.section}>
        <h3 className={styles.sectionHeader}>Elements</h3>

        {Object.entries(elementsBlocks).map(([key, value]) => (
          <ElementsBlock key={key} title={key} elements={value} />
        ))}
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionHeader}>Templates</h3>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionHeader}>Library</h3>
      </section>
    </>
  );
};

export default ElementsTab;
