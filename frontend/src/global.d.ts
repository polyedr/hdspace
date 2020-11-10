// @ts-nocheck

interface Window {
  renderTreeInfo: any;
}

declare module 'react-clock' {
  type HandLength = number; // 0 - 100
  type OppositeHandLength = number; // -100 - 100
  type HandWidth = number; // >= 0
  type MarkLength = HandLength;
  type MarkWidth = HandWidth;

  export default function Clock(props: ClockProps): JSX.Element;

  export interface ClockProps {
    className?: string | string[];
    hourHandLength?: HandLength;
    hourHandOppositeLength?: OppositeHandLength;
    hourHandWidth?: HandWidth;
    hourMarksLength?: MarkLength;
    hourMarksWidth?: MarkWidth;
    minuteHandLength?: HandLength;
    minuteHandOppositeLength?: OppositeHandLength;
    minuteHandWidth?: HandWidth;
    minuteMarksLength?: MarkLength;
    minuteMarksWidth?: MarkWidth;
    renderHourMarks?: boolean;
    renderMinuteHand?: boolean;
    renderMinuteMarks?: boolean;
    renderNumbers?: boolean;
    renderSecondHand?: boolean;
    secondHandLength?: HandLength;
    secondHandOppositeLength?: OppositeHandLength;
    secondHandWidth?: HandWidth;
    size?: number;
    value?: Date | string;
  }
}

declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
  }
}

declare module 'react-color/lib/helpers' {
  export const toState: (
    data: any,
    oldHue?: any,
  ) => {
    hsl: any;
    hex: string;
    rgb: any;
    hsv: any;
    oldHue: any;
    source: any;
  };
}

declare module "*.png" {
  const value: any;
  export default value;
}