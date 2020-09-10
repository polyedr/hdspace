import React from 'react';
import InputIcon from '@material-ui/icons/Input';
import ListIcon from '@material-ui/icons/List';
import Crop169Icon from '@material-ui/icons/Crop169';
import NotesIcon from '@material-ui/icons/Notes';
import LineWeightIcon from '@material-ui/icons/LineWeight';
import LinkIcon from '@material-ui/icons/Link';
import ImageIcon from '@material-ui/icons/Image';
import MovieIcon from '@material-ui/icons/Movie';
import ElementsBlock from './ElementsBlock';

const styles = require('./PropertiesPanel.scss');

const elementsBlocks = {
  layout: {
    pageTemplate: { type: 'pageTemplate', icon: null },
    screenshot: { type: 'screenshot', icon: null },
    subscribeForm: { type: 'subscribeForm', icon: null },
    cardsSection: { type: 'cardsSection', icon: null },
    featureSection: { type: 'featureSection', icon: null },
  },
  basic: {
    button: { type: 'button', icon: InputIcon },
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
    dropdown: { type: 'dropdown', icon: null },
    textinput: { type: 'textinput', icon: null },
    textarea: { type: 'textarea', icon: null },
    checkbox: { type: 'checkbox', icon: null },
    radiobutton: { type: 'radiobutton', icon: null },
    label: { type: 'label', icon: null },
    select: { type: 'select', icon: null },
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
