import React from 'react';
import PropTypes from 'prop-types';
import { toAnalyticsPath } from 'nti-analytics';

export default class ViewEvent extends React.Component {
	static propTypes = {
		type: PropTypes.string.isRequired,
		resourceId: PropTypes.string.isRequired,

		context: PropTypes.any, //Array, or Promise that fulfills with Array
		rootContextId: PropTypes.string,

		children: PropTypes.any,
	}

	static contextTypes = {
		analyticsManager: PropTypes.object.isRequired
	}

	getEvent ({type} = this.props) {
		const {analyticsManager: manager} = this.context;
		return manager && manager[type];
	}

	async getEventArgs ({resourceId, ...data} = this.props) {
		delete data.children;

		if (data.context) {
			data.context = toAnalyticsPath(await Promise.resolve(data.context), resourceId);
		}

		return [resourceId, data];
	}

	async send (trigger) {
		const event = this.getEvent();
		const args = await this.getEventArgs();

		if (event && !event[trigger] && trigger === 'start') {
			trigger = 'send';
		}

		if (event && event[trigger]) {
			event[trigger](...args);
		}
	}


	componentDidMount () {
		this.send('start');
	}

	componentDidUpdate () {
		this.send('update');
	}

	componentWillUnmount () {
		this.send('stop');
	}

	render () {
		return this.props.children || null;
	}
}
