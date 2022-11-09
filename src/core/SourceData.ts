const path = require('path');
const fs = require('fs');
const { Config } = require('./Config');
import { workspace, RelativePattern, FileSystemWatcher, Uri } from 'vscode';

export class SourceData {

    static translateDataMap = {};
    static watcher: FileSystemWatcher;

    static async update() {

        let rootPath = SourceData.getRootPath();
        SourceData.translateDataMap = {};
        if (!rootPath) return;
        const translateFiles = await workspace.findFiles(new RelativePattern(rootPath as string, Config.localesPaths));
        if (!Config.localesPaths) return;
        const tempDir = fs.mkdtempSync('translateData');
        const TEMP_FILE = path.resolve(tempDir, 'TEMP.js');
        translateFiles.forEach(async (item: Uri) => {
            let content = fs.readFileSync(item.fsPath, 'utf-8');
            content = content.replace('export default', 'module.exports = ');
            try {
                fs.writeFileSync(TEMP_FILE, content);
            } catch (err) { }
            delete require.cache[TEMP_FILE];
            const data = require(TEMP_FILE);
            Object.assign(SourceData.translateDataMap, data);
        });
        SourceData.watchFile();
        fs.rm(tempDir, { recursive: true, force: true }, (err: any) => err && console.log(`TEMP File deletion failed: ${err}`));
    }

    static watchFile() {
        SourceData.watcher?.dispose();
        let rootPath = SourceData.getRootPath();
        if (!rootPath) return;

        const watcher = workspace.createFileSystemWatcher(new RelativePattern(rootPath as string, Config.localesPaths));

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
