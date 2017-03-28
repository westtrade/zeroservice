
import assert from 'assert';
import { Transform } from 'stream';
import ZeroAdapter from './ZeroAdapter';

export const properties = Symbol('private properties');

export const clone = Symbol('clone method');
const broadcast = Symbol('broadcast method');


// TODO Prevent ovveride exposed by state and state by exposed,
// with option strict and non-strict

export class ZeroService extends Transform 	{
	/**
	 * ZeroService constructor
	 * @param {Object} settings - Settings of constructor
	 * @param {Boolean} settings.objectMode -
	 * @type {Boolean}
	 */
	constructor({ objectMode = true, adapter = ZeroAdapter, adapterSettings = {} } = {}) {
		super({ objectMode });

		this[properties] = {
			initialState: {},
			state: {},
			exposed: new Set(),
			adapter: null,
			middlewares: [],
			adapterSettings,
		};

		this.adapter = adapter;
	}

	async _transform(chunk, encoding, done = () => {}) {
		await this[properties].middlewares
			.reduce((n, mid) => mid.call(this, n), Promise.resolve());

		done();
	}

	/**
	 * Deep clone of object for variable with object type
	 */
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

	/**
	 * Set service adapter
	 * @param  {[type]} AdapterClass [description]
	 * @return {[type]}              [description]
	 */
	set adapter(AdapterClass) {
		const prevAdapter = this.adapter;

		if (prevAdapter) {
			prevAdapter.destroy();
		}

		const adapter = new AdapterClass(this[properties].adapterSettings);
		assert(adapter instanceof ZeroAdapter, 'Adapter must be instance of CallbackAdapter class');
		this[properties].adapter = adapter;
	}

	/**
	 * Current adapter for watchers
	 * @return {CallbackAdapter}
	 */
	get adapter() {
		const { adapter = null } = this[properties];
		return adapter;
	}

	/**
	 * List of service exposed properties
	 * @return {Array}
	 */
	get exposed() {
		return Array.from(this[properties].exposed);
	}

	/**
	 * Set exposed names
	 * @param  {(string|string[])}  [exposedNames=[]] List of exposed properties names
	 */
	set exposed(exposedNames = []) {
		// assert(!this.exposed.length'Exposed attributes cannot be reassigned.')
		// TODO maybe in this place we need a message about reassigned exposed properties
		const exposedNamesList = Array.isArray(exposedNames)
			? exposedNames
			: [exposedNames];

		exposedNamesList
			.forEach(name => assert(typeof name === 'string', 'Exposed property name must be a string'));

		this[properties].exposed = new Set(exposedNamesList);
	}

	/**
	 * Method set service state
	 */
	async setState(...args) {
		let	preventBroadcast = false;

		if (typeof args[0] === 'function') {
			if (typeof args[1] === 'boolean') {
				preventBroadcast = args[1];
			}

			await args[0].call(this, this.state);
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

	/**
	 * Setup initial state of service
	 * @param  {*} stateData [description]
	 */
	set initialState(stateData) {
		this[properties].initialState = stateData;
		return this.setState(stateData, false);
	}

	get initialState() {
		return this[properties].initialState;
	}

	async isReady() {
		return true;
	}

	/**
	 * Method return state of service
	 *
	 * @param {Boolean} cleanState - flag forcing method return clean state,
	 * without exposed params
	 * @type {*}
	 */
	getState(cleanState = false) {
		const { state } = this[properties];
		const newState = this[clone](state);

		if (!cleanState) {
			this.exposed.forEach((key) => {
				const keyExists = key in this;
				let exposedValue;

				if (!keyExists && key in this.constructor) {
					exposedValue = this.constructor[key];
				}

				assert(keyExists || exposedValue,
					`This class ${this.constructor.name} must have property or method with name ${key}`);

				if (!exposedValue && keyExists) {
					exposedValue = this[key];
				}

				// TODO Prevent linking between object assigned to class and state
				if (typeof exposedValue === 'function') {
					exposedValue = exposedValue.bind(this);
				}
				newState[key] = exposedValue;
			});
		}

		return newState;
	}

	/**
	 * Clean service state, without exposed properties.
	 * Result related private property of service state.
	 * @return {*} state of service
	 */
	get state() {
		const { state } = this[properties];
		return state;
	}

	/**
	 * State of service
	 *
	 * @param  {*} newState New state of service
	 */
	set state(newState) {
		this.setState(newState);
	}

	/**
	 * Method add stream middleware
	 */
	use(...middlewares) {
		this[properties].middlewares =
			this[properties].middlewares.concat(middlewares);
	}

	/**
	 * Bind views state to service
	 */
	mount(watcher, propertyName) {
		assert(watcher, 'Argument watcher must be defined');
		assert(typeof propertyName === 'string', 'Argument `propertyName` must be a string');
		const adapter = this.adapter;
		const initialState = this.getState();
		if (adapter) {
			adapter.mount(watcher, propertyName, initialState);
		}
	}

	// config() {
	//
	// }

	/**
	 * Broadcast is private method for broadcasting events to adapter about
	 * state changing
	 */
	[broadcast](data = {}, callback = () => {}) {
		const adapter = this.adapter;
		if (adapter) {
			adapter.broadcast(data, callback);
		}
	}

	/**
	 * Remove change watcher
	 */
	unmount(watcher) {
		const adapter = this.adapter;
		if (adapter) {
			adapter.unmount(watcher);
		}
	}

	forceUpdate(callback = () => {}) {
		this[broadcast](this.getState(), callback);
	}
}
