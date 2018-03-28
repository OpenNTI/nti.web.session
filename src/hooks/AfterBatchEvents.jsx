import React from 'react';
import PropTypes from 'prop-types';
import {HOC} from 'nti-commons';
import {Hooks} from 'nti-analytics';

class AfterBatchEvents extends React.Component {
	static propTypes = {
		_component: PropTypes.element
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
