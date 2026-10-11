import { useState } from 'react';
import Heading from '@theme/Heading';
import { iconCatalog } from './catalog';
import { categoryLabels, iconCategories } from './iconCategories';

export default function IconCatalog() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [message, setMessage] = useState('');
  const filtered = iconCatalog.filter(({ name, sourceName }) =>
    `${name} ${sourceName}`.toLowerCase().includes(query.trim().toLowerCase())
  );
  const groups = Object.entries(categoryLabels).map(([id, label]) => ({
    id,
    label,
    icons: filtered.filter(
      ({ sourceName }) => iconCategories[sourceName] === id
    ),
  }));
  const visibleGroups = groups.filter(
    ({ id, icons }) =>
      icons.length > 0 && (category === 'all' || category === id)
  );
  const count = visibleGroups.reduce(
    (total, group) => total + group.icons.length,
    0
  );
  async function copy(name: string) {
    const code = `import { ${name} } from '@unif/react-native-icons';\n\n<${name} size={24} color="#EB6E00" />`;
    try {
      await navigator.clipboard.writeText(code);
      setMessage(`已复制 ${name} 的使用代码`);
    } catch {
      setMessage(code);
    }
  }
  return (
    <section aria-label="图标目录">
      <label className="icons-search">
        搜索图标
        <input
          type="search"
          placeholder="例如 camera、star、Outlined"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <div className="icons-categories" role="group" aria-label="图标分类">
        <button
          type="button"
          aria-pressed={category === 'all'}
          onClick={() => setCategory('all')}
        >
          全部 <span>{filtered.length}</span>
        </button>
        {groups.map(({ id, label, icons }) => (
          <button
            key={id}
            type="button"
            aria-pressed={category === id}
            onClick={() => setCategory(id)}
          >
            {label} <span>{icons.length}</span>
          </button>
        ))}
      </div>
      <p className="icons-count" role="status">
        {query.trim() || category !== 'all' ? '找到' : '共'} {count} 个图标 ·
        点击复制代码
      </p>
      <pre className="icons-feedback" aria-live="polite">
        {message}
      </pre>
      {visibleGroups.map(({ id, label, icons }) => (
        <section
          key={id}
          className="icons-category"
          aria-labelledby={`icons-${id}`}
        >
          <Heading as="h3" id={`icons-${id}`}>
            {label} <span>{icons.length}</span>
          </Heading>
          <div className="icons-grid">
            {icons.map(({ name, Icon }) => (
              <button
                type="button"
                className="icons-cell"
                key={name}
                onClick={() => {
                  copy(name);
                }}
                aria-label={`复制 ${name} 使用代码`}
              >
                <Icon size={30} color="currentColor" />
                <span>{name}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
      {count === 0 && <p>没有匹配的图标。</p>}
    </section>
  );
}
