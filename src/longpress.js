export function addLongPressListener(target, callback, options = {}) {
	const {
		delay = 500,
		eventName = 'longpress',
		triggerOnContextMenu = false,
		capture = false,
	} = options;

	if (!target || typeof target.addEventListener !== 'function') {
		return () => { };
	}

	let timer;
	const clear = () => {
		if (timer !== undefined) {
			if (typeof window !== 'undefined' && window.clearTimeout) {
				window.clearTimeout(timer);
			} else {
				clearTimeout(timer);
			}
			timer = undefined;
		}
	};

	const start = (event) => {
		clear();
		timer = setTimeout(() => {
			timer = undefined;
			if (typeof callback === 'function') {
				callback(event);
			}
			target.dispatchEvent(new CustomEvent(eventName, { bubbles: true, cancelable: true, detail: { originalEvent: event } }));
		}, delay);
	};

	const handleContextMenu = (event) => {
		if (!triggerOnContextMenu) {
			event.preventDefault();
		}
		clear();
	};

	const startEvents = ['pointerdown', 'mousedown', 'touchstart'];
	const endEvents = ['pointerup', 'pointercancel', 'pointerleave', 'mouseup', 'mouseleave', 'touchend', 'touchcancel'];

	startEvents.forEach((type) => target.addEventListener(type, start, { capture }));
	endEvents.forEach((type) => target.addEventListener(type, clear, { capture }));
	target.addEventListener('contextmenu', handleContextMenu, { capture });

	return () => {
		startEvents.forEach((type) => target.removeEventListener(type, start, { capture }));
		endEvents.forEach((type) => target.removeEventListener(type, clear, { capture }));
		target.removeEventListener('contextmenu', handleContextMenu, { capture });
		clear();
	};
}
