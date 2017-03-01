'use strict';

export let safeApply =  ($scope, fn = () => {}) => {

	if (!$scope.$root) {
		return fn();
	}

	let {$$phase} = $scope.$root;
	$$phase == '$apply' || $$phase == '$digest' ? fn() : $scope.$apply(fn);
}

