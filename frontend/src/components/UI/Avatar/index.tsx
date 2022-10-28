import React from 'react';
import { Avatar as MuiAvatar, AvatarProps, Tooltip } from '@mui/material';
import stc from 'string-to-color';

interface Props {
  uniqueKey?: string | number;
  tooltipDisabled?: boolean;
  alt: string;
}

const WrapInToolTip = ({ title, disabled, children }) => {
  if (disabled) {
    return children;
  }

  return (
    <Tooltip disableInteractive arrow title={title}>
      {children}
    </Tooltip>
  );
};

const Avatar = React.forwardRef<never, Props & AvatarProps>(
  ({ uniqueKey, tooltipDisabled = false, ...props }, ref) => {
    const sx = props.sx ?? {};
    return (
      <WrapInToolTip disabled={tooltipDisabled} title={props.alt}>
        <MuiAvatar
          {...props}
          sx={{
            bgcolor: stc(`${props.alt} ${uniqueKey ?? ''}`),
            ...sx,
          }}
          ref={ref}
        >
          {props.alt
            .split(' ')
            .map((n) => n[0].toUpperCase())
            .join('')}
        </MuiAvatar>
      </WrapInToolTip>
    );
  },
);

export default Avatar;
