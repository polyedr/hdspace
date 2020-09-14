import React, { useState, MouseEvent } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import withStyles from '@material-ui/core/styles/withStyles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { useDispatch, useSelector } from 'react-redux';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '../UI/Button';
import { createElements } from '../../redux/project/actions';
import {
  selectActiveItem,
  selectCurrentScreenId,
} from '../../redux/project/selectors';
import { AVAILABLE_CHILDREN, Entity } from '../../domain/core';
import { splitWords } from '../../utils/StringHelper';

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
    backgroundColor: 'rgb(220,220,220)',
    border: '1px solid rgba(0, 0, 0, .25)',
    '&$expanded': {
      minHeight: 0,
    },
  },
  content: {
    margin: 0,
    textTransform: 'capitalize',
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
    backgroundColor: '#fff',
  },
})(AccordionDetails);

export type ElementData = {
  type: Entity;
  icon: OverridableComponent<SvgIconTypeMap> | null;
};

type Props = {
  title?: string;
  elements: {
    [key: string]: ElementData | ElementData[];
  };
  expandable?: boolean;
};

const ElementsBlock: React.FC<Props> = ({
  title = '',
  elements,
  expandable = false,
}) => {
  const dispatch = useDispatch();
  const screenId = useSelector(selectCurrentScreenId);
  const { itemType: activeItemType } = useSelector(selectActiveItem);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (ev: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(ev.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (type: Entity) => () => {
    dispatch(createElements([{ type }], { screenId }));
  };

  const isAvailableChild = (type: Entity) =>
    activeItemType !== 'none' &&
    (AVAILABLE_CHILDREN[activeItemType].all ||
      type in AVAILABLE_CHILDREN[activeItemType]);

  const renderContent = () =>
    Object.values(elements).map((key) => {
      if (Array.isArray(key)) {
        return (
          <>
            <Button
              onClick={handleOpenMenu}
              className={styles.elementButton}
              disabled={!isAvailableChild(key[0].type)}
            >
              {splitWords(key[0].type)}
            </Button>

            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {key.map((item) => (
                <MenuItem onClick={handleClose} key={item.type}>
                  {splitWords(item.type)}
                </MenuItem>
              ))}
            </Menu>
          </>
        );
      }
      return (
        <Button
          key={key.type}
          disabled={!isAvailableChild(key.type)}
          className={styles.elementButton}
          onClick={handleClick(key.type)}
        >
          {key.icon && <key.icon />}
          {splitWords(key.type)}
        </Button>
      );
    });

  return expandable ? (
    <StyledAccordion defaultExpanded>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        {splitWords(title)}
      </StyledAccordionSummary>

      <StyledAccordionDetails className={styles.elementsBlock}>
        {renderContent()}
      </StyledAccordionDetails>
    </StyledAccordion>
  ) : (
    <div className={styles.elementsBlock}>{renderContent()}</div>
  );
};

export default ElementsBlock;
