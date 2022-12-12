import * as SourceControlProvider from './parts/SourceControlProvider/SourceControlProvider.js'

export const activate = async () => {
  vscode.registerSourceControlProvider(SourceControlProvider)
}
