import {
  activate as activateExtensionApi,
  registerSourceControlProvider,
} from '@lvce-editor/api'
import * as SourceControlProvider from '../SourceControlProvider/SourceControlProvider.js'

const state = {
  isActivated: false,
}

export const activate = async () => {
  if (state.isActivated) {
    return
  }
  state.isActivated = true
  await activateExtensionApi()
  registerSourceControlProvider(SourceControlProvider)
}

export const deactivate = () => {}
