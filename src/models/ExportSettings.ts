export class ExportSettings {
    constructor(
        public fileFormat: string,
        public bitrate?: number,
        public codec?: string,
        public sound?: number
    ) {
    }

    setCodec(newCodec: string) {
        this.codec = newCodec
    }

    setBitrate(newBitrate: number) {
        this.bitrate = newBitrate
    }

    setSound(newSound: number) {
        this.sound =  newSound
    }
}
