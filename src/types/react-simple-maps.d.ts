declare module "react-simple-maps" {
  import * as React from "react";

  export interface ComposableMapProps {
    width?: number;
    height?: number;
    projection?: string | Function;
    projectionConfig?: any;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export interface GeographiesProps {
    geography?: string | object | string[];
    children?: (data: { geographies: any[] }) => React.ReactNode;
  }

  export interface GeographyProps {
    geography?: any;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
  }

  export interface MarkerProps {
    coordinates?: [number, number];
    children?: React.ReactNode;
  }

  export interface LineProps {
    from?: [number, number];
    to?: [number, number];
    stroke?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
    strokeDasharray?: string | number;
    children?: React.ReactNode;
  }

  export const ComposableMap: React.FC<ComposableMapProps>;
  export const Geographies: React.FC<GeographiesProps>;
  export const Geography: React.FC<GeographyProps>;
  export const Marker: React.FC<MarkerProps>;
  export const Line: React.FC<LineProps>;
}
