'use strict';

import {Duplex} from 'stream'

const properties = Symbol('private properties')

export default class ZeroService extends Duplex {

	constructor() {

		super({
			objectMode: true,
		})

		const watchers = new Set()

		this[properties] = {
			watchers,
			state: {},
			exposed: [],
		}
	}

	_write(chunk, encoding, done = () => {}) {
		done();
	}

	_broadcast(data = {}) {
		this[properties].watchers.forEach((watcher) => watcher(data))
	}

	get exposed() {
		return this[properties]['exposed'];
	}

	set exposed(value) {

		if (!Array.isArray(value)) {
			value = [value]
		}

		this[properties]['exposed'] = value.filter(onlyExisting)
	}

	bind(watcher) {
		this[properties].watchers.add(watcher)
	}

	setState(...args) {

		let name = null, data, preventBroadcast = false

		if (typeof args[0] === 'string') {
			name = args[0]
			data = args[1]
			preventBroadcast = typeof args[2] === 'undefined' ? preventBroadcast : !!args[2]
		} else {
			data = args[0];
			preventBroadcast = typeof args[1] === 'undefined' ? preventBroadcast : !!args[1]
		}

		if (name) {
			this[properties].state[name] = data
		} else {
			this[properties].state = data
		}

		if (!preventBroadcast) {
			this._broadcast('update', this[properties].state)
			this.write(this.getState())
		}
	}

	getState() {

		const {state} = this[properties]
		let newState = Object.assign({}, state)

		this.exposed.forEach((key) => {

			const keyExists = key in this
			if (!keyExists) {
				return
			}

			if (typeof this[key] === 'function') {
				newState[key] = this[key].bind(this)
			} else {
				newState[key] = this[key]
			}

		})

		return newState;
	}
}
