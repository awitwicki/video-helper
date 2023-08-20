// import 'src/components/App.css'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import {useEffect, useRef} from "preact/compat";
import {useState} from "react";
import {fetchFile, toBlobURL} from "@ffmpeg/util";
import Select, {ActionMeta, SingleValue} from 'react-select';

function FFmpegComponent() {
  const [input, setInput] = useState<File | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());

  let selectedOption: string 
  
  const options: { value: string; label: string }[] = [
    { value: 'mp4', label: 'mp4' },
    { value: 'avi', label: 'avi' }
  ];

  const handleFileOutputTypeChange = (newValue: SingleValue<string>, actionMeta: ActionMeta<string>) => {
    selectedOption = newValue.value;
  };
  
  const load = async () => {
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({message}) => {
      console.log(message)
    });

    // const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.2/dist/esm";
    //https://unpkg.com/@ffmpeg/core-mt@0.12.2/dist/esm/ffmpeg-core.js
    //https://unpkg.com/@ffmpeg/core-mt@0.12.2/dist/esm/ffmpeg-core.wasm
    //https://unpkg.com/@ffmpeg/core-mt@0.12.2/dist/esm/ffmpeg-core.worker.js
    
    const jsCoreUrl = '/ffmpeg/ffmpeg-core.js'
    const wasmCoreUrl = '/ffmpeg/ffmpeg-core.wasm'
    const jsWorkerUrl = '/ffmpeg/ffmpeg-core.worker.js'

    const jsCore = await toBlobURL(jsCoreUrl, 'text/javascript')
    const wasmCore = await toBlobURL(wasmCoreUrl, 'application/wasm')
    const workerCore = await toBlobURL(jsWorkerUrl, 'text/javascript')

    await ffmpeg.load(
        {
          coreURL: jsCore,
          wasmURL: wasmCore,
          workerURL: workerCore,
        }
    )

    setLoaded(true)
  }

  useEffect(() => {
    load(); // Call the async method automatically when the component mounts
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const transcode = async () => {
    if (!input) {
      console.log('Video file not assigned') // Check if this message is printed
      return
    }

    try {
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.writeFile('input.avi', await fetchFile(input))
      const outputFilename = `output.${selectedOption}`
      console.log(outputFilename)
      await ffmpeg.exec(['-i', 'input.avi', outputFilename])
      const outputData = await ffmpeg.readFile(outputFilename)

      // Convert Uint8Array to Blob and create a URL for the video
      const outputBlob = new Blob([outputData], {type: 'video/mp4'});
      const outputUrl = URL.createObjectURL(outputBlob);

      setOutput(outputUrl);
    } catch (error) {
      console.error('Error converting video:', error);
    }
  }

  const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      setInput(target.files[0])
    }
  }

  return (loaded ? (
      <>
        <div class="mb-3">
          <label for="formFile" class="mb-2 inline-block text-neutral-700 dark:text-neutral-200">
            Default file input example
          </label>
          <input 
              class="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
              type="file"
              accept="video/*"
              onChange={handleFileChange} />
        </div>
        <br/>
        <div className="my-4">
          <Select
              defaultValue={selectedOption}
              onChange={handleFileOutputTypeChange}
              options={options}
              defaultValue={options[0]}
          />
        </div>
        {input && <button class="btn" onClick={transcode}>Transcode to mp4</button>}
        {output && <video controls src={output}/>}
      </>
  ) : (
      <span>Loading...</span>
  ))
}

export default FFmpegComponent
