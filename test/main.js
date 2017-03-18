/* eslint-env mocha */

import { PassThrough } from 'stream';
import chai from 'chai';

import { ZeroService } from '../src/ZeroService';

chai.should();

describe('ZeroService', () => {
	let service;

	beforeEach(() => {
		service = new ZeroService();
	});

	describe('#setState()', () => {
		const testNumber = 0;
		it('should set state for Number type', () => {
			service.setState(testNumber);
			service.state.should.equal(testNumber);
		});

		const testString = 'Test String';
		it('should set state for String type', () => {
			service.setState(testString);
			service.state.should.equal(testString);
		});

		const testArray = [1, 2, 3];
		it('should set state for Array', () => {
			service.setState(testArray);
			service.state.should.eql(testArray);
		});

		const testObject = {
			a: 1,
			b: 2,
			c: 3,
		};
		it('should set state of Object type', () => {
			service.setState(testObject);
			service.state.should.eql(testObject);
		});

		it('should set state for property', () => {
			service.setState({
				a: 1,
			});

			service.setState('a', 2);
			service.state.should.eql({ a: 2 });
		});
	});
});


describe('ZeroService stream input', () => {
	let service;
	beforeEach(() => {
		service = new ZeroService();
	});

	describe('piping and transform', () => {
		const testStream = new PassThrough({
			objectMode: true,
		});

		// let attempts = 10;
		// while (attempts--) {
		//
		// }

		it('should works as standart stream, with middlewares', async () => {
			const middleware = sinon.spy();

			service.use(async (next) => {
				await next;
			});

			testStream.pipe(service);

			testStream.push({
				type: 'click',
				data: 'testData',
			});


			// assert(middleware.called);
		});

		it('should correct change state by use middlewares', async () => {
			service.use(async (ctx, next) => {
				await next;
			});
		})
	});
});
