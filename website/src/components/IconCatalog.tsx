import { useState } from 'react';
import { iconCatalog } from './catalog';

export default function IconCatalog() {
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const filtered = iconCatalog.filter(({ name, sourceName }) =>
    `${name} ${sourceName}`.toLowerCase().includes(query.trim().toLowerCase())
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
      <p className="icons-count">
        {filtered.length} / {iconCatalog.length} 个图标 · 点击复制代码
      </p>
      <pre className="icons-feedback" aria-live="polite">
        {message}
      </pre>
      <div className="icons-grid">
        {filtered.map(({ name, Icon }) => (
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
      {filtered.length === 0 && <p>没有匹配的图标。</p>}
    </section>
  );
}
