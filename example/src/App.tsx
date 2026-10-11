import { useState } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  View,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { iconCatalog } from './catalog';

export default function App() {
  const [query, setQuery] = useState('');
  const dark = useColorScheme() === 'dark';
  const color = dark ? '#f3f4f6' : '#1f2937';
  const backgroundColor = dark ? '#111827' : '#ffffff';
  const filtered = iconCatalog.filter(({ name, sourceName }) =>
    `${name} ${sourceName}`.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color }]}>Unif Icons</Text>
      <TextInput
        accessibilityLabel="搜索图标"
        placeholder="搜索组件名或图标名称"
        placeholderTextColor={color}
        value={query}
        onChangeText={setQuery}
        style={[styles.search, { color, borderColor: color }]}
      />
      <Text style={[styles.count, { color }]}>
        {filtered.length} / {iconCatalog.length} 个图标
      </Text>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.name}
        numColumns={2}
        renderItem={({ item: { name, Icon } }) => (
          <View style={styles.cell}>
            <Icon size={32} color={color} />
            <Text style={[styles.label, { color }]}>{name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: 20,
  },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
  search: { borderWidth: 1, borderRadius: 8, padding: 12 },
  count: { marginVertical: 12 },
  cell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 4,
    gap: 12,
  },
  label: { fontSize: 12, textAlign: 'center' },
});
