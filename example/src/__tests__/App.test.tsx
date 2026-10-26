import renderer, { act } from 'react-test-renderer';
import * as ReactNative from 'react-native';
import { afterEach, describe, expect, jest, test } from '@jest/globals';
import App from '../App';

let view: renderer.ReactTestRenderer;

afterEach(async () => {
  if (view) await act(async () => view.unmount());
  jest.restoreAllMocks();
});

async function renderApp() {
  await act(async () => {
    view = renderer.create(<App />);
  });
  return view;
}

describe('native icon catalog', () => {
  test('renders the catalog and filters by public name or SVG source name', async () => {
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');
    const tree = await renderApp();
    const input = tree.root.findByType(ReactNative.TextInput);
    expect(input.props.placeholderTextColor).toBe('#1f2937');
    expect(tree.root.findByType(ReactNative.FlatList).props.data.length).toBe(
      146
    );

    await act(async () => input.props.onChangeText('SENDOUTLINED'));
    let list = tree.root.findByType(ReactNative.FlatList);
    expect(list.props.data.map((item: { name: string }) => item.name)).toEqual([
      'SendOutlined',
    ]);
    expect(list.props.keyExtractor(list.props.data[0])).toBe('SendOutlined');

    await act(async () => input.props.onChangeText('file-pdf'));
    list = tree.root.findByType(ReactNative.FlatList);
    expect(list.props.data.map((item: { name: string }) => item.name)).toEqual([
      'FilePdfOutlined',
    ]);

    await act(async () => input.props.onChangeText('不存在的图标'));
    expect(tree.root.findByType(ReactNative.FlatList).props.data).toEqual([]);
  });

  test('adapts the example to the dark device theme', async () => {
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('dark');
    const tree = await renderApp();
    expect(
      tree.root.findByType(ReactNative.TextInput).props.placeholderTextColor
    ).toBe('#f3f4f6');
    const root = tree.root.findAllByType(ReactNative.View)[0];
    expect(
      ReactNative.StyleSheet.flatten(root?.props.style).backgroundColor
    ).toBe('#111827');
  });
});
