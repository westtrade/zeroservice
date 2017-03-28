import React from 'react';

export default class testComponent extends React.Component {
	constructor() {
		super();
		this.state = {
			test: null,
		}
	}

	render() {
		return (
			<div>{ JSON.stringify(this.state.test) }</div>
		)
	}
}
