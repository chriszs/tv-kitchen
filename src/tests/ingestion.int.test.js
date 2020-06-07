// Mocked import
import childProcess from 'child_process' // eslint-disable-line import/order

// Test imports
import path from 'path'
import { PassThrough } from 'stream'
import FileIngestionEngine from '%src/components/ingestion/FileIngestionEngine'

jest.mock('child_process')

describe('ingestion', () => {
	describe('FileIngestionEngine', () => {
		it('it should read a video file into a Kafka topic', (done) => {
			jest.clearAllMocks()

			const mockDate = new Date(1592156234000)
			jest
				.spyOn(global, 'Date')
				.mockImplementation(() => mockDate)

			const ingestionEngine = new FileIngestionEngine(
				path.join(__dirname, '/data/norm.ts'),
			)

			const stream = new PassThrough()
			childProcess.spawn.mockReturnValueOnce({
				stdout: stream,
				stdin: stream,
				kill: jest.fn(),
			})
			ingestionEngine.producer = {
				send: jest.fn().mockResolvedValue(),
				connect: jest.fn().mockResolvedValue(),
				disconnect: jest.fn(),
			}

			ingestionEngine.start()

			ingestionEngine.producer.disconnect.mockImplementation(() => {
				expect(ingestionEngine.producer.send).toMatchSnapshot()
				done()
			})
		})
	})
})
