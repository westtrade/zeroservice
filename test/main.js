/* eslint-env mocha */

import { PassThrough } from 'stream';
import { should, expect } from 'chai';
import { ZeroService, clone } from '../src/ZeroService';

should();

describe('ZeroService', () => {
	let service;

	beforeEach(() => {
		service = new ZeroService();
	});

	describe('#[clone]()', function() {
		it('return clone of number', function () {
			const testNumber = 1;
			service[clone](testNumber).should.equal(testNumber);
		});

		it('return clone of string', function () {
			const testString = 'test string';
			service[clone](testString).should.equal(testString);
		});

		it('return clone of object', function () {
			const testObject = {
				a: 1,
			};
			service[clone](testObject).should.not.equal(testObject);
			service[clone](testObject).should.eql(testObject);
		});
	});

	describe('#setState()', () => {
		const testNumber = 0;
		it('set number value to state', () => {
			service.setState(testNumber);
			service.state.should.equal(testNumber);
		});

		const testString = 'Test String';
		it('set string value to state', () => {
			service.setState(testString);
			service.state.should.equal(testString);
		});

		const testArray = [1, 2, 3];
		it('set array value to state', () => {
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

		it('should set state for property of Object', () => {
			service.setState({
				a: 1,
			});

			service.setState('a', 2);
			service.state.should.eql({ a: 2 });
		});

		it('should set state with function', () => {
			service.setState(function () {
				this.state = {
					a: 1,
				};
			});

			service.state.should.eql({ a: 1 });
		});
	});

	describe('set initial state of service', function() {
		it('must set state like #setState()', function () {
			service.initialState = {
				a: 1,
			};

			service.state.should.eql({ a: 1});
		});

		it('must not update observers', function () {
			const spyWatcher = sinon.spy();
			service.on('data', spyWatcher);
			service.initialState = {
				a: 1,
			};

			spyWatcher.called.should.to.be.false;
		});
	});

	describe('synchronize service and views states', async function() {
		let count = 5;
		while (count--) {
			(function makeTest(currentCount) {
				it(`call state synchronize  ${count} times`, async function () {
					let n = currentCount;
					const watcher = sinon.spy();
					service.mount(watcher, 'test');
					while (n--) {
						await service.setState({ n });
						watcher.calledWithExactly('test', { n }).should.be.true;
					}
					watcher.callCount.should.equal(currentCount + 2);
				});
			})(count + 1);
		}
	});

	describe('watchers', function() {
		it('must prevent to setup watcher twice', function () {
			expect(() => {
				const watcher = sinon.spy();
				const field = 'testField';

				service.mount(watcher, field);
				service.mount(watcher, field);
			}).to.throw(Error);
		});
	});

	describe('unmount watchers', function() {
		let count = 5;
		while (count--) {
			(function makeTest(currentCount) {
				it(`call state synchronize  ${count - 1} times`, async function () {
					let n = currentCount;

					const watcher = sinon.spy();
					service.mount(watcher, 'test');

					while (n--) {
						if (n === 0) {
							service.unmount(watcher);
						}
						// watcher.calledWithExactly({ n }).should.be.true;
						await service.setState({ n, currentCount });
					}

					watcher.callCount.should.equal(currentCount + 1);
				});
			})(count + 1);
		}
	});
});


class TestService extends ZeroService {
	exposedMethod() {
		return null;
	}

	get exposedProperty() {
		return 'property value';
	}

	static get exposedStaticProperty() {
		return 'property value';
	}
}

describe('ZeroService exposed properties', () => {
	let service;

	beforeEach(() => {
		service = new TestService();
	});

	describe('#set exposed()', () => {
		it('should add exposed function into state', () => {
			service.exposed = 'exposedMethod';
			service.exposed.should.include('exposedMethod');
			service.getState().should.have.property('exposedMethod');
			service.state.should.not.have.property('exposedMethod');
			service.getState(true).should.not.have.property('exposedMethod');
		});

		it('should add exposed function into state', () => {
			service.exposed = ['exposedStaticProperty'];
			service.exposed.should.include('exposedStaticProperty');
			service.getState().should.have.property('exposedStaticProperty');
			service.state.should.not.have.property('exposedStaticProperty');
			service.getState(true).should.not.have.property('exposedStaticProperty');
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
		});
	});
});
