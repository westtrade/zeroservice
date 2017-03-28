/* eslint-env mocha */

import { should } from 'chai';
import { ZeroService } from '../src/ZeroService';
import ZeroReactAdapter from '../src/adapters/ZeroReactAdapter';
import React from 'react';
import TestComponent from './TestComponent.jsx';

import { shallow } from 'enzyme';

should();

describe('ZeroReactAdapter', function() {
	let service;
	let component;

	beforeEach(() => {
		service = new ZeroService({ adapter: ZeroReactAdapter });
		component = shallow(<TestComponent />);
	});

	it('synchronize initial service state with React state', function () {
		service.setState('Test string');
		service.mount(component, 'test');
		component.state('test').should.equal('Test string');
		component.text().should.equal('"Test string"');
	});


	it('synchronize changes of service state with property in React state', function () {
		const initialState = 'Initial state value';
		service.setState(initialState);
		service.mount(component, 'test');

		let count = 5;

		while (count) {
			count -= 1;

			(function localScope(currentCount) {
				let n = currentCount;
				while (n) {
					n -= 1;
					const newState = {
						n,
					};
					service.setState(newState);
					component.text().should.equal(JSON.stringify(newState));
				}
			})(count + 1);
		}
	});

	it('synchronize changes only components was mounted', function () {
		const initialState = 'Initial state value';
		service.initialState = initialState;

		let count = 5;
		while (count--) {
			if (!count) {
				break;
			}

			(function localScope(currentCount) {
				let n = currentCount;
				service.mount(component, 'test');

				while (n--) {
					const newState = { n };

					if (n === 0) {
						service.unmount(component);
						service.adapter.count.should.be.equal(0);
						service.setState(newState);
					} else {
						service.setState(newState);
						component.text().should.equal(JSON.stringify(newState));
					}
				}
			})(count + 1);

			component.text().should.equal(JSON.stringify({ n: 1 }));

		}
	});
});
