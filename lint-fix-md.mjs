#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DocusaurusConverter {
  constructor() {
    this.baseUrl = '/docs/'; // Adjust this to your Docusaurus docs base URL
    this.processedFiles = new Set();
  }

  /**
   * Process a single markdown file
   */
  processFile(filePath, outputDir = null) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath);
      const outputPath = outputDir ? path.join(outputDir, fileName) : filePath;
      
      console.log(`Processing: ${fileName}`);
      
      const convertedContent = this.convertMarkdown(content, fileName);
      
      // Create output directory if it doesn't exist
      if (outputDir) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, convertedContent, 'utf8');
      console.log(`✅ Converted: ${fileName}`);
      
      this.processedFiles.add(fileName);
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }

  /**
   * Process all .md files in a directory recursively
   */
  processDirectory(inputDir, outputDir = null) {
    const files = fs.readdirSync(inputDir, { withFileTypes: true });
    
    files.forEach(file => {
      const fullPath = path.join(inputDir, file.name);
      
      if (file.isDirectory()) {
        // Recursively process subdirectories
        const subOutputDir = outputDir ? path.join(outputDir, file.name) : null;
        this.processDirectory(fullPath, subOutputDir);
      } else if (file.name.endsWith('.md')) {
        this.processFile(fullPath, outputDir);
      }
    });
  }

  /**
   * Main conversion logic
   */
  convertMarkdown(content, fileName) {
    let converted = content;

    // Add Docusaurus frontmatter
    converted = this.addFrontmatter(converted, fileName);

    // Fix HTML image tags and make them Docusaurus compatible
    converted = this.fixImageTags(converted);

    // Convert table of contents to Docusaurus format
    converted = this.convertTableOfContents(converted);

    // Fix internal links
    converted = this.fixInternalLinks(converted);

    // Fix markdown tables
    converted = this.fixTables(converted);

    // Fix code blocks
    converted = this.fixCodeBlocks(converted);

    // Remove or fix problematic HTML
    converted = this.cleanHtml(converted);

    // Fix headings
    converted = this.fixHeadings(converted);

    // Fix version history tables
    converted = this.fixVersionTables(converted);

    // Add import statements for assets if needed
    converted = this.addAssetImports(converted);

    return converted;
  }

  /**
   * Add Docusaurus frontmatter
   */
  addFrontmatter(content, fileName) {
    // Extract title from first heading or filename
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].replace(/[<>]/g, '') : fileName.replace('.md', '');
    
    // Generate slug from filename
    const slug = fileName.replace('.md', '').toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    const frontmatter = `---
title: "${title}"
slug: ${slug}
sidebar_position: 1
---

`;

    // Check if frontmatter already exists
    if (content.startsWith('---')) {
      return content;
    }

    return frontmatter + content;
  }

  /**
   * Fix HTML image tags
   */
  fixImageTags(content) {
    // Convert HTML img tags to markdown format
    content = content.replace(/<img\s+src="([^"]+)"\s*(?:height="[^"]*")?\s*\/?\s*>/g, (match, src) => {
      // Handle absolute URLs vs relative paths
      if (src.startsWith('http')) {
        return `![Image](${src})`;
      } else {
        // For local images, adjust path for Docusaurus static folder
        const imagePath = src.startsWith('/') ? src : `/${src}`;
        return `![Image](${imagePath})`;
      }
    });

    // Handle complex image with link combinations
    content = content.replace(/\[<img[^>]+>\s*<\/p>\]\(([^)]+)\)/g, (match, link) => {
      return `[View Documentation](${link})`;
    });

    return content;
  }

  /**
   * Convert table of contents
   */
  convertTableOfContents(content) {
    // Docusaurus handles TOC automatically, but we can improve the structure
    
    // Fix nested list items in TOC
    content = content.replace(/^(\s*)- \[([^\]]+)\]\(([^)]+)\)$/gm, (match, indent, text, link) => {
      const cleanLink = this.cleanInternalLink(link);
      return `${indent}- [${text}](${cleanLink})`;
    });

    // Fix nested TOC with asterisks
    content = content.replace(/^(\s*)\* \[([^\]]+)\]\(([^)]+)\)$/gm, (match, indent, text, link) => {
      const cleanLink = this.cleanInternalLink(link);
      return `${indent}- [${text}](${cleanLink})`;
    });

    return content;
  }

  /**
   * Fix internal links
   */
  fixInternalLinks(content) {
    // Fix relative documentation links
    content = content.replace(/\]\(docs\/([^)]+)\)/g, (match, path) => {
      // Remove version directory from path if present
      const cleanPath = path.replace(/^v[\d.]+\//, '');
      return `](${cleanPath})`;
    });

    // Fix links to other markdown files
    content = content.replace(/\]\(([^)]+\.md)\)/g, (match, path) => {
      // Convert .md links to clean paths for Docusaurus
      const cleanPath = path.replace('.md', '').replace(/^docs\//, '').replace(/^v[\d.]+\//, '');
      return `](${cleanPath})`;
    });

    // Fix anchor links
    content = content.replace(/\]\(([^)]*#[^)]+)\)/g, (match, path) => {
      if (path.startsWith('#')) {
        return match; // Keep same-page anchors as is
      }
      const cleanPath = path.replace('.md', '').replace(/^docs\//, '').replace(/^v[\d.]+\//, '');
      return `](${cleanPath})`;
    });

    return content;
  }

  /**
   * Clean internal link paths
   */
  cleanInternalLink(link) {
    if (link.startsWith('http')) {
      return link; // Keep external links as is
    }
    
    // Remove docs/ prefix and version directories
    let cleanLink = link.replace(/^docs\//, '').replace(/^v[\d.]+\//, '');
    
    // Remove .md extension
    cleanLink = cleanLink.replace('.md', '');
    
    return cleanLink;
  }

  /**
   * Fix markdown tables
   */
  fixTables(content) {
    // Ensure tables have proper spacing
    content = content.replace(/\|([^|\n]+)\|/g, (match, cell) => {
      return `| ${cell.trim()} |`;
    });

    // Fix table headers
    content = content.replace(/\|\s*-+\s*\|/g, '| --- |');

    return content;
  }

  /**
   * Fix code blocks
   */
  fixCodeBlocks(content) {
    // Ensure code blocks have language specification
    content = content.replace(/```\n((?:(?!```).|\n)*?)```/g, (match, code) => {
      // Try to detect language from content
      if (code.includes('class ') || code.includes('public ')) {
        return `\`\`\`java\n${code}\`\`\``;
      } else if (code.includes('{') && code.includes('}')) {
        return `\`\`\`json\n${code}\`\`\``;
      } else if (code.includes('<') && code.includes('>')) {
        return `\`\`\`xml\n${code}\`\`\``;
      }
      return `\`\`\`text\n${code}\`\`\``;
    });

    return content;
  }

  /**
   * Clean problematic HTML
   */
  cleanHtml(content) {
    // Remove empty paragraph tags
    content = content.replace(/<p>\s*<\/p>/g, '');
    
    // Remove standalone </p> tags
    content = content.replace(/^\s*<\/p>\s*$/gm, '');
    
    // Convert <br> tags to double newlines
    content = content.replace(/<br\s*\/?>/g, '\n\n');
    
    // Remove HTML comments
    content = content.replace(/<!--[\s\S]*?-->/g, '');

    return content;
  }

  /**
   * Fix heading formatting
   */
  fixHeadings(content) {
    // Ensure headings have proper spacing
    content = content.replace(/^(#{1,6})\s*(.+)$/gm, (match, hashes, title) => {
      const cleanTitle = title.replace(/\[\]\(\)$/, '').trim();
      return `${hashes} ${cleanTitle}`;
    });

    // Remove empty heading links
    content = content.replace(/## \[([^\]]+)\]\(\)/g, '## $1');

    return content;
  }

  /**
   * Fix version history tables
   */
  fixVersionTables(content) {
    // Improve version table formatting
    content = content.replace(/\|\s*Version\s*\|\s*Last Updated\s*\|\s*Author\s*\|\s*Release Note\s*\|/g, 
      '| Version | Last Updated | Author | Release Note |');
    
    content = content.replace(/\|\s*Version\s*\|\s*Supported SDK Version\s*\|/g,
      '| Version | Supported SDK Version |');

    return content;
  }

  /**
   * Add asset imports if needed
   */
  addAssetImports(content) {
    // This would be used if you need to import images or other assets
    // For now, we'll keep images as regular markdown
    return content;
  }

  /**
   * Generate summary report
   */
  generateReport() {
    console.log('\n📊 Conversion Summary:');
    console.log(`✅ Files processed: ${this.processedFiles.size}`);
    console.log('\nProcessed files:');
    Array.from(this.processedFiles).forEach(file => {
      console.log(`  - ${file}`);
    });
    
    console.log('\n📋 Next Steps:');
    console.log('1. Review converted files for any manual adjustments needed');
    console.log('2. Update sidebar configuration in docusaurus.config.js');
    console.log('3. Move images to static/ folder if needed');
    console.log('4. Test internal links and navigation');
    console.log('5. Adjust frontmatter sidebar_position values as needed');
  }
}

// Main execution
function main() {
  const converter = new DocusaurusConverter();
  
  // Get command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node docusaurus-converter.mjs <input-file-or-directory> [output-directory]');
    console.log('Examples:');
    console.log('  node docusaurus-converter.mjs README.md ./docs');
    console.log('  node docusaurus-converter.mjs ./docs ./converted-docs');
    process.exit(1);
  }

  const inputPath = args[0];
  const outputPath = args[1] || null;

  console.log('🚀 Starting Docusaurus conversion...\n');

  try {
    const stats = fs.statSync(inputPath);
    
    if (stats.isDirectory()) {
      converter.processDirectory(inputPath, outputPath);
    } else if (stats.isFile() && inputPath.endsWith('.md')) {
      converter.processFile(inputPath, outputPath);
    } else {
      console.error('❌ Input must be a .md file or directory');
      process.exit(1);
    }
    
    converter.generateReport();
    console.log('\n🎉 Conversion completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export default DocusaurusConverter;