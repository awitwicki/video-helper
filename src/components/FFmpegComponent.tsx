// import 'src/components/App.css'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { useAtom } from 'jotai'
import { useEffect, useRef } from 'preact/compat'
import { useState } from 'react'

import { settingsAtom } from '../atoms/exportSettings'
import { GenerateFfmpegParams } from  '../helpers/ExportSettingsFFmpegParamsBuilder'
import {ProgressEventCallback} from "@ffmpeg/ffmpeg/dist/esm/types";

function FFmpegComponent() {
  const [input, setInput] = useState<File | null>(null)
  const [output, setOutput] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState("")
  const ffmpegRef = useRef(new FFmpeg())

  const [settings] = useAtom(settingsAtom)
  const [fileSizeExceeded, setFileSizeExceeded] = useState(false);
  const [fileSizeWarning, setFileSizeWarning] = useState(false);
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

  const transcode = async () => {
    console.log(settings)
    if (!input) {
      console.log('Video file not assigned') // Check if this message is printed
      return
    }

    try {
      const ffmpeg = ffmpegRef.current
      const inputFilename = 'input'
      const outputFilename = `output.${settings.fileFormat}`
      
      await ffmpeg.writeFile(inputFilename, await fetchFile(input))
      const ffmpegParams = GenerateFfmpegParams(inputFilename, settings, outputFilename)
      console.log(ffmpegParams.join(" "))
      
      await ffmpeg.exec(ffmpegParams)
      const outputData = await ffmpeg.readFile(outputFilename)

      // Convert Uint8Array to Blob and create a URL for the video
      const outputBlob = new Blob([outputData], { type: 'video/mp4' })
      const outputUrl = URL.createObjectURL(outputBlob)

      setOutput(outputUrl)
    } catch (error) {
      console.error('Error converting video:', error)
    }
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
      
      setInput(file)
    }
  }

  return loaded ? (
    <>
      <div class="mb-3">
        <label
          for="formFile"
          class="mb-2 inline-block text-neutral-700 dark:text-neutral-200"
        >
          Default file input example
        </label>
        <input
          class="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem]  dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100"
          type="file"
          accept="video/*"
          onChange={handleFileChange}
        />
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
      <br />
      {input && (
        <button class="btn" onClick={transcode}>
          Transcode to mp4
        </button>
      )}
      <p>
        {progress}
      </p>
      {output && <video controls src={output}/>}
    </>
  ) : (
    <span>Loading...</span>
  )
}

export default FFmpegComponent
