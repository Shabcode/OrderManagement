import replace from 'replace-in-file';
import fs from 'fs';
import util from 'node:util';
import { exec as exec0 } from 'node:child_process';

const exec = util.promisify(exec0);

const appNameValidator = /^[a-z0-9]+$/g;

const removeTemplateProjectFiles = () => {
    fs.rmSync('ToDos.md', { force: true });
};

const replaceAppNameInFiles = appName => {
    if (!appName || !appNameValidator.test(appName)) {
        console.error(
            'Please provide a valid app name for the replacement. App name must consist of alphanumeric characters. It should be lower case only.',
        );
        return false;
    }

    const options = {
        glob: {
            windowsPathsNoEscape: true,
        },
        files: [
            '**/*.json',
            '**/*.yaml',
            '**/*.yml',
            '**/*.html',
            '**/pom.xml',
            '**/*.java',
            '**/*.cds',
            'node_modules/.package-lock.json',
            '**/docker-compose.yaml',
            '**/example-data-h2.sql',
            'README-template.md',
        ],
        ignore: ['node_modules/**/*', '**/node_modules/**/*'],
        from: /\\?_\\?_app_name\\?_\\?_/g,
        to: appName,
    };

    try {
        console.info(`Start replacement of app name with ${appName}...`);
        const results = replace
            .sync(options)
            .filter(r => r.hasChanged)
            .map(result => result.file);
        console.info('Successfully replaced the app name in these files:', results);

        fs.renameSync('backend/db/data/__app_name__-Dummy.csv', `backend/db/data/${appName}-Dummy.csv`);

        return results.length > 0;
    } catch (e) {
        console.error('Replacement of app name failed:', e);
        return false;
    }
};

const removeGitFolder = () => {
    fs.rmSync('.git', { force: true, recursive: true });
};

const replaceReadme = () => {
    fs.rmSync('README.md', { force: true });
    fs.readdirSync('.')
        .filter(fn => fn.startsWith('_init_'))
        .forEach(f => {
            fs.rmSync(f, { force: true });
        });
    fs.renameSync('README-template.md', 'README.md');
};

const setupNewGit = async () => {
    await exec('git init --initial-branch=main');
    console.info(
        'Initialized new git folder - please set your own origin using e.g. "git remote add origin git@ssh.dev.azure.com:v3/cronos/cronos%20customer%20experience/meinprojekt".',
    );
    await exec('git update-index --add --chmod=+x ./mvnw');
};

const initHusky = async () => {
    // "Prepare" is called after npm install and will add a git commit hook.
    // But: when npm install is called, we are still on the "template" git repo, which we delete in "setupNewGit".
    // Thus, we need to install the commit hook again in the new git repo.
    console.info('Running "npm run prepare" to initialize husky ...');
    await exec('npm run prepare');
    console.info('... prepare finished.');
};

const firstRun = replaceAppNameInFiles(process.argv[2]);

if (firstRun) {
    removeTemplateProjectFiles();
    removeGitFolder();
    replaceReadme();
    await setupNewGit();
    await initHusky();
}
