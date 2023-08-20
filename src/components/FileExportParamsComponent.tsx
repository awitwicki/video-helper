import {useAtom} from "jotai";
import Select from 'react-select';
import { settingsAtom } from '../atoms/exportSettings';
import {useEffect} from "react";

function FileExportParamsComponent() {
  
  const fileFormatOptions: { value: string; label: string }[] = [
    { value: 'mp4', label: 'mp4' },
    { value: 'avi', label: 'avi' }
  ];

  const [, setValue] = useAtom(settingsAtom);
  
  const handleFileOutputTypeChange = (newValue: { value: string; label: string }, actionMeta: any) => {
    setValue(newValue.value)
  };

  useEffect(() => {
    setValue(fileFormatOptions[0].value)
  }, [])


  return (
      <>
        <div className="my-4">
          <label className="mb-2 inline-block text-neutral-700 dark:text-neutral-200">
            Select File format
          </label>
          <Select
              defaultValue={fileFormatOptions[0]}
              onChange={handleFileOutputTypeChange}
              options={fileFormatOptions}
          />
        </div>
      </>)
}

export default FileExportParamsComponent
