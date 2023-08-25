export class ExportSettings {
    constructor(
        public fileFormat: string,
        public bitrate?: number,
        public codec?: string,
        public sound?: number,
        public trimFrom?: string,
        public trimTo?: string,
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

    setTrimFrom(timeStamp: string) {
        this.trimFrom =  timeStamp
    }

    setTrimTo(timeStamp: string) {
        this.trimTo =  timeStamp
    }
}
