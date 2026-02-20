# Commit Message Rules

When generating commit messages:

- Always use Conventional Commits format.
- Format: `<emoji> <type>: <short reason>`
- The message must be written in English.
- Provide only ONE clear and specific reason.
- **Always include the emoji** at the start of the commit message.
- Keep it concise (max 12 words after the colon).
- Do not add descriptions, bullet points, or multiple sentences.
- Use lowercase after the colon.

## Allowed types:

- 💻 feature
- 🛠️ fix
- 📗 docs
- ⚙️ refactor
- 🧪 test
- 🔨 build
- 🔁 ci
- ⚡ perf

## Examples:

```bash
💻 feat: implement order validation endpoint
🛠️ fix: resolve null pointer in user service
📗 docs: add API usage documentation
⚙️ refactor: simplify authentication logic
🧪 test: add unit tests for payment
🔨 build: update gradle dependencies
🔁 ci: configure github actions workflow
⚡ perf: optimize database queries
```
