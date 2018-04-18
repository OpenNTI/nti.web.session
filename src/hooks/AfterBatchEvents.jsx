import React from 'react';
import {HOC} from '@nti/lib-commons';
import {Hooks} from '@nti/lib-analytics';

class AfterBatchEvents extends React.Component {
	static propTypes = {
		_component: function (props, propName, componentName) {
			const prop = props[propName];
			const proto = Object.getPrototypeOf(prop);
			if (proto !== React.Component && proto !== React.PureComponent) {
				return new Error(
					'Invalid prop `' + propName + '` supplied to' +
					' `' + componentName + '`. Must be a class that extends React.Component.'
				);
			}
		}
	}


	attachRef = x => this.ref = x


	componentDidMount () {
		Hooks.addAfterBatchEventsListener(this.afterBatchEvents);
	}


	componentWillUnmount () {
		Hooks.removeAfterBatchEventsListener(this.afterBatchEvents);
	}


	afterBatchEvents = (data) => {
		if (this.ref && this.ref.afterBatchEvents) {
			this.ref.afterBatchEvents(data);
		}
	}


	render () {
		const {_component:Cmp, ...otherProps} = this.props;

		return (
			<Cmp
				{...otherProps}
				ref={this.attachRef}
			/>
		);
	}
}


export default function afterBatchEvents () {
	return function decorator (cmp) {
		class AfterBatchEventsComposer extends React.Component {
			render () {
				return (
					<AfterBatchEvents
						{...this.props}
						_component={cmp}
					/>
				);
			}
		}

		return HOC.hoistStatics(AfterBatchEventsComposer, cmp, 'AfterBatchEvents');
	};
}
