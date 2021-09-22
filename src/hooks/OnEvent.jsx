import React from 'react';
import PropTypes from 'prop-types';

import { HOC } from '@nti/lib-commons';

import { addListener, removeListener } from '../events';

class OnEvent extends React.Component {
	static propTypes = {
		_component: PropTypes.elementType,
		_events: PropTypes.object,
	};

	attachRef = x => (this.ref = x);

	componentDidMount() {
		const { _events } = this.props;

		this.setupListeners(_events);
	}

	componentWillUnmount() {
		if (this.removeListeners) {
			this.removeListeners();
		}
	}

	setupListeners(events) {
		const entries = Object.entries(events);

		const toCleanUp = entries.reduce((acc, [name, handler]) => {
			const doHandle = (...args) => this.onEvent(handler, ...args);

			addListener(name, doHandle);

			acc.push(() => {
				removeListener(name, doHandle);
			});

			return acc;
		}, []);

		this.removeListeners = () => {
			for (let cleanup of toCleanUp) {
				cleanup();
			}

			delete this.removeListeners;
		};
	}

	onEvent = (handler, ...args) => {
		if (handler && typeof handler === 'function') {
			return handler(this.props, ...args);
		}

		if (this.ref && this.ref[handler]) {
			return this.ref[handler](...args);
		}
	};

	render() {
		const { _component: Cmp, ...otherProps } = this.props;

		delete otherProps['_event'];

		return <Cmp {...otherProps} ref={this.attachRef} />;
	}
}

export default function onEvent(event, handler = 'onEvent') {
	const events = typeof event === 'string' ? { [event]: handler } : event;

	return function decorator(cmp) {
		class OnEventComposer extends React.Component {
			render() {
				return (
					<OnEvent
						{...this.props}
						_component={cmp}
						_events={events}
					/>
				);
			}
		}

		return HOC.hoistStatics(OnEventComposer, cmp, 'OnEvent');
	};
}
