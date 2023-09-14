import { Suspense } from 'preact/compat'
import FFmpegComponent from "./components/FFmpegComponent";
import FileExportParamsComponent from "./components/FileExportParamsComponent";
import { FaGithub } from "react-icons/fa";

export default function () {
  return (
    <div className="container max-w-screen-2xl mx-auto p-10 min-w-min">
        <div className="flex items-center mb-2">
            <h1 className="text-4xl font-bold mr-2">Simple converter</h1>
            <a
                href="https://github.com/awitwicki/video-helper"
                target="_blank"
                rel="noopener noreferrer"
            >
                <FaGithub size={30} />
            </a>
        </div>
        <a href="https://ffmpeg.org/download.html" target="_blank" class="mb-4">Download FFmpeg</a>
        <Suspense fallback={<p>Loading...</p>}>
            <div className="flex gap-4">
              <FFmpegComponent />
              <FileExportParamsComponent />
            </div>
        </Suspense>
    </div>
  )
}
