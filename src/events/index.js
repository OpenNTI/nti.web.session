import Bus from './Bus';

export * from './Constants';

export function emit (name, ...args) {
	return Bus.emit(name, ...args);
}

export function addListener (name, fn) {
	return Bus.addListener(name, fn);
}

export function removeListener (name, fn) {
	return Bus.removeListener(name, fn);
}
