// import 'src/components/App.css'
import { Component } from 'preact' // Import 'h' for JSX compatibility
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

class Ffmpeger extends Component {
  loaded: boolean = false
  messageRef: any
  videoRef1: RefObject<HTMLVideoElement> = null
  videoRef2: any
  private ffmpeg: FFmpeg // Use 'any' type for the ffmpeg instance
  private baseURL: string
  private video: File | null = null
  //ffmpegRef = useRef(new FFmpeg())

  constructor() {
    super()
    this.baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.2/dist/esm'

    this.ffmpeg = new FFmpeg()
    this.ffmpeg.on('log', ({ message }) => {
      console.log(message)
    })
    this.ffmpeg.on('progress', ({ progress }) => {
      console.log(`${progress * 100} %`)
    })

    this.loaded = true
  }

  async componentDidMount() {
    await this.ffmpeg.load({
      coreURL: await toBlobURL(
        `${this.baseURL}/ffmpeg-core.js`,
        'text/javascript'
      ),
      wasmURL: await toBlobURL(
        `${this.baseURL}/ffmpeg-core.wasm`,
        'application/wasm'
      ),
      workerURL: await toBlobURL(
        `${this.baseURL}/ffmpeg-core.worker.js`,
        'text/javascript'
      ),
    })
  }

  transcode = async () => {
    if (!this.video) {
      console.log('Video file not assigned') // Check if this message is printed
      return
    }

    //await this.ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(this.video))
    await this.ffmpeg.writeFile('input.avi', await fetchFile(this.video))
    await this.ffmpeg.exec(['-i', 'input.avi', 'output.mp4'])
    // await this.ffmpeg.run(
    //   '-i',
    //   'test.mp4',
    //   '-t',
    //   '2.5',
    //   '-ss',
    //   '2.0',
    //   '-f',
    //   'gif',
    //   'out.gif'
    // )
    const data = await this.ffmpeg.readFile('output.mp4')

    this.videoRef2.current.src = URL.createObjectURL(
      new Blob([data], { type: 'video/mp4' })
    )
  }

  handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      this.video = target.files[0]
      console.log(this.video) // Check if the file is assigned

      this.videoRef1.src = URL.createObjectURL(
        new Blob([this.video], { type: 'video/mp4' })
      )

      // this.ffmpeg = new FFmpeg()

      // await this.ffmpeg.load({
      //   coreURL: await toBlobURL(
      //     `${this.baseURL}/ffmpeg-core.js`,
      //     'text/javascript'
      //   ),
      //   wasmURL: await toBlobURL(
      //     `${this.baseURL}/ffmpeg-core.wasm`,
      //     'application/wasm'
      //   ),
      //   workerURL: await toBlobURL(
      //     `${this.baseURL}/ffmpeg-core.worker.js`,
      //     'text/javascript'
      //   ),
      // })

      // this.ffmpeg.on('log', ({ message }) => {
      //   console.log(message)
      //   // messageRef.current.innerHTML = message;
      // })

      //await this.ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(this.video))

      // await this.ffmpeg.writeFile('input.avi', await fetchFile(this.video))
      // await this.ffmpeg.exec(['-i', 'input.avi', 'output.mp4'])
      // const data = await this.ffmpeg.readFile('output.mp4')

      //   this.videoRef2.current.src = URL.createObjectURL(
      //     new Blob([data], { type: 'video/mp4' })
      //   )
    }
  }

  render() {
    return this.loaded ? (
      <>
        <video ref={(ref) => (this.videoRef1 = ref)} controls></video>
        <input type="file" accept="video/*" onChange={this.handleFileChange} />
        <br />
        <button onClick={this.transcode}>Transcode avi to mp4</button>
        <p ref={this.messageRef}></p>
        <video ref={this.videoRef2} controls></video>
      </>
    ) : (
      <span>Loading...</span>
    )
  }
}

export default Ffmpeger
