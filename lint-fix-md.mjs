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
    const content = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(content, { decodeEntities: false });

    // Remove <p> wrapping around <img>
    $('p img').each(function () {
      $(this).parent().replaceWith($(this));
    });

    // Convert <a><img></a> to markdown link with image (preserving alt text)
    $('a').each(function () {
      const img = $(this).find('img');
      if (img.length === 1 && $(this).contents().length === 1) {
        const href = $(this).attr('href');
        const src = img.attr('src');
        const alt = img.attr('alt') || '';
        $(this).replaceWith(`[![${alt}](${src})](${href})`);
      }
    });

    // Convert remaining <img> to markdown images (preserving alt text)
    $('img').each(function () {
      const src = $(this).attr('src');
      const alt = $(this).attr('alt') || '';
      $(this).replaceWith(`![${alt}](${src})`);
    });

    // Replace <br> with newline
    $('br').replaceWith('\n');

    // Remove all <p> tags but keep content
    $('p').each(function () {
      $(this).replaceWith($(this).html());
    });

    // Get the HTML content as a string
    let output = $.root().html();

    // Clean up any remaining HTML tags just in case (should be none)
    output = output
      .replace(/<\/?[^>]+(>|$)/g, '')  // remove any remaining HTML tags
      .replace(/\n{3,}/g, '\n\n')      // collapse multiple blank lines
      .trim();

    fs.writeFileSync(file, output, 'utf8');
    console.log(`✅ Cleaned: ${path.relative(__dirname, file)}`);
  } catch (err) {
    console.error(`❌ Error cleaning ${file}:`, err.message);
  }
}
