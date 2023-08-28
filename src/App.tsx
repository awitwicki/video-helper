import { Suspense } from 'preact/compat'
import FFmpegComponent from "./components/FFmpegComponent";
import FileExportParamsComponent from "./components/FileExportParamsComponent";

export default function () {
  return (
    <div className="container max-w-screen-2xl mx-auto p-10 min-w-min">
      <h1 className="text-4xl font-bold mb-4">Simple converter</h1>
      <Suspense fallback={<p>Loading...</p>}>
          <div className="flex gap-4">
            <FFmpegComponent />
            <FileExportParamsComponent />
          </div>
      </Suspense>
    </div>
  )
}
