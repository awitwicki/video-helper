// Working code

// import 'src/components/App.css'
import {Component, RefObject} from 'preact' // Import 'h' for JSX compatibility
import {useRef, useState} from "preact/compat";
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

//import soundRain from '/sounds/rain.mp3'
// import videoUrl from '/video-15s.avi'

const FFmpegComponent: React.FC = () => {
  const [output, setOutput] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  
  const ffmpegRef = useRef(new FFmpeg());
  // private ffmpeg: FFmpeg // Use 'any' type for the ffmpeg instance
  // const video: File | null = null
  const videoRef = useRef(null);
  const messageRef = useRef(null);

  const load = async () => {
    // const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.2/dist/esm";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      console.log(message)
    });

    const jsCoreUrl = '/ffmpeg/ffmpeg-core.js'
    const wasmCoreUrl = '/ffmpeg/ffmpeg-core.wasm'
    const jsWorkerUrl = '/ffmpeg/ffmpeg-core.worker.js'

    const jsCore =  await toBlobURL(jsCoreUrl, 'text/javascript')
    const wasmCore =  await toBlobURL(wasmCoreUrl, 'application/wasm')
    const workerCore =  await toBlobURL(jsWorkerUrl, 'text/javascript')
    
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    // const jsCore =  await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript')
    // const wasmCore =  await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
    // const workerCore =  await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
    
    await ffmpeg.load(
        {
      coreURL: jsCore,
      wasmURL: wasmCore,
      workerURL: workerCore,
    }
    )
    console.log("loaded")
      setLoaded(true)
  };
  const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      const video = target.files[0]
      console.log(video) // Check if the file is assigned
      try {
        const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.2/dist/esm'

        const ffmpeg = new FFmpeg()
        ffmpeg.on('log', ({message}) => {
          console.log(message)
        })
        ffmpeg.on('progress', ({progress}) => {
          console.log(`${progress * 100} %`)
        })
        
        const jsCore =  await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript')
        const wasmCore =  await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
        const workerCore =  await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
        
        //https://unpkg.com/@ffmpeg/core-mt@0.12.2/dist/esm/ffmpeg-core.js
        //https://unpkg.com/@ffmpeg/core-mt@0.12.2/dist/esm/ffmpeg-core.wasm
        //https://unpkg.com/@ffmpeg/core-mt@0.12.2/dist/esm/ffmpeg-core.worker.js

        await ffmpeg.load({
          coreURL: jsCore,
          wasmURL: wasmCore,
          workerURL: workerCore,
        })

        await ffmpeg.writeFile('input.avi', await fetchFile(video))
        await ffmpeg.exec(['-i', 'input.avi', 'output.mp4'])
        const outputData = await ffmpeg.readFile('output.mp4')

        // Convert Uint8Array to Blob and create a URL for the video
        const outputBlob = new Blob([outputData], {type: 'video/mp4'});
        const outputUrl = URL.createObjectURL(outputBlob);

        setOutput(outputUrl);

        // videoRef2.current.src = URL.createObjectURL(
        //   new Blob([data.buffer], { type: 'video/mp4' })
        // )

        // await this.ffmpeg.writeFile('input.avi', await fetchFile(this.video))
        // await this.ffmpeg.exec(['-i', 'input.avi', 'output.mp4'])
        // const data = await this.ffmpeg.readFile('output.mp4')

        //   this.videoRef2.current.src = URL.createObjectURL(
        //     new Blob([data], { type: 'video/mp4' })
        //   )
      } catch (error) {
        console.error('Error converting video:', error);
      }
    }
  }

  return loaded ? (
      <>
        <input type="file" accept="video/*" onChange={handleFileChange} />
        {output && <video controls src={output} />}
      </>
  ) : (
      <button onClick={load}>Load ffmpeg-core</button>
  );
  
    // return this.loaded ? (
    //   <>
    //     <input type="file" accept="video/*" onChange={this.handleFileChange} />
    //     <br />
    //     <button onClick={this.transcode}>Transcode avi to mp4</button>
    //     <p ref={this.messageRef}></p>
    //     {output && <video controls src={output} />}
    //   </>
    // ) : (
    //   <span>Loading...</span>
    // )
  
}

export default FFmpegComponent
