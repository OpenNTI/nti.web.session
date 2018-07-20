import React from 'react';
import PropTypes from 'prop-types';
import { toAnalyticsPath } from '@nti/lib-analytics';

export default class ViewEvent extends React.Component {
	static propTypes = {
		type: PropTypes.string.isRequired,
		resourceId: PropTypes.string.isRequired,

		/**
		 *  Array, or Promise that fulfills with the same array type.
		 *
		 * @type {string[]|Object[]|Promise<string[]|Object[]>}
		 */
		context: PropTypes.oneOfType([
			PropTypes.instanceOf(Promise),
			PropTypes.arrayOf(
				PropTypes.oneOfType([
					PropTypes.string,
					PropTypes.shape({
						ntiid: PropTypes.string
					})
				])
			),
		]),
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

	async send (trigger, props = this.props) {
		const event = this.getEvent();
		const args = await this.getEventArgs(props);

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

	componentDidUpdate (prevProps) {
		let action = 'update';

		if (prevProps.resourceId !== this.props.resourceId) {
			action = 'start';
			this.send('stop', prevProps);
		}

		this.send(action);
	}

	componentWillUnmount () {
		this.send('stop');
	}

	render () {
		return this.props.children || null;
	}
}
