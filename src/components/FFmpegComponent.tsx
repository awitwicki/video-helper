// import 'src/components/App.css'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import {useEffect, useRef} from "preact/compat";
import {useState} from "react";
import {fetchFile, toBlobURL} from "@ffmpeg/util";

function FFmpegComponent() {
  const [input, setInput] = useState<File | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());

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
      await ffmpeg.exec(['-i', 'input.avi', 'output.mp4'])
      const outputData = await ffmpeg.readFile('output.mp4')

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
        <input type="file" accept="video/*" onChange={handleFileChange}/>
        <br/>
        {input && <button class="btn" onClick={transcode}>Transcode to mp4</button>}
        {output && <video controls src={output}/>}
      </>
  ) : (
      <span>Loading...</span>
  ))
}

export default FFmpegComponent
