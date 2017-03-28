import assert from 'assert';
import { safeApply } from '../utils';
import ZeroAdapter from '../ZeroAdapter';

export default class ZeroAngularAdapter extends ZeroAdapter {

	broadcast(newState = {}) {
		this.watchers.forEach(([$scope, propertyName]) => {
			safeApply($scope, () => {
				$scope[propertyName] = newState;
			});
		});
	}

	mount($scope, propertyName, currentState = {}) {
		assert($scope, 'Argument `$scope` is required');
		assert(typeof propertyName === 'string', 'Argument `propertyName` must be a string');

		let watcher = [$scope, propertyName];
		assert(!this.hasFieldWatcher($scope, propertyName), 'Property already defined in $scope');
		this.watchers.add(watcher);

		// TODO Prevent bind exists proeprty

		safeApply($scope, () => {
			$scope[propertyName] = currentState;
		});

		$scope.$on('$destroy', () => {
			this.watchers.delete(watcher);
			watcher = null;
		});
	}
}
