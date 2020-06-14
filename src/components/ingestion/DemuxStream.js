import { TSDemuxer } from 'ts-demuxer'
import Minipass from 'minipass'
import { Payload } from '@tvkitchen/base-classes'
import { dataTypes } from '@tvkitchen/base-constants'
import {
	tsToMilliseconds,
	generateEmptyPacket,
} from '%src/lib/utils/mpegts'

class DemuxStream extends Minipass {
	// Utility for processing the MPEG-TS stream produced by ffmpeg
	mpegtsDemuxer = null

	type = dataTypes.STREAM.CONTAINER

	// A shim variable that allows us to use the output of TSDemuxer in our engine
	mostRecentDemuxedPacket = null

	constructor() {
		super()

		this.mpegtsDemuxer = new TSDemuxer(this.onDemuxedPacket.bind(this))
	}

	/**
	 * Updates ingestion state based on the latest demuxed packet data.
	 *
	 * This method is called by our MPEG-TS demuxer, and allows the ingestion engine to track
	 * the most recent demuxed packet.
	 *
	 * @param  {Packet} packet The latest TSDemuxer Packet object
	 */
	onDemuxedPacket(packet) {
		this.mostRecentDemuxedPacket = packet
	}

	/**
	 * Returns the most recent coherent stream packet processed by the ingestion engine.
	 * This packet is lower level than the MPEG-TS container, and represents an audio or video
	 * packet demuxed from the MPEG-TS stream.
	 *
	 * @return {Packet} The most recent Packet object extracted by TSDemuxer
	 */
	getMostRecentDemuxedPacket = () => this.mostRecentDemuxedPacket

	process(mpegtsData) {
		this.mpegtsDemuxer.process(mpegtsData)
		const demuxedPacket = this.getMostRecentDemuxedPacket() || generateEmptyPacket()
		return new Payload({
			data: demuxedPacket.data,
			type: this.type,
			duration: 0,
			position: tsToMilliseconds(demuxedPacket.pts),
			createdAt: (new Date()).toISOString(),
		})
	}

	/**
	 * Process a new chunk of data from an MPEG-TS stream. The chunks passed to this
	 * function should be presented sequentially, and combine to form a coherent MPEG-TS
	 * data stream, but they can be of arbitrary size.
	 *
	 * This method is called by a NodeJS Transform stream and so matches that spec.
	 *
	 * @param  {Buffer} mpegtsData The latest sequential chunk of MPEG-TS data
	 * @param  {String} enc        The encoding of the passed data
	 * @param  {Function(err,result)} done     A `(err, result) => ...` callback
	 *
	 */
	write(mpegtsData, enc, done) {
		return super.write(this.process(mpegtsData), enc, done)
	}

	end(mpegtsData, enc, done) {
		if (mpegtsData) {
			return super.end(this.process(mpegtsData), enc, done)
		} else {
			return super.end(null)
		}
	}
}

export default DemuxStream
