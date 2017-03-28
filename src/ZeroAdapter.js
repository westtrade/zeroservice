const assert = require('assert');

export const properties = Symbol('private properties');
export default class ZeroAdapter {

	constructor() {
		this[properties] = {
			watchers: new Set(),
		};
	}

	get watchers() {
		return this[properties].watchers;
	}

	setup(context) {

	}

	async broadcast(data = {}, callback = () => {}) {
		const result = Array.from(this.watchers)
			.map(([watcher, propertyName]) => watcher(propertyName, data));

		await Promise.all(result);
		callback();
	}

	getWatcher(watcher) {
		return Array.from(this.watchers)
			.filter(([currentWatcher]) => currentWatcher === watcher);
	}

	hasWatcher(watcher) {
		return this.getWatcher(watcher).length > 0;
	}

	getWatcherFields(watcher) {
		return this.getWatcher(watcher).reduce((result = [], [, propertyName]) => {
			result.push(propertyName);
			return result;
		}, []);
	}

	hasFieldWatcher(watcher, field) {
		return this.getWatcher(watcher)
			.filter(([, currentField]) => field === currentField)
			.length > 0;
	}

	/**
	 * Mount ui field of state to service
	 */
	mount(watcher, propertyName, currentState = {}) {
		watcher(propertyName, currentState);
		assert(!this.hasFieldWatcher(watcher, propertyName), 'Property with this watcher already mounted');
		this.watchers.add([watcher, propertyName]);
		watcher(propertyName, currentState);
	}

	/**
	 * Adapter destructor, which correct unmount all adapters
	 */
	destroy() {
		this.watchers.clear();
	}

	/**
	 * Unmount watcher for all fields
	 */
	unmount(watcher) {
		this.getWatcher(watcher)
		.forEach(removeItem => this.watchers.delete(removeItem));
	}

	/**
	 * Count of watchers
	 * @return {number} count
	 */
	get count() {
		return this.watchers.size;
	}
}
