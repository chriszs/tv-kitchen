/* eslint-disable max-classes-per-file */

import { spawn } from 'child_process'
import Minipass from 'minipass'

class ConvertStream extends Minipass {
	// The FFmpeg process used to wrap the ingestion stream in an MPEG-TS container
	ffmpegProcess = null

	ffmpegSettings = [
		'-loglevel', 'info',
		'-i', '-',
		'-codec', 'copy',
		'-f', 'mpegts',
		'-',
	]

	/**
	 * Returns an FFmpeg settings array for this ingestion engine.
	 *
	 * @return {String[]} A list of FFmpeg command line parameters
	 */
	getFfmpegSettings = () => this.ffmpegSettings

	constructor() {
		super()

		this.ffmpegProcess = spawn('ffmpeg', this.getFfmpegSettings())

		this.ffmpegProcess.stdout.pipe(new (class extends Minipass {
			write = super.write
		})())
	}

	write = (data, enc, done) => this.ffmpegProcess.stdin.write(data, enc, done)

	emit(ev, ...args) {
		if (ev === 'end') {
			if (this.ffmpegProcess !== null) {
				this.ffmpegProcess.kill()
			}
		} else {
			return super.emit(ev, ...args);
		}
	}
}

export default ConvertStream
