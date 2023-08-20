import { Suspense } from 'preact/compat'
import FFmpegComponent from "./components/FFmpegComponent";
import FileExportParamsComponent from "./components/FileExportParamsComponent";

export default function () {
  return (
    <div className="container mx-auto max-w-prose p-10 prose">
      <h1>Simple converter</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <FFmpegComponent />
        <FileExportParamsComponent />
      </Suspense>
    </div>
  )
}
