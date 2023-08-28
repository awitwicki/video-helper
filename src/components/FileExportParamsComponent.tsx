import { useAtom } from "jotai";
import Select, {SingleValue} from 'react-select';
import { settingsAtom } from '../atoms/exportSettings';
import { FileFormatOptions } from "../helpers/FileFormatOptions";
import { CodecOptions } from "../helpers/codecOptions";
import { ExportSettings } from "../models/ExportSettings";
import TimeSpanInput from "./TimeSpanInputComponent";

function FileExportParamsComponent() {
  const [settings, setValue] = useAtom(settingsAtom);
  const handleFileOutputTypeChange = (newValue: SingleValue<{ value: string; label: string; }>, actionMeta: any) => {
    const newSettings = new ExportSettings(newValue!.value)
    setValue(newSettings)
  };

  const handleCodecChange = (newValue: SingleValue<{ value: string; label: string; }>, actionMeta: any) => {
      settings.setCodec(newValue!.value)
      setValue(settings)
  };

  const handleBitrateChange = (event: any) => {
      settings.setBitrate(Number(event.target.value))
      setValue(settings)
  };

  const handleAudioVolumeChange = (event: any) => {
      settings.setSound(Number(event.target.value) / 100)
      setValue(settings)
  };

  const handleTrimFromChange = (newValue: string, isValid: boolean) => {
      const value: string | null = isValid ? newValue : null
      settings.setTrimFrom(value)
      setValue(settings)
  };

  const handleTrimToChange = (newValue: string, isValid: boolean) => {
      const value: string | null = isValid ? newValue : null
      settings.setTrimTo(value)
      setValue(settings)
  };

  return (
      <div className="w-2/6">
          <div className="my-4">
              <label className="mb-2 inline-block text-neutral-700 dark:text-neutral-200">
                  Select max video bitrate kbps
              </label>
              <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight bg-white" id="inline-full-name" type="number"
                onChange={handleBitrateChange}
                placeholder="As original"
                min="1"
                max="50000"
              />
          </div>
          <div className="my-4">
              <label className="mb-2 inline-block text-neutral-700 dark:text-neutral-200">
                  Select audio volume percent (0..200)
              </label>
              <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight bg-white" id="inline-full-name" type="number"
                     onChange={handleAudioVolumeChange}
                     placeholder="As original"
                     min="0"
                     max="200"
              />
          </div>
          <div className="my-4 columns-2">
              <div>
                  <label className="mb-2 inline-block text-neutral-700 dark:text-neutral-200">
                      Trim from (optional)
                  </label>
                  <TimeSpanInput onChange={handleTrimFromChange} />
              </div>
              <div>
                  <label className="mb-2 inline-block text-neutral-700 dark:text-neutral-200">
                      Trim to (optional)
                  </label>
                  <TimeSpanInput onChange={handleTrimToChange} />
              </div>
          </div>
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
      </div>)
}

export default FileExportParamsComponent
