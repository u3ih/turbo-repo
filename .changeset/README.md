# A Complete Guide to the changesets Workflow

This guide covers the end-to-end process for versioning and publishing packages in a monorepo using changesets. Following these steps ensures your package versions are updated correctly, changelogs are generated automatically, and packages are published reliably.

## The Core Workflow

The changesets process can be broken down into a simple loop: **Code -> Changeset -> Version -> Publish**.

### Step 1: Make Your Code Changes

This is your normal development process. Edit the code in your packages, fix bugs, or add new features.

### Step 2: Create a Changeset

Once you're ready to save a piece of work, you create a "changeset". This is a small file that records your intent to release a new version.

Run the following command at the root of your repository:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npx changeset   `

You will be guided through an interactive prompt:

1.  **Select Packages**: Use the arrow keys and spacebar to select all the packages that you modified.
2.  **Select Version Type**: You will be asked which packages should get a **major**, **minor**, or **patch** bump.
    - **major (e.g., 1.5.2 -> 2.0.0)**: For breaking changes that will require users to update their code.
    - **minor (e.g., 1.5.2 -> 1.6.0)**: For new, backward-compatible features.
    - **patch (e.g., 1.5.2 -> 1.5.3)**: For backward-compatible bug fixes.Press Enter to skip a version type and spacebar to select packages for the current type.

3.  **Write a Summary**: Enter a short message describing the change. This message will be automatically added to the CHANGELOG.md file for each selected package.

A new markdown file with a unique name (e.g., silly-bugs-applaud.md) will be created in the .changeset/ directory.

### Step 3: Commit the Changeset File

Add the newly created changeset file to Git and commit it. It's best practice to create a changeset with every feature or bug fix pull request.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   git add .changeset/  git commit -m "feat(button): add new icon property"   `

### Step 4: Version Your Packages

This is the step that consumes all the changeset files and prepares your packages for release. It's typically done on your main branch after merging one or more pull requests containing changesets.

Run the version command:

Plain `   npx changeset version   `

This command does two things:

1.  Deletes all the individual .md files in the .changeset directory.
2.  Updates the version field in the package.json of each package that had a changeset.
3.  Updates the CHANGELOG.md file for each updated package with the summaries from the changeset files.

### Step 5: Commit the Version Updates

The version command modifies files in your project. You need to commit these changes.

Plain `   git add .  git commit -m "chore: version packages for release"   `

### Step 6: Publish the Packages

This is the final step that pushes your packages to the npm registry. changesets is smart enough to only publish packages whose local version is newer than the version on npm.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npx changeset publish   `

The command will prompt you for an npm OTP (one-time password) if you have two-factor authentication enabled.

### Step 7: Push to Git

After publishing, changesets may create new Git tags for the release. Push your commits and the new tags to your remote repository.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   git push --follow-tags   `

## Troubleshooting Common Issues

### "No unpublished projects to publish"

This is the most common warning. It means you ran npx changeset publish, but changesets determined there was nothing to do. There are two primary causes:

1.  **You forgot to run npx changeset version**: The publish command compares the version in your local package.json to the version on npm. If you haven't run version, these are the same, so there's nothing to publish.
2.  **The package is private**: Check the package's package.json for "private": true. Private packages are correctly versioned for local use but will not be published. Remove this line if you intend for the package to be public.

### I chose the wrong version type (e.g., major instead of patch)

You don't need to delete the changeset and start over. Simply open the .md file in the .changeset/ directory and edit it directly.

Change this:

\--- "my-package": major --- My summary.

To this:

Plain `   ---  "my-package": patch  ---  My summary.   `

Then commit the change.
