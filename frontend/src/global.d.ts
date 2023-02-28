interface Window {
  renderTreeInfo: any;
  wireframeCanvas: any;
}

declare module '*.module.scss?inline' {
  const styles: Record<string, string>;
  export default styles;
}

declare module '*.module.scss' {
  const styles: Record<string, string>;
  export default styles;
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
