# claude-md-viewer

A beautiful local markdown viewer with live reload. Built for Claude Code workflows.

Opens your markdown file in the browser using the Vollkorn serif font — clean, readable, and typographically considered. Updates instantly when the file changes on disk.

## Why

Reading raw markdown is unpleasant. Asterisks, hashes, backticks — it's noise that gets between you and the content. Paid apps like Typora solve this beautifully, but they're heavyweight tools that need to be installed, configured, and launched. Sometimes you just want to open a file and read it.

`claude-md-viewer` is one command. No app to install, no preferences to set, no window to hunt for. The file opens in your browser, rendered in a clean serif typeface, and that's it.

## Install

```bash
npm install -g claude-md-viewer
```

Or run without installing:

```bash
npx claude-md-viewer file.md
```

## Usage

```bash
claude-md-viewer path/to/file.md
```

The browser opens automatically. Edit the file and the browser updates live. Reload the tab and the content is still there.

From inside a Claude Code session, prefix with `!`:

```bash
! claude-md-viewer path/to/file.md
```

## Claude Code Integration

There are three ways to open files from within Claude Code:

**1. Natural language** — just tell Claude:
> "open that file in the viewer"
> "view the plan"
> "preview README.md"

**2. Slash command** — install the `/view-md` skill by copying `skills/view-md/` to `~/.claude/skills/`, then:
```
/view-md path/to/file.md
```

**3. Inline terminal** — run directly from the Claude Code prompt:
```
! claude-md-viewer path/to/file.md
```

For natural language and slash command support, add to `~/.claude/CLAUDE.md`:

```
## Markdown Viewer

When asked to "open", "view", or "preview" a markdown file, run via Bash:
  claude-md-viewer /absolute/path/to/file.md &

If claude-md-viewer is not found, use:
  npx claude-md-viewer /absolute/path/to/file.md &
```

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
