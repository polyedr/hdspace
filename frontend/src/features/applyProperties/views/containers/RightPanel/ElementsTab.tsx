import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import withStyles from '@material-ui/core/styles/withStyles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NotesIcon from '@material-ui/icons/Notes';
import ListIcon from '@material-ui/icons/List';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import LinkIcon from '@material-ui/icons/Link';
import ImageIcon from '@material-ui/icons/Image';
import Button from '../../../../../components/UI/Button';

const styles = require('./PropertiesPanel.scss');

const StyledAccordion = withStyles({
  root: {
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(Accordion);

const StyledAccordionSummary = withStyles({
  root: {
    minHeight: 0,
    backgroundColor: 'rgba(0, 0, 0, .15)',
    border: '1px solid rgba(0, 0, 0, .25)',
    '&$expanded': {
      minHeight: 0,
    },
  },
  content: {
    margin: 0,
    '&$expanded': {
      margin: 0,
    },
  },
  expanded: {
    minHeight: 0,
  },
  expandIcon: {
    padding: '0',
    margin: '0 1em',
    color: '#1cc09f',
  },
})(AccordionSummary);

const StyledAccordionDetails = withStyles({
  root: {
    padding: 0,
  },
})(AccordionDetails);

const ElementsTab = () => {
  return (
    <>
      <section className={styles.section}>
        <h3 className={styles.sectionHeader}>Elements</h3>

        <StyledAccordion defaultExpanded>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
            Layout
          </StyledAccordionSummary>

          <StyledAccordionDetails className={styles.block}>
            <Button className={styles.elementButton}>1</Button>
            <Button className={styles.elementButton}>2</Button>
            <Button className={styles.elementButton}>3</Button>
          </StyledAccordionDetails>
        </StyledAccordion>

        <StyledAccordion defaultExpanded>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
            Basic
          </StyledAccordionSummary>

          <StyledAccordionDetails className={styles.block}>
            <Button className={styles.elementButton}>Button</Button>

            <Button className={styles.elementButton}>
              <ListIcon />
              List
            </Button>

            <Button className={styles.elementButton}>
              <CheckBoxOutlineBlankIcon />
              Div
            </Button>

            <Button className={styles.elementButton}>
              <NotesIcon />
              Paragraph
            </Button>

            <Button className={styles.elementButton}>Heading</Button>

            <Button className={styles.elementButton}>
              <LinkIcon />
              Anchor
            </Button>

            <Button className={styles.elementButton}>
              <ImageIcon />
              Image
            </Button>

            <Button className={styles.elementButton}>Video</Button>
          </StyledAccordionDetails>
        </StyledAccordion>

        <StyledAccordion defaultExpanded>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
            Form
          </StyledAccordionSummary>

          <StyledAccordionDetails className={styles.block}>
            <Button className={styles.elementButton}>1</Button>
            <Button className={styles.elementButton}>2</Button>
            <Button className={styles.elementButton}>3</Button>
            <Button className={styles.elementButton}>4</Button>
            <Button className={styles.elementButton}>5</Button>
            <Button className={styles.elementButton}>6</Button>
            <Button className={styles.elementButton}>7</Button>
          </StyledAccordionDetails>
        </StyledAccordion>
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
