// helpers to turn AI-block CSS into role/prop maps
export function parseRules(css) {
  // returns [{media, sel, decls:{prop:value}}]
  const out = [];
  const src = css.replace(/\/\*[\s\S]*?\*\//g, "");
  let i = 0;
  const stack = [];
  let buf = "";
  while (i < src.length) {
    const ch = src[i];
    if (ch === "{") {
      const head = buf.trim();
      buf = "";
      if (head.startsWith("@")) stack.push({ media: head });
      else stack.push({ sel: head });
    } else if (ch === "}") {
      const top = stack.pop();
      if (top && top.sel !== undefined) {
        const decls = {};
        for (const d of buf.split(";")) {
          const k = d.indexOf(":");
          if (k > 0) decls[d.slice(0, k).trim()] = d.slice(k + 1).trim();
        }
        const media = stack.filter((s) => s.media).map((s) => s.media).join(" ");
        out.push({ media, sel: top.sel, decls });
      }
      buf = "";
    } else buf += ch;
    i++;
  }
  return out;
}

export function roleMap(css, prefix) {
  // prefix like "ai-split-layout"; role = part after "__" before "-X"
  const map = {};
  for (const r of parseRules(css)) {
    for (const sel of r.sel.split(",")) {
      const m = sel.trim().match(new RegExp(`^\\.${prefix}(?:(?:__|-)([a-z0-9-]+?))?-X(\\[[^\\]]+\\])?$`));
      if (!m) continue;
      const role = (m[1] || "root") + (m[2] ? m[2] : "");
      const mq = /max-width:\s*749px/.test(r.media) ? "@m" : /min-width:\s*750px/.test(r.media) ? "@d" : r.media ? "@" + r.media : "";
      for (const [p, v] of Object.entries(r.decls)) map[`${role}.${p}${mq}`] = v;
    }
  }
  return map;
}
