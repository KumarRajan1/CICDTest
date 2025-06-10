import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerioModule from 'cheerio';

const cheerio = cheerioModule;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, 'docs');

if (!fs.existsSync(targetDir)) {
  console.error(`❌ Directory not found: ${targetDir}`);
  process.exit(1);
}

function getAllMarkdownFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(filePath));
    } else if (file.toLowerCase().endsWith('.md')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = getAllMarkdownFiles(targetDir);

if (files.length === 0) {
  console.log(`⚠️  No .md files found in: ${targetDir}`);
  process.exit(0);
}

for (const file of files) {
  try {
    const original = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(original, { decodeEntities: false });

    // ✅ Remove <p> wrappers around <img>
    $('p img').each(function () {
      $(this).parent().replaceWith($(this));
    });

    // ✅ Convert <a><img></a> to Markdown image links
    $('a').each(function () {
      const img = $(this).find('img');
      if (img.length === 1 && $(this).contents().length === 1) {
        const href = $(this).attr('href');
        const src = img.attr('src');
        const alt = img.attr('alt') || '';
        $(this).replaceWith(`[![${alt}](${src})](${href})`);
      }
    });

    // ✅ Convert standalone <img> tags to Markdown
    $('img').each(function () {
      const src = $(this).attr('src');
      const alt = $(this).attr('alt') || '';
      $(this).replaceWith(`![${alt}](${src})`);
    });

    // ✅ Replace <br> with newlines
    $('br').replaceWith('\n');

    // ✅ Remove <p> tags, preserve content
    $('p').each(function () {
      $(this).replaceWith($(this).html());
    });

    // ✅ Extract and clean plain content
    let output = $.root().html();
    output = output
      .replace(/<\/?[^>]+(>|$)/g, '')        // Strip any HTML tags
      .replace(/\n{3,}/g, '\n\n')            // Collapse multiple blank lines
      .trim();

      const lines = output.split('\n');
      const fixedLines = [];
      let openBraceCount = 0;
      
      lines.forEach((line, i) => {
        const openBraces = (line.match(/{/g) || []).length;
        const closeBraces = (line.match(/}/g) || []).length;
        openBraceCount += openBraces - closeBraces;
      
        // Fix broken markdown links
        line = line.replace(/\[[^\]]*]\(\s*\)/g, match => `<!-- Broken link: ${match} -->`);
      
        // If braces are unbalanced or line ends in open `{`, comment the line
        if (openBraceCount > 0 || line.trim().endsWith('{')) {
          line = `<!-- ⚠️ Unclosed { expression possibly causing MDX crash on line ${i + 1} -->\n<!-- ${line.trim()} -->`;
          openBraceCount = 0; // reset to avoid cascading errors
        }
      
        fixedLines.push(line);
      });
      

    fs.writeFileSync(file, fixedLines.join('\n'), 'utf8');
    console.log(`✅ Cleaned: ${path.relative(__dirname, file)}`);
  } catch (err) {
    console.error(`❌ Error cleaning ${file}:`, err.message);
  }
}
