class MockIntersectionObserver implements IntersectionObserver {
	readonly root: Element | Document | null = null;
	readonly rootMargin: string = "0px";
	readonly thresholds: ReadonlyArray<number> = [0];
	private callback: IntersectionObserverCallback;

	constructor(callback: IntersectionObserverCallback) {
		this.callback = callback;
	}

	observe(target: Element) {
		this.callback(
			[
				{
					isIntersecting: true,
					intersectionRatio: 1,
					intersectionRect: {} as DOMRectReadOnly,
					boundingClientRect: {} as DOMRectReadOnly,
					rootBounds: null,
					target,
					time: Date.now()
				}
			],
			this
		);
	}
	unobserve() {}
	disconnect() {}
	takeRecords(): IntersectionObserverEntry[] {
		return [];
	}
}

Object.defineProperty(window, "IntersectionObserver", {
	writable: true,
	configurable: true,
	value: MockIntersectionObserver
});
