# md-view

A beautiful local markdown viewer with live reload. Built for Claude Code workflows.

Opens your markdown file in the browser using the Vollkorn serif font — clean, readable, and typographically considered. Updates instantly when the file changes on disk.

## Install

```bash
npm install -g md-view
```

Or run without installing:

```bash
npx md-view file.md
```

## Usage

```bash
md-view path/to/file.md
```

The browser opens automatically. Edit the file and the browser updates live. Reload the tab and the content is still there.

## Claude Code Integration

Add to `~/.claude/CLAUDE.md`:

```
## Markdown Viewer

When asked to "open", "view", or "preview" a markdown file, run via Bash:
  md-view /absolute/path/to/file.md &

If md-view is not found, use:
  npx md-view /absolute/path/to/file.md &
```

Now you can tell Claude Code "open that plan in the viewer" and it just runs it.

## Features

- Live reload via Server-Sent Events — no WebSocket library needed
- Vollkorn variable font bundled — no CDN, works offline
- Zero npm dependencies — Node stdlib only
- Survives page reload (content fetched from server, not FileReader)
- Finds a free port automatically starting at 7337
- Status dot in top bar flashes when reloading

## Design

The typography is based on Vollkorn, a free serif typeface by Friedrich Althausen. The layout and reading experience is modeled after Typora's academic theme — justified text, centered headings, thin rule under h2, generous spacing.

## License

MIT
