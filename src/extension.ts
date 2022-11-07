// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { workspace, window, Range, commands, ExtensionContext } from 'vscode';
// const glob = require('glob');
// const path = require('path');
// const fs = require('fs');
const { i18nRe, getValByPath, debounce } = require('./core/utils');
import { SourceData } from './core/SourceData';
// const { Config } = require('./core/Config');

// const translateDataMap = {};

// function init() {
// 	let localesPaths = Config._localesPaths;
// 	if (!localesPaths) return;
// 	let rootPath = workspace.workspaceFolders?.[0].uri.fsPath;

// 	const watcher = workspace.createFileSystemWatcher(new RelativePattern(rootPath as string, Config._localesPaths));
// 	watcher.onDidChange(uri => {
// 		init();
// 		refresh();
// 		console.log('watcher.onDidChange: ', uri);
// 	});
// 	watcher.onDidCreate(uri => {
// 		init();
// 		refresh();
// 		console.log('watcher.onDidCreate: ', uri);
// 	});
// 	watcher.onDidDelete(uri => {
// 		init();
// 		refresh();
// 		console.log('watcher.onDidDelete: ', uri);
// 	});

// 	const tempDir = fs.mkdtempSync('translateData');

// 	const translateFiles = glob.sync(localesPaths, { cwd: rootPath });
// 	const TEMP_FILE = path.resolve(tempDir, 'TEMP.js');
// 	translateFiles.forEach(async (file: String) => {
// 		let filePath = path.resolve(rootPath, file);
// 		let content = fs.readFileSync(filePath, 'utf-8');
// 		content = content.replace('export default', 'module.exports = ');
// 		try {
// 			fs.writeFileSync(TEMP_FILE, content);
// 		} catch (err) { }
// 		delete require.cache[TEMP_FILE];
// 		const data = require(TEMP_FILE);
// 		Object.assign(translateDataMap, data);
// 	});
// }

let decorationsData = [];

let refresh = debounce(() => {
	window.visibleTextEditors.forEach(editor => {
		let content = editor.document.getText();
		if (decorationsData.length) { decorationsData.forEach(item => editor.setDecorations(item, [])); };
		while (i18nRe.test(content)) {
			let endStart = i18nRe.lastIndex - 4;
			let contentPart = content.substring(0, i18nRe.lastIndex);
			while (![`"`, `'`].includes(contentPart[endStart])) { endStart--; }
			let translateKey = content.slice(endStart + 1, i18nRe.lastIndex - 2);

			let text = getValByPath(translateKey, SourceData.translateDataMap);
			if (text) {
				let decoration = window.createTextEditorDecorationType({
					before: {
						color: '#494949',
						margin: '5px',
						contentText: text,
						textDecoration: 'none'
					}
				});

				decorationsData.push(decoration);

				let startPos = editor.document.positionAt(endStart + 1);
				let endPos = editor.document.positionAt(i18nRe.lastIndex - 1);
				const range = new Range(startPos, endPos);
				editor.setDecorations(decoration, [range]);
			}
		}
	});
}, 500);

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	// init();
	SourceData.update();
	SourceData.watchFile();

	workspace.onDidChangeTextDocument(e => {
		refresh();
	});
	workspace.onDidChangeConfiguration(SourceData.update);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = commands.registerCommand('helloworld.helloWorld22222', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		window.showWarningMessage('Hello Vs code!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
