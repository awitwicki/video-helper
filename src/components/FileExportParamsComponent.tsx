import { useAtom } from "jotai";
import Select from 'react-select';
import { settingsAtom } from '../atoms/exportSettings';
import { FileFormatOptions } from "../helpers/FileFormatOptions";
import { CodecOptions } from "../helpers/codecOptions";
import { ExportSettings } from "../models/ExportSettings";

function FileExportParamsComponent() {
  const [settings, setValue] = useAtom(settingsAtom);
  
  const handleFileOutputTypeChange = (newValue: { value: string; label: string }, actionMeta: any) => {
    const newSettings = new ExportSettings(newValue.value)
    setValue(newSettings)
  };

  const handleCodecChange = (newValue: { value: string; label: string }, actionMeta: any) => {
      settings.setCodec(newValue.value)
      setValue(settings)
  };

  return (
      <>
        <div className="my-4">
          <label className="mb-2 inline-block text-neutral-700 dark:text-neutral-200">
            Select file format
          </label>
          <Select
              defaultValue={FileFormatOptions[0]}
              onChange={handleFileOutputTypeChange}
              options={FileFormatOptions}
          />
        </div>
          <div className="my-4">
              <label className="mb-2 inline-block text-neutral-700 dark:text-neutral-200">
                  Select file codec
              </label>
              <Select
                  defaultValue={CodecOptions[0]}
                  onChange={handleCodecChange}
                  options={CodecOptions}
              />
          </div>
      </>)
}

export default FileExportParamsComponent
