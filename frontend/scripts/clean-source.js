/**
 * clean-source.js
 * Recursively removes comments and decorative emojis from .ts, .tsx, .js, .jsx in src.
 * Preserves URLs in comments. Does not modify string literals (comment removal is string-aware).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, '..', 'src');
const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx']);

// Emoji: common ranges (decorative symbols, emoticons, misc symbols, supplemental)
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F1E0}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{2300}-\u{23FF}\u{2B50}\u{2728}\u{2764}\u{1F4AA}\u{1F680}\u{1F44B}\u{1F389}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}]/gu;

const URL_REGEX = /https?:\/\/[^\s\]'")]*/g;

function isSourceFile(filePath) {
  return EXTENSIONS.has(path.extname(filePath));
}

function getAllSourceFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      getAllSourceFiles(full, files);
    } else if (ent.isFile() && isSourceFile(full)) {
      files.push(full);
    }
  }
  return files;
}

/**
 * Remove block comments (/* ... *\/) and line comments (// ...) with a state machine.
 * Preserves URLs: when a line comment or block comment contains a URL, that URL is re-emitted.
 * Does not modify content inside string literals (single, double, template).
 */
function removeComments(content) {
  const len = content.length;
  let i = 0;
  let out = '';
  let state = 'code'; // code | single | double | template | lineComment | blockComment
  let lineCommentBuffer = '';
  let blockCommentBuffer = '';

  while (i < len) {
    const c = content[i];
    const next = content[i + 1];

    switch (state) {
      case 'code':
        if (c === '"') {
          out += c;
          state = 'double';
        } else if (c === "'") {
          out += c;
          state = 'single';
        } else if (c === '`') {
          out += c;
          state = 'template';
        } else if (c === '/' && next === '/') {
          i += 1;
          lineCommentBuffer = '';
          state = 'lineComment';
        } else if (c === '/' && next === '*') {
          i += 1;
          blockCommentBuffer = '';
          state = 'blockComment';
        } else {
          out += c;
        }
        break;

      case 'double':
        out += c;
        if (c === '\\') {
          i += 1;
          if (i < len) out += content[i];
        } else if (c === '"') {
          state = 'code';
        }
        break;

      case 'single':
        out += c;
        if (c === '\\') {
          i += 1;
          if (i < len) out += content[i];
        } else if (c === "'") {
          state = 'code';
        }
        break;

      case 'template':
        out += c;
        if (c === '\\') {
          i += 1;
          if (i < len) out += content[i];
        } else if (c === '`') {
          state = 'code';
        }
        break;

      case 'lineComment':
        if (c === '\n') {
          const urls = lineCommentBuffer.match(URL_REGEX);
          if (urls && urls.length > 0) {
            out += '// ' + urls.join(' ') + '\n';
          }
          out += c;
          state = 'code';
        } else {
          lineCommentBuffer += c;
        }
        break;

      case 'blockComment':
        if (c === '*' && next === '/') {
          i += 1;
          const urls = blockCommentBuffer.match(URL_REGEX);
          if (urls && urls.length > 0) {
            out += '/* ' + urls.join(' ') + ' */';
          }
          state = 'code';
        } else {
          blockCommentBuffer += c;
        }
        break;
    }
    i += 1;
  }

  if (state === 'lineComment') {
    const urls = lineCommentBuffer.match(URL_REGEX);
    if (urls && urls.length > 0) {
      out += '// ' + urls.join(' ') + '\n';
    }
  } else if (state === 'blockComment') {
    const urls = blockCommentBuffer.match(URL_REGEX);
    if (urls && urls.length > 0) {
      out += '/* ' + urls.join(' ') + ' */';
    }
  }

  return out;
}

/**
 * Remove emoji characters from the entire string.
 */
function removeEmojis(content) {
  return content.replace(EMOJI_REGEX, '');
}

/**
 * Trim trailing whitespace from lines that became empty after comment removal.
 */
function trimEmptyLines(content) {
  return content
    .split('\n')
    .map((line) => {
      const trimmed = line.trimEnd();
      if (trimmed === '' && line !== '') return '';
      return line;
    })
    .join('\n');
}

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  let result = removeComments(raw);
  result = removeEmojis(result);
  result = trimEmptyLines(result);
  if (result !== raw) {
    fs.writeFileSync(filePath, result, 'utf8');
    return true;
  }
  return false;
}

function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error('Source directory not found:', SRC_DIR);
    process.exit(1);
  }

  const files = getAllSourceFiles(SRC_DIR);
  let modified = 0;

  for (const file of files) {
    if (processFile(file)) {
      modified += 1;
      console.log('Cleaned:', path.relative(path.join(SRC_DIR, '..'), file));
    }
  }

  console.log(`Done. ${modified} of ${files.length} files modified.`);
}

main();
