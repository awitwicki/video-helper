import { useAtom } from "jotai";
import Select, {SingleValue} from 'react-select';
import { settingsAtom } from '../atoms/exportSettings';
import { FileFormatOptions } from "../helpers/FileFormatOptions";
import { CodecOptions } from "../helpers/codecOptions";
import { ExportSettings } from "../models/ExportSettings";
import { useState } from "preact/hooks";

function FileExportParamsComponent() {
  const [settings, setValue] = useAtom(settingsAtom);
  const [isTrimFromValid, setTrimFromIsValid] = useState(true);
  const [isTrimToValid, setTrimToIsValid] = useState(true);
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

  const handleTrimFromChange = (event: any) => {
      const input = event.target.value;
      const regex = /^(?:(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d|\d+):[0-5]\d:[0-5]\d$/
      const isValid = regex.test(input)

      setTrimFromIsValid(isValid)
      
      if (isValid) {
          settings.setTrimFrom(event.target.value)
          setValue(settings)
      }
  };

  const handleTrimToChange = (event: any) => {
      const input = event.target.value;
      const regex = /^(?:(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d|\d+):[0-5]\d:[0-5]\d$/
      const isValid = regex.test(input)

      setTrimToIsValid(isValid)

      if (isValid) {
          settings.setTrimTo(event.target.value)
          setValue(settings)
      }
  };

  return (
      <div className="w-full max-w-sm">
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
                  <input type="text"
                         className={`bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight bg-white" id="inline-full-name ${isTrimFromValid ? '' : 'border-red-500'}`}
                         placeholder="HH:MM:SS"
                         onChange={handleTrimFromChange}
                  />
              </div>
              <div>
                  <label className="mb-2 inline-block text-neutral-700 dark:text-neutral-200">
                      Trim to (optional)
                  </label>
                  <input type="text"
                         className={`bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight bg-white" id="inline-full-name ${isTrimToValid ? '' : 'border-red-500'}`}
                         placeholder="HH:MM:SS"
                         onChange={handleTrimToChange}
                  />
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
