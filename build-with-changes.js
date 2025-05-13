const { execSync } = require('child_process');

try {
    // Get the list of changed files in the last commit
    const changedFiles = execSync('git diff --name-only HEAD~1 HEAD').toString().split('\n').filter(Boolean);
    
    // Directories to check (just the relevant subpaths)
    const watchDirs = ['mapping', 'analytics']; // Directories to track for changes

    // Check if any of the changed files are in the watched directories
    const shouldRebuild = changedFiles.some(file => {
        const relativeFilePath = file.replace(/^docusaurus\//, ''); // Remove the leading 'docusaurus/'
        return watchDirs.some(dir => relativeFilePath.startsWith(dir)); // Match with watched dirs
    });

    if (shouldRebuild) {
        console.log('Changes detected in watched directories, rebuilding...');
        // Change the working directory and run the build command
        execSync('cd /var/www/html/docusaurus/docusaurus && npm run build', { stdio: 'inherit' });
    } else {
        console.log('No changes detected in watched directories, skipping build.');
    }
} catch (error) {
    console.error('Error during build process:', error.message);
    process.exit(1); // Exit with error
}
