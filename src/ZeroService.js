
import assert from 'assert';
import { Transform } from 'stream';
import ZeroAdapter from './ZeroAdapter';

export const properties = Symbol('private properties');

const clone = Symbol('clone method');
const broadcast = Symbol('broadcast method');

export class ZeroService extends Transform 	{
	constructor({ objectMode = true, adapter = ZeroAdapter } = {}) {
		super({ objectMode });

		this[properties] = {
			state: {},
			exposed: new Set(),
			adapter: null,
			middlewares: [],
		};

		this.adapter = adapter;
	}

	async _transform(chunk, encoding, done = () => {}) {
		await this[properties].middlewares
			.reduce((n, mid) => mid.call(this, n), Promise.resolve());

		done();
	}

	[clone](input) {
		if (typeof input !== 'object') {
			return input;
		}

		const out = Array.isArray(input) ? [] : {};

		for (const key in input) {
			const value = input[key];
			out[key] = (typeof value === 'object')
				? this[clone](value)
				: value;
		}

		return out;
	}

	set adapter(AdapterClass) {
		const prevAdapter = this.adapter;

		if (prevAdapter) {
			prevAdapter.destroy();
		}

		const adapter = new AdapterClass(this);
		assert(adapter instanceof ZeroAdapter, 'Adapter must be instance of ZeroAdapter class');
		// adapter

		this[properties].adapter = adapter;
	}

	get adapter() {
		const { adapter = null } = this[properties];
		return adapter;
	}

	get exposed() {
		return Array.from(this[properties].exposed);
	}

	set exposed(exposedNames = []) {
		const exposedNamesList = Array.isArray(exposedNames)
			? exposedNames
			: [exposedNames];

		exposedNamesList
			.forEach(name => assert(typeof name === 'string', 'Exposed propertie name must be a string'));

		this[properties].exposed = new Set(exposedNamesList);
	}

	async setState(...args) {
		let	preventBroadcast = false;

		if (typeof args[0] === 'function') {
			if (typeof args[1] === 'boolean') {
				preventBroadcast = args[1];
			}

			await args[0].call(this);
		} else {
			let name = null;
			let data;

			if (typeof args[0] === 'string' && args.length >= 2) {
				name = args[0];
				data = args[1];
				preventBroadcast = typeof args[2] === 'undefined' ? preventBroadcast : !!args[2];
			} else {
				data = args[0];
				preventBroadcast = typeof args[1] === 'undefined' ? preventBroadcast : !!args[1];
			}

			data = this[clone](data);

			if (name) {
				this[properties].state[name] = data;
			} else {
				this[properties].state = data;
			}
		}

		if (!preventBroadcast) {
			this[broadcast](this.getState());
		}

		this.write(this.state);
	}

	getState(cleanState = false) {
		const { state } = this[properties];
		const newState = this[clone](state);

		if (!cleanState) {
			this.exposed.forEach((key) => {
				const keyExists = key in this;
				if (!keyExists) {
					return;
				}

				// TODO Prevent linking between object assigned to class and state
				if (typeof this[key] === 'function') {
					newState[key] = this[key].bind(this);
				} else {
					newState[key] = this[key];
				}
			});
		}

		return newState;
	}

	get state() {
		const { state } = this[properties];
		return state;
	}

	set state(newState) {
		this.setState(newState);
	}

	use(...middlewares) {
		this[properties].middlewares =
			this[properties].middlewares.concat(middlewares);
	}

	bind(...args) {
		const adapter = this.adapter;
		if (adapter) {
			adapter.bind(...args);
		}
	}

	[broadcast](data = {}) {
		const adapter = this.adapter;
		if (adapter) {
			adapter.broadcast(data);
		}
	}

	unbind(...args) {
		const adapter = this.adapter;
		if (adapter) {
			adapter.unbind(...args);
		}
	}
}
