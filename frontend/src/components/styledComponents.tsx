import React, { ReactElement, useRef } from 'react';
import {
  IconButtonProps,
  IconButton,
  SvgIconTypeMap,
  styled as MuiStyled,
  TextField,
  TextFieldProps,
  AccordionSummary,
  AccordionDetails,
  AccordionDetailsProps,
  AccordionSummaryProps,
  ToggleButtonGroupProps,
  ToggleButtonGroup,
  ToggleButtonProps,
  Slider,
  SliderProps,
} from '@mui/material';

import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import ToggleButton from '@mui/material/ToggleButton';
import { makeStyles } from '@mui/styles';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styled from 'styled-components';

export const PropertyAccordianSummary = MuiStyled(AccordionSummary)({
  flexDirection: 'row-reverse',

  '&.MuiAccordionSummary-root': {
    minHeight: 32,
    backgroundColor: '#F3F4F6',
    padding: '0 5px',
  },

  '& .MuiAccordionSummary-content': {
    margin: 0,
    fontSize: 10,
    textTransform: 'uppercase',
    padding: '0 2px',
    fontWeight: 600,

    '&.Mui-expanded': {
      margin: 0,
    },

    '& svg': {
      height: 15,
    },
  },
});

export const PropertyAccordion = styled(MuiAccordion)({
  '&.MuiAccordion-root': {
    boxShadow: 'none',
    margin: '0 !important',
    borderBottom: '1px solid #E4E6EB',
    borderRadius: 0,
    // paddingBottom: 10,

    '&:before': {
      display: 'none',
    },
  },

  '& .MuiAccordionDetails-root': {
    padding: '8px 10px 16px',
  },
});

export const PropertyAccordionDetails = styled(AccordionDetails)({
  // '&.MuiAccordionDetails-root': {
  //   display: 'flex',
  //   flexFlow: 'row wrap',
  //   padding: '0',
  //   justifyContent: 'space-between',
  //   '& .MuiButton-text ': {
  //     width: '33%',
  //     minHeight: '65px',
  //     paddingTop: '8px',
  //     '& svg': {
  //       height: 20,
  //     },
  //     '& span': {
  //       fontSize: 11,
  //       color: '#81818E',
  //       fontWeight: 400,
  //     },
  //   },
  //   '& .MuiButton-text:hover': {
  //     boxShadow: 'none',
  //     backgroundColor: 'transparent',
  //     '& span': {
  //       color: 'black',
  //     },
  //   },
  // },
});

const MuiSlider = styled(Slider)`
  & .MuiSlider-thumb {
    color: #ffffff;
    box-shadow: 0 0 1px rgba(55, 56, 60, 0.2), 0 2px 8px rgba(55, 56, 60, 0.08);
    &:focus,
    &:hover,
    &.Mui-active {
      box-shadow: 0 3px 1px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(0, 0, 0, 0.02);
    }
  }
  & .MuiSlider-track {
    background-color: #5064ff;
  }
  & .MuiSlider-rail {
    background-color: #e4e6eb;
  }
`;

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
    &expanded {
      margin: 0;
    }
  }
  .Mui-expanded {
    min-height: 0;
  }
  &.MuiAccordionSummary-root {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding-left: 0;
    min-height: 0;
    &expanded {
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

  & .Mui-focused,
  & .Mui-disabled {
    color: #2a2a2d;
  }
  & .MuiInput-underline:after {
    border-bottom-color: rgba(80, 100, 255, 0.1);
  }

  & .MuiInput-underline:before {
    border-color: #e4e6eb !important;
  }

  & .MuiInput-root {
    color: #2a2a2d;
    & .Mui-focused fieldset {
      border-color: rgba(80, 100, 255, 0.1);
    }
    & .MuiSvgIcon-root {
      color: #81818e;
    }
  }
`;

const CustomToggleButtonGroup = styled(ToggleButtonGroup)`
  .MuiToggleButtonGroup-grouped {
    margin: 0 6px 0 0;
    border-radius: 4px !important;
    border: 0;
    height: 34px;
    width: 34px;
    &.mui-disabled {
      border: 0;
    }
    &:hover {
      background-color: rgba(80, 100, 255, 0.04);
      color: rgba(80, 100, 255, 0.7);
    }
  }
`;

const CustomToggleButton = styled(ToggleButton)`
  &.Mui-selected {
    background-color: rgba(80, 100, 255, 0.3) !important;
    color: rgba(80, 100, 255) !important;
    &:hover {
      background-color: rgba(80, 100, 255, 0.3) !important;
    }
  }
`;

const useIconButtonClasses = makeStyles(() => ({
  iconButton: {
    width: '32px',
    height: '32px',
    color: '#5064FF',
    '&.disabled': {
      color: '#81818E',
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
  backgroundColor: '#ffffff',
}));

export const StyledAccordion = React.forwardRef<any, AccordionProps>(
  ({ children, ...props }, ref) => {
    return (
      <Accordion {...props} ref={ref}>
        {children as unknown as ReactElement}
      </Accordion>
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

export const StyledSlider: React.FC<SliderProps> = (props) => {
  return <MuiSlider {...props} />;
};

export const StyledTextField: React.FC<TextFieldProps> = (props) => {
  const { select } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <CustomTextField
      fullWidth
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
  return <CustomToggleButton {...props} />;
};

export const StyledToggleButtonGroup: React.FC<ToggleButtonGroupProps> = (
  props,
) => {
  return <CustomToggleButtonGroup {...props} />;
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
