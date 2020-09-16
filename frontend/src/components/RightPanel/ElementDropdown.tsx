import React from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import withStyles from '@material-ui/core/styles/withStyles';
import { ElementData } from '../../redux/project/types';
import ElementButton from './ElementButton';
import { splitWords } from '../../utils/StringHelper';
import Button from '../UI/Button';

const styles = require('./styles.scss');

const StyledMenuList = withStyles({
  root: {
    padding: 0,
  },
})(MenuList);

const StyledMenuItem = withStyles({
  root: {
    fontSize: '1em',
    textTransform: 'capitalize',
  },
})(MenuItem);

type Props = {
  options: ElementData[];
};

const ElementDropdown: React.FC<Props> = ({ options }) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (anchorRef.current?.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <ButtonGroup
        ref={anchorRef}
        className={styles.elementDropdown}
        orientation="vertical"
      >
        <ElementButton elementData={options[selectedIndex]} />

        <Button onClick={handleToggle} className={styles.dropdownButton}>
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <StyledMenuList className={styles.dropdownList}>
                  {options.map((option, index) => (
                    <StyledMenuItem
                      key={option.type}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {splitWords(option.type)}
                    </StyledMenuItem>
                  ))}
                </StyledMenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export default ElementDropdown;
