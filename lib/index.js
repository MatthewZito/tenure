import { isFunction, isNumber } from 'js-heuristics';

import { CircularDoublyLinkedList } from 'connective-tissue';

function Entry (key, data) {
	return {
		key,
		data
	};
}

const noop = () => {};

/**
 * Implements a canonical Least Recently-Used Cache
 * @class LruCache
 * @param {number} capacity The maximum capacity (items) of the cache; beyond this threshold, the eviction policy is enacted. Defaults to 10
 * @param {function?} cb Optional callback to be invoked upon each eviction; called with evicted item key, value
 */
class LruCache {
	constructor (capacity, cb) {
		if (!isFunction(cb)) cb = noop;

		this.adapter = new CircularDoublyLinkedList();
		this.cache = new Map();
		this._capacity = capacity || 10;
		this.cb = cb;
	}

	/**
	 * @summary Retrieve an item from the cache; if extant, the item will be designated 'most-recently used'
	 * @param {any} key
	 * @returns {(any|null)} The retrieved value, if extant; else, null
	 */
	get (key) {
		if (!this.cache.has(key)) return null;

		const node = this.cache.get(key);

		this.adapter.moveToFront(node);

		return node.value.data;
	}

	/**
	 * @summary Add or update a given key / value pair in the cache
	 *
	 * Put transactions will move the key to the head of the cache, designating it as 'most recently-used'
	 *
	 * If the cache has reached the specified capacity, Put transactions will also enact the eviction policy,
	 * thereby removing the least recently-used item
	 * @param {any} key
	 * @param {any} value
	 * @returns {boolean} A boolean indicating whether an eviction occurred
	 */
	put (key, value) {
		const node = this.cache.get(key);

		// key extant in cache
		if (node) {
			node.value.data = value;
			this.adapter.moveToFront(node);
			// update cache ?

			return false;
		}

		// new key
		this.cache.set(
			key,
			this.adapter.pushFront(Entry(key, value))
		);

		// evict
		if (this.adapter.size() > this._capacity) {
			const lru = this.adapter.pop();

			this.cache.delete(lru.value.key);

			this.cb(
				lru.value.key,
				lru.value.data
			);

			return true;
		}

		return false;
	}

	/**
	 * @summary Remove an item corresponding to a given key from the cache, if extant
	 * @param {any} key
	 * @returns {boolean} A boolean indicating whether of not the delete transaction occurred
	 */
	del (key) {
		if (!this.cache.has(key)) return false;

		const node = this.cache.get(key);

		this.adapter.remove(node);
		this.cache.delete(key);

		return true;
	}

	/**
	 * @returns An array of all keys currently extant in the cache
	 */
	keys () {
		const keys = [];

		for (const [key] of this.cache.entries()) {
			keys.push(key);
		}

		return keys;
	}

	/**
	 * @summary Verify the existence of a key in the cache without enacting the eviction policy
	 * @param {any} key
	 * @returns A boolean flag verifying the existence (or lack thereof) of a given key in the cache
	 */
	has (key) {
		return this.cache.has(key);
	}

	/**
	 * @returns {(array|null)} the least recently-used key / value pair, or null if not extant
	 */
	lru () {
		const t = this.adapter.tail();

		if (t) return [t.value.key, t.value.data];
		return null;
	}

	/**
	 * @summary Drop all items from the cache, effectively purging it
	 */
	drop () {
		for (const [key, node] of this.cache.entries()) {
			this.adapter.remove(key);
			this.cache.delete(key);

			this.cb(key, node.value.data);
		}
	}

	/**
	 * @summary Resizes the cache capacity.
	 *
	 * Invoking this transaction will evict all least recently-used items to adjust the cache, where necessary
	 * @param {number} cap new capacity
	 * @returns {number} the number of evictions enacted
	 */
	resize (cap) {
		if (!isNumber(cap)) throw new TypeError('Capacity must be a number, got ', cap);

		let diff = this.adapter.size() - cap;

		if (diff < 0) diff = 0;

		for (let i = 0; i < diff; i++) {
			const lru = this.adapter.tail();
			if (lru) {
				this.adapter.remove(lru);
				this.cache.delete(lru.value.key);

				this.cb(
					lru.value.key,
					lru.value.data
				);
			}
		}

		this._capacity = cap;

		return diff;
	}

	/**
	 * @returns {number} the current size of the cache
	 */
	size () {
		return this.adapter.size();
	}

	/**
	 * @returns {number} the current maximum buffer capacity of the cache
	 */
	capacity () {
		return this._capacity;
	}

}

export default LruCache;
