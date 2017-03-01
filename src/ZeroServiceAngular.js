import {safeApply} from './utils'
    
import ZeroService from './ZeroService'

export default class ZeroServiceAngular extends ZeroService {

	constructor() {
		super()
	}

	broadcast(data = {}) {
		
		this[properties].watchers.forEach(([$scope, propertyName]) => {
			safeApply($scope, () => {
				$scope[propertyName] = this.getState();
			});
		});
		
	}

	bind($scope, propertyName) {

		let watcher = [$scope, propertyName];

		this[properties].watchers.add(watcher)

		safeApply($scope, () => {
			$scope[propertyName] = this.getState()
		})

		$scope.$on('$destroy', () => {
			this[properties].watchers.delete(watcher)
			watcher = null;
		})

	}
};
