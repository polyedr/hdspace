import React, { memo } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { splitWords } from '@Utils/stringHelper';
import { ElementData } from '@Src/types';
import { ButtonGroup, MenuItem, Menu } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ElementButton from './ElementButton';
import Button from '../../UI/Button';

const useStyles = makeStyles({
  menu: {
    '& ul': {
      fontSize: '1em',
      textTransform: 'capitalize',
      padding: 0,
    },
  },
  menuItem: {
    fontSize: '1em',
  },
  elementDropdown: {
    // width: '33%',
    cursor: 'pointer',
    display: 'flex !important',
    // '& *:first-child': {
    //   borderBottomLeftRadius: 0,
    //   borderBottomRightRadius: 0,
    //   '& span': {
    //     lineHeight: 1.2,
    //   },
    // },
    '& .MuiButton-root': {
      border: 'none',
      paddingTop: 10,

      '&:hover': {
        border: 'none',
      },
    },
  },
  dropdownButton: {
    padding: '0 !important',
    minWidth: 'auto',
    width: 10,
    backgroundColor: 'transparent !important',

    '& svg': {
      fill: '#000 !important',
    },
  },
  dropdownButtonIcon: {
    height: 16,
  },
});

type Props = {
  options: ElementData[];
} & React.ComponentProps<'div'>;

const ElementDropdown: React.FC<Props> = ({ options }) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const classes = useStyles();

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
    <>
      <ButtonGroup
        ref={anchorRef}
        className={classes.elementDropdown}
        onClick={handleToggle}
      >
        <ElementButton elementData={options[selectedIndex]} />

        <Button className={classes.dropdownButton}>
          <ArrowDropDownIcon className={classes.dropdownButtonIcon} />
        </Button>
      </ButtonGroup>

      <Menu
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        className={classes.menu}
      >
        {options.map((option, index) => (
          <MenuItem
            className={classes.menuItem}
            key={option.type}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {splitWords(option.type)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default memo(ElementDropdown);
