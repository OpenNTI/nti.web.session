import React from 'react';
import PropTypes from 'prop-types';
// import {Manager} from 'nti-analytics';
import {getService} from 'nti-web-client';
import {LocalStorage} from 'nti-web-storage';
import {VisibilityMonitor} from 'nti-lib-dom';

class Manager {
	beginSession () {}
	endSession () {}
}

export default class Session extends React.Component {
	static propTypes = {
		children: PropTypes.any,
		name: PropTypes.string
	}

	static childContextTypes = {
		manager: PropTypes.object
	}

	getChildContext () {
		const {manager} = this.state;
		return {
			manager
		};
	}

	state = {}


	async componentDidMount () {
		const {name = 'Main'} = this.props;
		const service = await getService();
		const storage = LocalStorage;

		if (this.unmounted) {
			const manager = new Manager(name, storage, service);
			manager.beginSession();

			this.setState({ manager });
		}

		window.addEventListener('beforeunload', this.endSession);

		VisibilityMonitor.addChangeListener();
	}


	componentWillUnmount () {
		window.removeEventListener('beforeunload', this.endSession);
		VisibilityMonitor.removeChangeListener(this.onVisibility);
		this.unmounted = true;
		this.setState = () => {};
		this.endSession();
	}


	onVisibilityChanged = (visible) => {
		// const fn = visible
		// 	? resumeSession
		// 	: endSession;
		//
		// fn('visiblity changed');
	}


	endSession = () => {
		const {manager} = this.state;

		if (!manager) {
			return;
		}

		manager.endSession();
	}


	render () {
		return this.props.children;
	}
}
