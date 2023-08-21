import { useAtom } from "jotai";
import Select from 'react-select';
import { settingsAtom } from '../atoms/exportSettings';
import { FileFormatOptions } from "../helpers/FileFormatOptions";
import { ExportSettings } from "../models/ExportSettings";

function FileExportParamsComponent() {
  const [, setValue] = useAtom(settingsAtom);
  
  const handleFileOutputTypeChange = (newValue: { value: string; label: string }, actionMeta: any) => {
    const newSettings = new ExportSettings(newValue.value)
    setValue(newSettings)
  };

  return (
      <>
        <div className="my-4">
          <label className="mb-2 inline-block text-neutral-700 dark:text-neutral-200">
            Select File format
          </label>
          <Select
              defaultValue={FileFormatOptions[0]}
              onChange={handleFileOutputTypeChange}
              options={FileFormatOptions}
          />
        </div>
      </>)
}

export default FileExportParamsComponent
