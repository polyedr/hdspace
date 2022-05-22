import React, { ReactElement, useRef } from 'react';
import { IconButtonProps, IconButton, SvgIconTypeMap } from '@material-ui/core';
import {
  styled as MuiStyled,
  TextField,
  TextFieldProps,
  AccordionSummary,
  AccordionDetails,
  AccordionDetailsProps,
  AccordionSummaryProps,
} from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { lighten, makeStyles } from '@material-ui/core/styles';
import ToggleButton, { ToggleButtonProps } from '@material-ui/lab/ToggleButton';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import styled from 'styled-components';

const MuiAccordionSummary = styled(AccordionSummary)`
  .MuiAccordionSummary-content {
    font-weight: 600;
    font-size: 10px;
    font-family: 'Roboto', serif;
    color: #81818e;
    text-transform: uppercase;
    margin: 0;
    padding: 0.7em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-grow: 0;
    '&$expanded' {
      margin: 0;
    }
  }
  .Mui-expanded {
    min-height: 0;
  }
  .MuiAccordionSummary-root {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding-left: 0;
    min-height: 0;
    '&$expanded': {
      min-height: 0;
    }
  }

  .MuiAccordionSummary-expandIconWrapper {
    padding: 0.5em;
    color: #81818e;
  }
`;

const CustomTextField = styled(TextField)`
  .MuiTextField-root {
    flex-direction: column-reverse;
  }

  .Mui-focused,
  .Mui-disabled {
    color: #2a2a2d;
  }
  .MuiInput-underline:after {
    border-bottom-color: rgba(80, 100, 255, 0.1);
  }
  .MuiInput-root {
    color: #2a2a2d;
    & .Mui-focused fieldset {
      border-color: rgba(80, 100, 255, 0.1);
    }
    & .MuiSvgIcon-root {
      color: #2a2a2d;
    }
  }
`;

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

const Accordion = MuiStyled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const MuiAccordionDetails = MuiStyled(AccordionDetails)(() => ({
  padding: '3px',
  boxShadow:
    '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
  backgroundColor: '#ffffff',
}));

export const StyledAccordion = React.forwardRef<any, AccordionProps>(
  ({ children, ...props }) => {
    return (
      <Accordion {...props}>{(children as unknown) as ReactElement}</Accordion>
    );
  },
);

export const StyledAccordionSummary: React.FC<AccordionSummaryProps> = ({
  children,
  ...props
}) => {
  return <MuiAccordionSummary {...props}>{children}</MuiAccordionSummary>;
};

export const StyledAccordionDetails = React.forwardRef<
  any,
  AccordionDetailsProps
>(({ children, ...props }, ref) => {
  return (
    <MuiAccordionDetails {...props} ref={ref}>
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
