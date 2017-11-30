import React from 'react';
import PropTypes from 'prop-types';
import {Manager} from 'nti-analytics';
import {getService, getAppUser} from 'nti-web-client';
import {LocalStorage} from 'nti-web-storage';
import {InactivityMonitor} from 'nti-lib-dom';
import Logger from 'nti-util-logger';


const logger = Logger.get('analytics:session');


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

		const monitor = this.activeStateMonitor = new InactivityMonitor(document.body);

		this.unsubscribe = monitor.addChangeListener(this.onActiveStateChanged);

		this.setup();
	}


	componentWillUnmount () {
		window.removeEventListener('beforeunload', this.endSession);

		this.unsubscribe();
		this.unsubscribe = () => {};

		this.unmounted = true;
		this.setState = () => {};
		this.endSession();
	}


	async setup () {
		delete this.ended;
		logger.debug('Setting up Session');

		const {name = 'Main'} = this.props;
		const [service, user] = await Promise.all([getService(), getAppUser()]);
		const storage = LocalStorage;


		if (!this.unmounted) {
			logger.debug('Constructing the Analytics Manager');
			const manager = new Manager(name, storage, service);
			manager.setUser(user.getID());
			manager.beginSession();

			this.setState({ manager });
		}
	}


	onActiveStateChanged = (active) => {
		logger.debug('Active State changed. (active: %s)', Boolean(active));
		const { manager } = this.state;

		if (this.ended) {
			return;
		}

		if (!active) {
			manager.suspendEvents();
			manager.endSession();
		} else {
			manager.resumeEvents();
			manager.beginSession();
		}
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
