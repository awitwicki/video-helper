import { atom } from 'jotai'
import { DefaultExportSettings } from "../helpers/ExportSettingsBuilder";

export const settingsAtom = atom(DefaultExportSettings())
