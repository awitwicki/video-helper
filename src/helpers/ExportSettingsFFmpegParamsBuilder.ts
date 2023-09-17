import { ExportSettings } from '../models/ExportSettings';

export function GenerateFfmpegNormalizedCommandString(exportSettings: ExportSettings): string {
    return "$ ffmpeg " + GenerateFfmpegCommandString(exportSettings).join(" ");
}

export function GenerateFfmpegCommandString(exportSettings: ExportSettings): string[] {
  const params: string[] = [];

  params.push('-i', exportSettings.inputFileName!);

  if (exportSettings.bitrate) {
    params.push('-b:v', `${exportSettings.bitrate}k`);
  }
  if (exportSettings.codec) {
    params.push('-c:v', exportSettings.codec);
  }
  if (exportSettings.sound !== undefined) {
    if (exportSettings.sound > 0) {
      params.push('-filter:a', `"volume=${exportSettings.sound}"`);
    }
    else {
      params.push('-an');
    }
  }
  if (exportSettings.trimFrom) {
    params.push('-ss', `${exportSettings.trimFrom}`);
  }
  if (exportSettings.trimTo) {
    params.push('-to', `${exportSettings.trimTo}`);
  }

  params.push(`output.${exportSettings.fileFormat}`);

  return params;
}
