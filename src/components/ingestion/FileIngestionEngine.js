import fsm from 'fs-minipass'
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

		super(new fsm.ReadStreamSync(path))
	}
}

export default FileIngestionEngine
