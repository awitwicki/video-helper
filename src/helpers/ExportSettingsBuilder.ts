import { ExportSettings } from "../models/ExportSettings";
import { FileFormatOptions } from "./FileFormatOptions";

export const DefaultExportSettings = (): ExportSettings => {
    return new ExportSettings(FileFormatOptions[0].value);
};
