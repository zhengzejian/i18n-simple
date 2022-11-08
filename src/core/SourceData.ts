const glob = require('glob');
const path = require('path');
const fs = require('fs');
const { Config } = require('./Config');
import { workspace, RelativePattern, FileSystemWatcher } from 'vscode';

export class SourceData {

    static translateDataMap = {};
    static watcher: FileSystemWatcher;

    static update() {

        let rootPath = SourceData.getRootPath();
        SourceData.translateDataMap = {};
        if (!rootPath) return;

        const tempDir = fs.mkdtempSync('translateData');
        const translateFiles = glob.sync(Config._localesPaths, { cwd: rootPath });
        const TEMP_FILE = path.resolve(tempDir, 'TEMP.js');
        translateFiles.forEach(async (file: String) => {
            let filePath = path.resolve(rootPath, file);
            let content = fs.readFileSync(filePath, 'utf-8');
            content = content.replace('export default', 'module.exports = ');
            try {
                fs.writeFileSync(TEMP_FILE, content);
            } catch (err) { }
            delete require.cache[TEMP_FILE];
            const data = require(TEMP_FILE);
            Object.assign(SourceData.translateDataMap, data);
        });
    }

    static watchFile() {
        SourceData.watcher?.dispose();
        let rootPath = SourceData.getRootPath();
        if (!rootPath) return;

        const watcher = workspace.createFileSystemWatcher(new RelativePattern(rootPath as string, Config._localesPaths));

        watcher.onDidChange(SourceData.update);
        watcher.onDidCreate(SourceData.update);
        watcher.onDidDelete(SourceData.update);

        SourceData.watcher = watcher;
    }

    static getRootPath(): String | undefined {
        let rootPath = workspace.workspaceFolders?.[0].uri.fsPath;
        return rootPath;
    }
}
