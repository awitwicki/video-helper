export class ExportSettings {
    constructor(
        public fileFormat: string,
        public bitrate?: number,
        public codec?: string,
        public sound?: BigInt
    ) {
    }
}
