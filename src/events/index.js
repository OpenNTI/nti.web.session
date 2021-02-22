import { Events } from '@nti/lib-commons';

export * from './Constants';

export function emit(name, ...args) {
	return Events.Bus.emit(name, ...args);
}

export function addListener(name, fn) {
	return Events.Bus.addListener(name, fn);
}

export function removeListener(name, fn) {
	return Events.Bus.removeListener(name, fn);
}
