// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const glob = require('glob');
const path = require('path');

function init() {
	const translateDataMap = {};
	let rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    console.log('rootPath: ', rootPath);
	const translateFiles = glob.sync(`src/i18n/langs/modules/**/*@(_zh).js`, {cwd: rootPath});
	console.log(__dirname);
	console.log('fs: ', vscode.workspace.fs);
	console.log('vscode.workspace: ', vscode.workspace);
	translateFiles.forEach(async (file: String) => {
		let aa= path.resolve(rootPath, file);
		try {
			let data = await import(aa);
			Object.assign(translateDataMap, data);
		}catch(err) {
			console.log(err);
		}
	});
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	init();
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');
	console.log('vscode.window.visibleTextEditors: ', vscode.window.visibleTextEditors);
	vscode.window.visibleTextEditors.forEach(editor => console.log('editor: ', typeof editor.document.getText()));

	vscode.workspace.onDidChangeTextDocument(e => {
		init();
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
