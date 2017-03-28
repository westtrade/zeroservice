/* eslint-env mocha */

import angular from 'angular';
import 'angular-mocks';

import { should } from 'chai';
import { ZeroService } from '../src/ZeroService';
import ZeroAngularAdapter from '../src/adapters/ZeroAngularAdapter';

const { inject, module } = angular.mock;

should();

describe('ZeroService set adapter', function() {
	it('can be set by constructor', function () {
		const service = new ZeroService({ adapter: ZeroAngularAdapter });
		service.adapter.should.be.instanceof(ZeroAngularAdapter);
	});

	it('can be set by setter', function () {
		const service = new ZeroService();
		service.adapter = ZeroAngularAdapter;
		service.adapter.should.be.instanceof(ZeroAngularAdapter);
	});
});

describe('ZeroAngularAdapter', function() {
	// console.log(angularModule);
	// const $injector = angular.element(document).injector();

	let	$scope;
	let service;

	beforeEach(inject(($injector) => {
		$scope = $injector.get('$rootScope').$new();
		service = new ZeroService({ adapter: ZeroAngularAdapter });
	}));

	it('synchronize initial state with property of angular $scope', function () {
		service.setState('Test string');
		service.mount($scope, 'test');
		$scope.test.should.equal('Test string');
	});

	it('synchronize changes of state with property of angular $scope', function () {
		const initialState = 'Initial state value';
		service.setState(initialState);
		service.mount($scope, 'test');

		let count = 5;

		while (count) {
			count -= 1;

			(function localScope(currentCount) {
				const changeWatcher = sinon.spy();
				$scope.$watch('test', changeWatcher);
				let n = currentCount;
				while (n) {
					n -= 1;
					const newState = {
						n,
					};
					service.setState(newState);
					$scope.test.should.eql(newState);
				}
				changeWatcher.callCount.should.equal(currentCount);
			})(count + 1);
		}
	});

	it('synchronize changes before scope was unmount', function () {
		const initialState = 'Initial state value';
		service.setState(initialState);
		service.mount($scope, 'test');

		let count = 5;

		while (count) {
			count -= 1;

			(function localScope (currentCount) {
				const changeWatcher = sinon.spy();
				$scope.$watch('test', changeWatcher);
				let n = currentCount;
				while (n) {
					n -= 1;

					if (n === 0) {
						service.unmount($scope);
					}

					const newState = {
						n,
					};
					service.setState(newState);
				}
				changeWatcher.callCount.should.equal(currentCount - 1);
			})(count + 1);

			service.mount($scope, 'test');
		}
	});
});
