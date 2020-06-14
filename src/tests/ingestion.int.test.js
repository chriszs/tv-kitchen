import path from 'path'
import FileIngestionEngine from '%src/components/ingestion/FileIngestionEngine'

describe('ingestion', () => {
	describe('FileIngestionEngine', () => {
		it('it should read a video file into a Kafka topic', (done) => {
			jest.clearAllMocks()

			const ingestionEngine = new FileIngestionEngine(
				path.join(__dirname, '/data/norm.ts'),
			)

			ingestionEngine.on('end',() => {
				//expect(ingestionEngine.producer.send).toMatchSnapshot()
				done()
			})
		})
	})
})
