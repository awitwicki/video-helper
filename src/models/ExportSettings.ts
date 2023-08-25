export class ExportSettings {
    constructor(
        public fileFormat: string,
        public bitrate?: number,
        public codec?: string,
        public sound?: number,
        public trimFrom?: string | null,
        public trimTo?: string | null
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

    setTrimFrom(timeStamp: string | null) {
        this.trimFrom =  timeStamp
    }

    setTrimTo(timeStamp: string | null) {
        this.trimTo =  timeStamp
    }
}
