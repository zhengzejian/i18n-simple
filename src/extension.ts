// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const glob = require('glob');
const path = require('path');
const fs = require('fs');

const translateDataMap = {};
let translatedData = {};

let isObject = val => typeof val === 'object' && typeof val !== null;
let i18nRe = /\$t\(('|")([^'"]+)\1\)/g;
let isUndef = val => val === undefined;

function escapeSpecialCharacter(str) {
    const pattern = /[\^.\-\+\\\$\(\)\*\[\]\?\{\}\|\?]/g;
    return str.replace(pattern, match => '\\' + match);
}

function stripBOM(content) {
    // 检测第一个字符是否为BOM   
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }
    return content;
}

function getValByPath(key, source, defaultVal) {
    let arr = key.split('.');
    let tempObj = source[stripBOM(arr.shift())];
    while (arr.length) {
        if (!tempObj) {break;};
        tempObj = tempObj[stripBOM(arr.shift())];
    }
    return isUndef(tempObj) ? defaultVal : tempObj;
}

function init() {
	const tempDir = fs.mkdtempSync('translateData');
	let rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
	const translateFiles = glob.sync(`src/i18n/langs/modules/**/*@(_zh).js`, {cwd: rootPath});
	const TEMP_FILE = path.resolve(tempDir, 'TEMP.js');
	translateFiles.forEach(async (file: String) => {
		let filePath= path.resolve(rootPath, file);
		let content = fs.readFileSync(filePath, 'utf-8');
		content = content.replace('export default', 'module.exports = ');
		try {
			fs.writeFileSync(TEMP_FILE, content);
		} catch (err) {}
		delete require.cache[TEMP_FILE];
		const data = require(TEMP_FILE);
		Object.assign(translateDataMap, data);
	});

	translatedData = ((source) => {
		let map = {};
		let fn = (val, preKey) => {
			if (isObject(val)) {
				Object.keys(val).forEach(key => fn(val[key], `${preKey}.${key}`));
			} else {
				map[val] = preKey;
			}
		};
		Object.keys(source).forEach(key => fn(translateDataMap[key], key));
		return map;
	})(translateDataMap);
}

let decorationsData = [];

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	init();
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');
    console.log('vscode.window.visibleTextEditors: ', vscode.window.visibleTextEditors);
	

	vscode.workspace.onDidChangeTextDocument(e => {
		// init();
		vscode.window.visibleTextEditors.forEach(editor => {
			let content = editor.document.getText();

			// let translateContent = content.match(i18nRe) || []
			// let isReplaced = false
			// translateContent.forEach(item => {
			// 	let copywriting = item.replace(i18nRe, '$2')

			// 	let key = translatedData[copywriting]
			// 	if (key) {
			// 		copywriting = escapeSpecialCharacter(copywriting)
			// 		let re = `(\\$t\\(('|"))${copywriting}(\\2\\))`
			// 		content = content.replace(new RegExp(re), `$1${key}$3`)
			// 		isReplaced = true
			// 	}
			// })

			if (decorationsData.length) {decorationsData.forEach(item => editor.setDecorations(item, []));};

			let translateContent = content.match(i18nRe) || [];
			translateContent = translateContent.map(item => item.replace(i18nRe, '$2'));
			let notTranslateKeyArr = translateContent.filter(key => {
				let text = getValByPath(key, translateDataMap);
				if (text) {
					let start = content.indexOf(key);
					let end = start + key.length;

					

					let decoration = vscode.window.createTextEditorDecorationType({
						before: {
							color: '#494949',
							margin: '5px',
							contentText: text,
							textDecoration: 'none'
						}
					});

					decorationsData.push(decoration);

					let startPos = editor.document.positionAt(start);
					let endPos = editor.document.positionAt(end);
					const range = new vscode.Range(startPos, endPos);
					editor.setDecorations(decoration, [range]);
				}
			});

			
		});
		// console.log('onDidChangeTextDocument: ', e)
	});
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('helloworld.helloWorld22222', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showWarningMessage('Hello Vs code!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
