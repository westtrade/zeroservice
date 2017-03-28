import assert from 'assert';
import ZeroAdapter from '../ZeroAdapter';


export default class ZeroReactAdapter extends ZeroAdapter {
	constructor(...args) {
		super(...args);

		this.updatePromise = Promise.resolve();
	}

	mount(watcher, propertyName, currentServiceState = {}) {
		assert(!this.hasFieldWatcher(watcher, propertyName), 'Property already mounted');

		watcher.setState(
			(prevState = {}) => {
				const prevProperty = prevState[propertyName];

				if (prevProperty) {
					assert(typeof prevProperty === typeof currentServiceState
						, 'New State of Service must be the same type as previous state, due to React limitations.');
				}

				const result = Object.assign({}, prevState, { [propertyName]: currentServiceState });
				return result;
			},
		);
		this.watchers.add([watcher, propertyName]);
	}

	async broadcast(data = {}, callback = () => {}) {
		const result = Array.from(this.watchers)
			.map(([watcher, propertyName]) => {
				return new Promise((resolve) => {
					const stateSetter = (prevState = {}) =>
						Object.assign({}, prevState, { [propertyName]: data });
					watcher.setState(stateSetter, resolve);
				});
			});

		await Promise.all(result);
		callback();
	}
}
