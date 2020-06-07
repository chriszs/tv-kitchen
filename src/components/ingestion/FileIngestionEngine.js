import fs from 'fs'
import AbstractIngestionEngine from '%src/components/ingestion/AbstractIngestionEngine'

/**
 * The FileIngestionEngine handles processing a video file. It is a concrete
 * implementation of AbstractIngestionEngine, which reads in a file,
 * converts it into an MPEG-TS stream represented as a series of Payloads,
 * and then pipes that to Kafka.
 *
 * @param  {string}  path The path of the file to be ingested
 */
class FileIngestionEngine extends AbstractIngestionEngine {
	constructor(path) {
		if (!path) {
			throw new Error('path required') // TODO: should probably be FileInstantiationError
		}
		super()

		this.path = path
	}

	// The path of the file to read by the engine
	path = null

	/**
	 * The ReadableStream that is being ingested by the ingestion engine.
	 *
	 * @return {ReadableStream} The stream of data to be ingested by the ingestion engine
	 */
	getInputStream = () => fs.createReadStream(this.path)
}

export default FileIngestionEngine
