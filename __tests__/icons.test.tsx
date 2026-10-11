import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { describe, expect, test, jest } from '@jest/globals';
import {
  SendOutlined,
  StarFilled,
  ShutterOutlined,
  Aspect43Outlined,
} from '../src';

jest.mock('react-native-svg', () => {
  const ReactActual = jest.requireActual<typeof React>('react');
  return {
    __esModule: true,
    default: ReactActual.forwardRef((props: object, ref) =>
      ReactActual.createElement('Svg', { ...props, ref })
    ),
    Path: 'Path',
    Circle: 'Circle',
    Rect: 'Rect',
  };
});

async function render(
  element: React.ReactElement,
  options?: renderer.TestRendererOptions
) {
  let result!: renderer.ReactTestRenderer;
  await act(async () => {
    result = renderer.create(element, options);
  });
  return result;
}

describe('public icon components', () => {
  test('renders default geometry without a theme provider', async () => {
    const view = await render(<SendOutlined />);
    const svg = view.root.findByType('Svg' as React.ElementType);
    expect(svg.props).toMatchObject({
      width: 24,
      height: 24,
      viewBox: '0 0 24 24',
      stroke: '#000',
      strokeWidth: 1.75,
      accessible: false,
    });
    expect(
      view.root.findAllByType('Path' as React.ElementType)[0]?.props
    ).toMatchObject({ d: 'M12 19V5', stroke: '#000', fill: 'none' });
  });

  test('forwards dimensions, color, a11y, events and ref to the SVG', async () => {
    const ref = React.createRef<React.ComponentRef<typeof SendOutlined>>();
    const onPress = jest.fn();
    const view = await render(
      <SendOutlined
        ref={ref}
        size={32}
        color="#c00"
        strokeWidth={2}
        strokeLinecap="butt"
        strokeLinejoin="bevel"
        testID="send"
        accessible
        accessibilityLabel="发送"
        onPress={onPress}
      />,
      { createNodeMock: () => ({ svg: true }) }
    );
    const svg = view.root.findByType('Svg' as React.ElementType);
    expect(svg.props).toMatchObject({
      width: 32,
      height: 32,
      stroke: '#c00',
      strokeWidth: 2,
      strokeLinecap: 'butt',
      strokeLinejoin: 'bevel',
      testID: 'send',
      accessible: true,
      accessibilityLabel: '发送',
      onPress,
    });
    expect(ref.current).toEqual({ svg: true });
  });

  test('filled and mixed shapes preserve explicit fill and stroke overrides', async () => {
    const filled = await render(<StarFilled color="#09c" />);
    expect(
      filled.root.findByType('Path' as React.ElementType).props
    ).toMatchObject({ fill: '#09c', stroke: 'none' });
    const mixed = await render(<ShutterOutlined color="#09c" />);
    const circles = mixed.root.findAllByType('Circle' as React.ElementType);
    expect(circles[0]?.props).toMatchObject({ stroke: '#09c', fill: 'none' });
    expect(circles[1]?.props).toMatchObject({ stroke: 'none', fill: '#09c' });
  });

  test('preserves rect geometry and node opacity', async () => {
    const view = await render(<Aspect43Outlined />);
    expect(
      view.root.findAllByType('Rect' as React.ElementType).length
    ).toBeGreaterThan(0);
    expect(
      view.root.findAll((node) => node.props.opacity !== undefined).length
    ).toBeGreaterThan(0);
  });
});
