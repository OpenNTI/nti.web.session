import React from 'react';
import PropTypes from 'prop-types';
import {Manager} from 'nti-analytics';
import {getService, getAppUser} from 'nti-web-client';
import {LocalStorage} from 'nti-web-storage';
import {VisibilityMonitor} from 'nti-lib-dom';


export default class Session extends React.Component {
	static propTypes = {
		children: PropTypes.any,
		name: PropTypes.string
	}

	static childContextTypes = {
		analyticsManager: PropTypes.object
	}

	getChildContext () {
		const { manager } = this.state;
		return {
			analyticsManager: manager
		};
	}

	state = {}


	componentDidMount () {
		window.addEventListener('beforeunload', this.endSession);
		VisibilityMonitor.addChangeListener(this.onVisibilityChanged);
		this.setup();
	}


	componentWillUnmount () {
		window.removeEventListener('beforeunload', this.endSession);
		VisibilityMonitor.removeChangeListener(this.onVisibilityChanged);
		this.unmounted = true;
		this.setState = () => {};
		this.endSession();
	}


	async setup () {
		delete this.ended;

		const {name = 'Main'} = this.props;
		const [service, user] = await Promise.all([getService(), getAppUser()]);
		const storage = LocalStorage;


		if (!this.unmounted) {
			const manager = new Manager(name, storage, service);
			manager.setUser(user.getID());
			manager.beginSession();

			this.setState({ manager });
		}
	}


	onVisibilityChanged = (visible) => {
		// const fn = visible
		// 	? resumeSession
		// 	: endSession;
		//
		// fn('visiblity changed');
	}


	endSession = () => {
		const { manager } = this.state;

		if (!manager || this.ended) {
			return;
		}

		this.ended = true;

		manager.endSession();
	}


	render () {
		return this.props.children || null;
	}
}
