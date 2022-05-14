import React, { useRef } from 'react';
import { AccordionProps } from '@material-ui/core/Accordion';
import {
  AccordionDetailsProps,
  AccordionSummaryProps,
  IconButtonProps,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  IconButton,
  SvgIconTypeMap,
} from '@material-ui/core';
import { styled, TextField, TextFieldProps } from '@mui/material';
import {
  createStyles,
  lighten,
  makeStyles,
  darken,
} from '@material-ui/core/styles';
import ToggleButton, { ToggleButtonProps } from '@material-ui/lab/ToggleButton';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const useAccordionStyles = makeStyles(({ palette }) => ({
  root: {
    color: palette.common.white,
    fontWeight: 'normal',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    '&$expanded': {
      margin: 0,
    },
  },
  expanded: {},
}));

const useAccordionSummaryStyles = makeStyles(({ palette }) => ({
  root: {
    paddingLeft: 0,
    minHeight: 0,
    '&$expanded': {
      minHeight: 0,
    },
    borderBottom: `1px solid ${darken(palette.panel.dark, 0.1)}`,
    borderTop: `1px solid ${darken(palette.panel.dark, 0.1)}`,
    backgroundColor: darken(palette.panel.main, 0.1),
    fontWeight: 600,
  },
  content: {
    margin: 0,
    padding: '.7em',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '&$expanded': {
      margin: 0,
    },
  },
  expanded: {
    minHeight: 0,
  },
  expandIcon: {
    padding: '.5em',
    color: '#eee',
  },
}));

const useAccordionDetailsStyles = makeStyles(({ palette }) =>
  createStyles({
    root: {
      padding: 0,
      backgroundColor: palette.panel.light,
      boxShadow:
        '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    },
  }),
);

const CustomTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '& label, & label.Mui-focused, & label.Mui-disabled': {
    color: theme.palette.grey.A200,
  },
  /* '& 	.MuiSelect-select': {
    color: theme.palette.common.white,
    '& .MuiSelect-standard': {
      '&.Mui-disabled': {
        color: theme.palette.grey.A200,
      },
      '&:before, &:hover:before': {
        borderBottomColor: theme.palette.grey.A200,
      },
      '& fieldset, &:hover fieldset': {
        borderColor: theme.palette.grey.A200,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.grey.A200,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.grey.A200,
      },
      '& .MuiSvgIcon-root': {
        color: theme.palette.grey.A200,
      },
    },
  }, */
  '& .MuiInput-underline:after': {
    borderBottomColor: theme.palette.grey.A200,
  },
  '& .MuiOutlinedInput-root, & .MuiInput-root': {
    color: theme.palette.common.white,

    '&.Mui-disabled': {
      color: theme.palette.grey.A200,
    },
    '&:before, &:hover:before': {
      borderBottomColor: theme.palette.grey.A200,
    },
    '& fieldset, &:hover fieldset': {
      borderColor: theme.palette.grey.A200,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.grey.A200,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.grey.A200,
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.grey.A200,
    },
  },
}));

const useToggleButtonStyles = makeStyles(({ palette }) => ({
  root: {
    '&:hover': {
      backgroundColor: lighten(palette.panel.light, 0.1),
      borderLeftColor: palette.grey.A200,
    },
    color: palette.common.white,
    borderColor: palette.grey.A200,
    '&.Mui-selected': {
      '&:hover': {
        backgroundColor: lighten(palette.panel.light, 0.1),
        borderLeftColor: palette.grey.A200,
      },
      color: palette.common.white,
      backgroundColor: lighten(palette.panel.light, 0.2),
      borderLeftColor: palette.grey.A200,
    },
  },
  disabled: {
    color: palette.grey.A200,
  },
  label: {
    color: palette.grey.A200,
  },
}));

const useIconButtonClasses = makeStyles(({ palette }) => ({
  iconButton: {
    color: palette.common.white,
    '&:hover': {
      backgroundColor: lighten(palette.panel.main, 0.1),
    },
  },
}));

export const StyledAccordion: React.FC<AccordionProps> = ({
  children,
  ...props
}) => {
  const classes = useAccordionStyles();
  return (
    <MuiAccordion classes={classes} {...props}>
      {children}
    </MuiAccordion>
  );
};

export const StyledAccordionSummary: React.FC<AccordionSummaryProps> = ({
  children,
  ...props
}) => {
  const classes = useAccordionSummaryStyles();
  return (
    <MuiAccordionSummary classes={classes} {...props}>
      {children}
    </MuiAccordionSummary>
  );
};

export const StyledAccordionDetails = React.forwardRef<
  any,
  AccordionDetailsProps
>(({ children, ...props }, ref) => {
  const classes = useAccordionDetailsStyles();
  return (
    <MuiAccordionDetails classes={classes} {...props} ref={ref}>
      {children}
    </MuiAccordionDetails>
  );
});

export const StyledTextField: React.FC<TextFieldProps> = (props) => {
  const { select } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <CustomTextField
      {...(!select
        ? {
            inputRef,
            onFocus: () => inputRef.current?.select(),
          }
        : {
            SelectProps: {
              IconComponent: KeyboardArrowDownIcon,
            },
          })}
      variant="standard"
      {...props}
    />
  );
};

export const PanelTextField: React.FC<
  TextFieldProps & { styledColor?: string }
> = (props) => {
  const { styledColor } = props;

  return (
    <CustomTextField
      margin="dense"
      fullWidth
      InputProps={{
        style: { color: styledColor || '#fff' },
      }}
      {...props}
    />
  );
};

export const StyledToggleButton: React.FC<ToggleButtonProps> = (props) => {
  const classes = useToggleButtonStyles();
  return <ToggleButton classes={classes} {...props} />;
};

export const StyledIconButton: React.FC<IconButtonProps> = ({
  children,
  ...props
}) => {
  const classes = useIconButtonClasses();
  return (
    <IconButton className={classes.iconButton} {...props}>
      {children}
    </IconButton>
  );
};

export const TabPanel: React.FC<{
  index: number;
  value: number;
  panelClass?: string;
}> = ({ children, value, index, panelClass }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    className={panelClass}
  >
    {children}
  </div>
);

export type IconType = OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;

export interface SideBarTitleAction {
  callback: () => void;
  icon: IconType | any;
  title?: string;
}
