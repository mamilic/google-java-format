// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import GoogleJavaFormattingProvider from './GoogleJavaFormattingProvider';

const documentFilter: vscode.DocumentFilter = {
	language: "java",
	scheme: "file",
};

export function activate(context: vscode.ExtensionContext) {

	const googleJavaFormatFilePath = context.asAbsolutePath('lib/google-java-format-1.19.1-all-deps.jar');

	context.subscriptions.push(
		vscode.languages.registerDocumentRangeFormattingEditProvider(
			documentFilter,
			new GoogleJavaFormattingProvider(googleJavaFormatFilePath)
		)
	);
}

// This method is called when your extension is deactivated
export function deactivate() { }
