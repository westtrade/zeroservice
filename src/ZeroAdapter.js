

export const properties = Symbol('private properties');
export default class ZeroAdapter {

	constructor() {
		this.ctx = null;
		this[properties] = {
			watchers: new Set(),
		};
	}

	get watchers() {
		return this[properties].watchers;
	}

	setup(context) {
		this.ctx = context;
	}

	broadcast(data = {}) {
		Array.from(this.watchers).forEach(watcher => watcher(data));
	}

	bind(watcher) {
		this.watchers.add(watcher);
	}

	destroy() {
		this.watchers.clear();
	}

	unbind(watcher) {
		this.watchers.delete(watcher);
	}

	count() {
		return this.watchers.length;
	}
}
