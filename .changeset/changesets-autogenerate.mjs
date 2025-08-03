import fs from 'fs';

// ===================================================================
//                        --- THE FIX ---
// Husky passes the path to the commit message file as an argument.
// We read that file instead of using `git log`.
// ===================================================================
const commitMessageFilePath = process.argv[2];
if (!commitMessageFilePath) {
  // This will prevent the script from crashing if run manually
  console.log('This script is intended to be run by a git hook. Aborting.');
  process.exit(0);
}
const commitMessage = fs.readFileSync(commitMessageFilePath, 'utf-8').trim();


// ===================================================================
//          --- The rest of your script is perfect ---
// ===================================================================

// Define valid scopes
const validScopes = ['i18n'];

// Define regex patterns
const commitPatterns = {
  major: /^BREAKING CHANGE: (.+)/m, // Added 'm' flag for multiline
  minor: /^feat\(([^)]+)\): (.+)/,
  patch: /^fix\(([^)]+)\): (.+)/,
};

// Identify type, package, and description
let packageName = null;
let changeType = null;
let description = null;

if (commitPatterns.major.test(commitMessage)) {
  changeType = 'major';
  description = commitMessage.match(commitPatterns.major)?.[1];
} else if (commitPatterns.minor.test(commitMessage)) {
  const scope = commitMessage.match(commitPatterns.minor)?.[1];
  if (validScopes.includes(scope)) {
    changeType = 'minor';
    packageName = scope;
    description = commitMessage.match(commitPatterns.minor)?.[2];
  }
} else if (commitPatterns.patch.test(commitMessage)) {
  const scope = commitMessage.match(commitPatterns.patch)?.[1];
  if (validScopes.includes(scope)) {
    changeType = 'patch';
    packageName = scope;
    description = commitMessage.match(commitPatterns.patch)?.[2];
  }
}

// If a valid change was found, create the changeset file
if (changeType && description) {
  if (changeType === 'major' && !packageName) {
    console.log('⚠️ Major change detected, but no package scope found. Manual changeset needed.');
  } else if (packageName) {
    packageName = packageName.trim();
    description = description?.trim() || 'No description provided.';

    // Ensure the .changeset directory exists
    if (!fs.existsSync('.changeset')) {
        fs.mkdirSync('.changeset');
    }

    const changesetContent = `---
'@carfromjapan/${packageName}': ${changeType}
---
${description}
`;
    const fileName = `.changeset/auto-generated-${Date.now()}.md`;
    fs.writeFileSync(fileName, changesetContent);
    console.log(`✅ Changeset file created: ${fileName}`);
  }
} else {
  console.log('No conventional commit message found that requires a changeset. Skipping.');
}
