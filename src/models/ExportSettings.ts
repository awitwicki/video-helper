export class ExportSettings {
    constructor(
        public fileFormat: string,
        public bitrate?: number,
        public codec?: string,
        public sound?: BigInt
    ) {
    }

    setCodec(newCodec: string) {
        this.codec = newCodec;
    }

    setBitrate(newBitrate: number) {
        this.bitrate = newBitrate;
    }

    setSound(newSound: BigInt) {
        this.sound = newSound;
    }
}
