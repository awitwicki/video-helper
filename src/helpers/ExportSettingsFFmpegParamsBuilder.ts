﻿import { ExportSettings } from '../models/ExportSettings';

export function GenerateFfmpegParams(exportSettings: ExportSettings): string[] {
  const params: string[] = [];

  params.push('-i', exportSettings.inputFileName!);

  if (exportSettings.bitrate) {
    params.push('-b:v', `${exportSettings.bitrate}k`);
  }
  if (exportSettings.codec) {
    params.push('-c:v', exportSettings.codec);
  }
  if (exportSettings.sound) {
    params.push('-filter:a', `"volume=${exportSettings.sound}"`);
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
