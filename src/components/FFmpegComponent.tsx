// import 'src/components/App.css'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { useAtom } from 'jotai'
import { useEffect, useRef } from 'preact/compat'
import { useState } from 'react'

import { settingsAtom } from '../atoms/exportSettings'
import {
  GenerateFfmpegCommandString,
  GenerateFfmpegNormalizedCommandString
} from '../helpers/ExportSettingsFFmpegParamsBuilder'
import {ffmpegCommandAtom} from "../atoms/ffmpegCommand";
import {FaSpinner} from "react-icons/fa";
import { IconContext } from 'react-icons'

function FFmpegComponent() {
  const errorModalRef = useRef<HTMLDialogElement | null>(null);
  const [input, setInput] = useState<File | null>(null)
  const [output, setOutput] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState("")
  const [ffmpegCommandValue , setFfmpegCommand] = useAtom(ffmpegCommandAtom);
  const ffmpegRef = useRef(new FFmpeg())

  const [settings, setFfmpegSettings] = useAtom(settingsAtom)
  const [fileSizeExceeded, setFileSizeExceeded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileSizeWarning, setFileSizeWarning] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [clickToCopyText, setClickToCopyText] = useState('Click to copy');
  const maxFileSizeForNormalWork = 10; // MB
  const maxFileSize = 2000; // MB

  const load = async () => {
    const ffmpeg = ffmpegRef.current
    
    ffmpeg.on('log', ({ message }) => {
      console.log(message)
    })

    ffmpeg.on("progress", ({ progress }) => {
      setProgress(`Processing... complete: ${(progress * 100.0).toFixed(2)}% [Experimental]`)
    })

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/esm'

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    setLoaded(true)
  }

  useEffect(() => {
    load() // Call the async method automatically when the component mounts
  }, []) // Empty dependency array ensures this effect runs only once on mount

  const handleCopyToClipboardClick = async () => {
    await navigator.clipboard.writeText(ffmpegCommandValue)
    setClickToCopyText('Copied')
    await new Promise(r => setTimeout(r, 1000));
    setClickToCopyText('Click to copy')
  }

  const downloadFile = (blob: Blob, fileName: string) => {
    const downloadLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = fileName;
    downloadLink.click();
    URL.revokeObjectURL(url);
  }
  
  const transcode = async () => {
    if (!input || isProcessing) {
      return
    }

    setIsProcessing(true)
    
    try {
      const ffmpeg = ffmpegRef.current
      const inputFilename = settings.inputFileName!
      
      await ffmpeg.writeFile(inputFilename, await fetchFile(input))
      const ffmpegParams = ffmpegCommandValue.replace("$ ffmpeg ", "").split(" ")
      await ffmpeg.exec(ffmpegParams)
      const outputData = await ffmpeg.readFile(`output.${settings.fileFormat}`)

      // Convert Uint8Array to Blob and create a URL for the video
      const outputBlob = new Blob([outputData], { type: 'video/mp4' })
      const outputUrl = URL.createObjectURL(outputBlob)

      setOutput(outputUrl)
      downloadFile(outputBlob, `output.${settings.fileFormat}`)
    } catch (error) {
      console.error('Error converting video:', error)
      setErrorText(`${error}`)
      if (errorModalRef.current) {
        errorModalRef.current.showModal();
      }
    }

    setIsProcessing(false)
  }

  const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      const file = target.files[0]
      const fileSize = file.size / 1000000 // Mega Bytes
            
      if (fileSize > maxFileSize) {
        setFileSizeExceeded(true);
        return;
      }

      if (fileSize > maxFileSizeForNormalWork) {
        setFileSizeWarning(true)
      }
      
      settings.setInputFileName(file.name)
      setFfmpegSettings(settings)
      const cliCommand = GenerateFfmpegNormalizedCommandString(settings)

      setFfmpegCommand(cliCommand)
      setInput(file)
    }
  }

  const handleCommandChange = (event: Event) => {
    // Update the state when the input value changes
    const target = event.target as HTMLInputElement
    setFfmpegCommand(target.value);
  };

  return loaded ? (
    <div className="w-4/6">
      <a href="https://ffmpeg.org/download.html" target="_blank" className="mb-4">Download FFmpeg</a>
      <div class="mb-3">
        <label
          for="formFile"
          class="my-4 mb-2 inline-block text-neutral-700 dark:text-neutral-200"
        >
        </label>
        <input type="file" 
               accept="video/*"
               className="file-input file-input-bordered w-full my-2"
               onChange={handleFileChange}/>
        {fileSizeExceeded && (
            <span className="text-red-700">
              File size exceeded the WASM limit of {maxFileSize} MB
            </span>
        )}
        {fileSizeWarning && (
            <span>
              Converting time might be too long for files bigger than 10MB
            </span>
        )}
      </div>
      <textarea className="textarea textarea-bordered text-green-400 w-full shadow-md mb-4 p-4 break-words cursor-pointer"
                placeholder="FFmpeg command"
                spellcheck={false}
                value={ffmpegCommandValue}
                onChange={handleCommandChange}>
      </textarea>
      <p className="mt-4 text-gray-600 float-right" onClick={ async () => { await handleCopyToClipboardClick() }}>
        {clickToCopyText}
      </p>
      {input && (
          <button className="btn" onClick={transcode}>
            {isProcessing && (
              <IconContext.Provider value={{ className: "animate-spin" }}>
                <FaSpinner />
              </IconContext.Provider>
            )}
            {isProcessing ? "Processing..." : "Convert"}
          </button>
      )}
      <p className="my-4">
        {progress}
      </p>
      {output &&
        <div class="grid place-items-center">
          <video controls src={output}/>
        </div>
      }
      <dialog className="modal modal-bottom sm:modal-middle" ref={errorModalRef}>
        <div className="modal-box border-solid border-2 border-red-500">
          <h3 className="font-bold text-lg">Error!</h3>
          <p className="py-4">{errorText}</p>
          <p>Press ESC key or click the button below to close</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  ) : (
    <span>Loading...</span>
  )
}

export default FFmpegComponent
