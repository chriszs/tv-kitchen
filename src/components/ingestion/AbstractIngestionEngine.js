import Pipeline from 'minipass-pipeline'
import ConvertStream from './ConvertStream'
import DemuxStream from './DemuxStream'
import IngestStream from './IngestStream'
import {
	AbstractInstantiationError,
	NotImplementedError,
} from '@tvkitchen/base-errors'

import logger from '%src/lib/logger'

/**
 * The AbstractIngestionEngine handles the bulk of the stream processing associated with video
 * ingestion. Ingestion Engines that implement this class are responsible for defining the input
 * stream, and the abstract class will handle coordinating the input pipeline that ultimately
 * produces messages to the STREAM.CONTAINER Kafka queue.
 *
 * The pipeline consists of the following steps:
 *
 * 1. The input stream emits video data.
 * 2. That video data is piped to an FFmpeg spawn process in order to ensure the container format
 *    is MPEG-TS.
 * 3. The FFmpeg spawn process emits MPEG-TS data.
 * 4. That MPEG-TS data is processed by `TSDemuxer` in order to decorate it with the display
 *    timestamp (DTS).
 * 5. The decorated data is piped to Kafka as a TV Kitchen `Payload`.
 *
 * When the stream ends, the FFmpeg process and pipeline is shut down.
 */
class AbstractIngestionEngine extends Pipeline {
	constructor(inputStream) {
		super(
			inputStream,
			// new ConvertStream(),
			new DemuxStream(),
			// new IngestStream(),
		)
	}
}

export default AbstractIngestionEngine
