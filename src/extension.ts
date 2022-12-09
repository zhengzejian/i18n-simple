import { workspace, window, Range, commands, ExtensionContext } from 'vscode';
import { SourceData } from './core/SourceData';
import { debounceTranslate } from './core/Translator';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	SourceData.update();


	let disposableChangeActive = window.onDidChangeActiveTextEditor(debounceTranslate);
	let disposableChangeText = workspace.onDidChangeTextDocument(debounceTranslate);
	let disposableChangeOpen = workspace.onDidOpenTextDocument(debounceTranslate);
	let disposableChangeConfig = workspace.onDidChangeConfiguration(SourceData.update);

	[disposableChangeActive, disposableChangeText, disposableChangeOpen, disposableChangeConfig]
		.forEach(disposable => context.subscriptions.push(disposable));
}

// This method is called when your extension is deactivated
export function deactivate() { }
