// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as cp from 'child_process';
import * as vscode from 'vscode';
import GoogleJavaFormattingProvider from './googleJavaFormattingProvider';

const documentFilter: vscode.DocumentFilter = {
  language: "java",
  scheme: "file",
};

export function activate(context: vscode.ExtensionContext) {
  cp.exec('java -version', (error, stdout, stderr) => {
    if (error) {
      vscode.window.showErrorMessage('Java is not available. Please install Java and try again.');
      return;
    }

    const googleJavaFormatFilePath = context.asAbsolutePath('lib/google-java-format-1.22.0-all-deps.jar');

    context.subscriptions.push(
      vscode.languages.registerDocumentRangeFormattingEditProvider(
        documentFilter,
        new GoogleJavaFormattingProvider(googleJavaFormatFilePath)
      )
    );
  });
}

// This method is called when your extension is deactivated
export function deactivate() { }
