import type { ColorValue } from 'react-native';
import type { SvgProps } from 'react-native-svg';

export type IconProps = Omit<
  SvgProps,
  | 'children'
  | 'width'
  | 'height'
  | 'viewBox'
  | 'fill'
  | 'stroke'
  | 'strokeWidth'
  | 'color'
> & {
  /** Width and height in logical pixels; no implicit responsive scaling. */
  size?: number;
  color?: ColorValue;
  strokeWidth?: number;
};

type NodeStyle = {
  readonly fill?: string;
  readonly stroke?: 'none';
  readonly opacity?: number;
};
export type IconNode = NodeStyle &
  (
    | { readonly kind: 'path'; readonly d: string }
    | {
        readonly kind: 'circle';
        readonly cx: number;
        readonly cy: number;
        readonly r: number;
      }
    | {
        readonly kind: 'rect';
        readonly x: number;
        readonly y: number;
        readonly width: number;
        readonly height: number;
        readonly rx?: number;
      }
  );
export type IconDefinition = {
  readonly strokeWidth: number;
  readonly elements: readonly IconNode[];
};
