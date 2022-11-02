interface Window {
  renderTreeInfo: any;
}
declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'staging';
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

declare module '*.png' {
  const value: any;
  export default value;
}
