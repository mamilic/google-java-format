import * as cp from "child_process";
import * as vscode from 'vscode';
import * as path from 'path';

const outputChannel = vscode.window.createOutputChannel("java-google-format");

class GoogleJavaFormattingProvider implements vscode.DocumentRangeFormattingEditProvider {
  private jarPath: string;

  constructor(jarPath: string) {
    this.jarPath = jarPath;
  }

  provideDocumentRangeFormattingEdits(
    document: vscode.TextDocument,
    range: vscode.Range,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TextEdit[]> {

    outputChannel.appendLine(
      `Formatting ${document.fileName} from ${range.start.line} to ${range.end.line}`
    );

    return new Promise((resolve, reject) => {
      let stdout = "";
      let stderr = "";

      let child = cp.spawn("java",
        [
          "-jar",
          this.jarPath,
          "--lines",
          `${range.start.line}:${range.end.line}`,
          "-"
        ]);

      child.stdout.on("data", (chunk) => (stdout += chunk));
      child.stderr.on("data", (chunk) => (stderr += chunk));

      child.on("error", (err) => {
        vscode.window.showErrorMessage(
          `Could not run google-java-format: ${err}`
        );
        return reject(err);
      });

      child.on("close", (retcode) => {
        if (stderr.length > 0) {
          outputChannel.appendLine(stderr);
          const fileName = path.basename(document.fileName);
          vscode.window.showErrorMessage('Java Google Format failed. Does ' + fileName + ' have syntax errors?');
          return reject("Failed to format file");
        }

        if (retcode !== 0) {
          return reject("Failed to format file");
        }

        return resolve([
          new vscode.TextEdit(
            new vscode.Range(0, 0, document.lineCount + 1, 0),
            stdout
          ),
        ]);
      });

      child.stdin.write(document.getText(), (err) => {
        if (err) {
          outputChannel.appendLine(err.message);
        }
        child.stdin.end();
      });
    });
  }
}

export default GoogleJavaFormattingProvider;