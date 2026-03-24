# /view-md — Open a markdown file in the Vollkorn viewer

Launch the local md-view server for a markdown file and open it in the browser.

## Usage

`/view-md <file>` or `/view-md` (uses most recently mentioned .md file)

## Steps

1. Resolve the file path to an absolute path
   - If a path was given as an argument, resolve it: `realpath <path>` or prepend the current working directory
   - If no argument, use the most recently created or mentioned `.md` file in the conversation

2. Check if md-view is available:
   ```bash
   which md-view 2>/dev/null
   ```

3. Launch the viewer (backgrounded so it doesn't block):
   - If md-view found: `md-view /absolute/path/to/file.md &`
   - If not found: `npx md-view /absolute/path/to/file.md &`

4. Confirm with a single line:
   ```
   Opened in viewer: <filename>
   ```

## Notes

- The viewer auto-opens in the default browser
- It live-reloads when the file changes on disk
- Each invocation starts a new server on the next available port starting at 7337
- Stop with Ctrl+C in the terminal where it was launched
