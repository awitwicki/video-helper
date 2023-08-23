import { ExportSettings } from '../models/ExportSettings';

export function GenerateFfmpegParams(inputFilename: string, exportSettings: ExportSettings, outputFilename: string): string[] {
  const params: string[] = [];

  params.push('-i', inputFilename);

  if (exportSettings.bitrate) {
    params.push('-b:v', `${exportSettings.bitrate}k`);
  }
  if (exportSettings.codec) {
    params.push('-c:v', exportSettings.codec);
  }
  if (exportSettings.sound) {
    params.push('-filter:a', `"volume=${exportSettings.sound}"`);
  }

  params.push(outputFilename);

  return params;
}
