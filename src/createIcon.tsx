import { forwardRef } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { IconDefinition, IconProps } from './types';

export function createIcon(name: string, definition: IconDefinition) {
  const Icon = forwardRef<Svg, IconProps>(function IconRender(
    {
      size = 24,
      color = '#000',
      strokeWidth = definition.strokeWidth,
      ...props
    },
    ref
  ) {
    return (
      <Svg
        accessible={false}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        color={color}
        stroke={color}
        strokeWidth={strokeWidth}
      >
        {definition.elements.map((element, key) => {
          // Explicit shape colors retain Fabric/RNW behavior and solid details.
          const style = {
            fill:
              element.fill === 'currentColor'
                ? color
                : (element.fill ?? 'none'),
            stroke: element.stroke ?? color,
            opacity: element.opacity,
          };
          switch (element.kind) {
            case 'path':
              return <Path key={key} d={element.d} {...style} />;
            case 'circle':
              return (
                <Circle
                  key={key}
                  cx={element.cx}
                  cy={element.cy}
                  r={element.r}
                  {...style}
                />
              );
            case 'rect':
              return (
                <Rect
                  key={key}
                  x={element.x}
                  y={element.y}
                  width={element.width}
                  height={element.height}
                  rx={element.rx}
                  {...style}
                />
              );
          }
        })}
      </Svg>
    );
  });
  Icon.displayName = name;
  return Icon;
}
