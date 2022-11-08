import { workspace, window, Range, commands, ExtensionContext } from 'vscode';
import { SourceData } from './core/SourceData';
import { debounceTranslate } from './core/Translator';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	SourceData.update();

	workspace.onDidChangeTextDocument(debounceTranslate);
	workspace.onDidOpenTextDocument(debounceTranslate);
	workspace.onDidChangeConfiguration(SourceData.update);
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	// context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
