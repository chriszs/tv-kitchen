import Minipass from 'minipass';
import { Payload } from '@tvkitchen/base-classes';
import kafka from '%src/lib/kafka';

class IngestStream extends Minipass {
	producer = null

	constructor() {
		super();

		this.producer = kafka.producer();
	}

	write(payload, enc, done) {
		console.log(payload, enc, done)
		if (!(payload instanceof Payload)) {
			done(new Error('ingestStream received non-Payload data'));
		} else {
			this.producer
				.send({
					topic: payload.type,
					messages: [
						{
							value: Payload.serialize(payload),
						},
					],
				})
				.then((result) => done(null, result))
				.catch(done);
		}
	}

	emit(ev, ...args) {
		if (ev === 'end') {
			this.producer
				.disconnect()
				.then(() => super.emit(ev, ...args))
				.catch(() => super.emit(ev, ...args));
		} else {
			return super.emit(ev, ...args);
		}
	}
}

export default IngestStream;
