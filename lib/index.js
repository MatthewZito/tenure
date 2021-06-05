import OpenDoublyLinkedList from './linkedList';

function Entry (key, value) {
	return {
		key,
		value
	};
}

class LruCache {
	constructor (capacity) {
		this.adapter = new OpenDoublyLinkedList();
		this.cache = new Map();
		this.capacity = capacity || 10;
	}

	/**
	 * @summary Retrieve an item from the cache; the item will be designated 'most-recently used'
	 * @param {any} key
	 * @returns {(any|null)} The retrieved value, if extant; else, null
	 */
	get (key) {
		if (!this.cache.has(key)) return null;

		const node = this.cache.get(key);

		this.adapter.remove(node);
		this.adapter.push(node.data);

		// the node itself is updated qua the list
		// we want the cache to reflect the actual state
		this.cache.set(key, this.adapter.head);

		return node.data.value;
	}

	/**
	 * @summary Place or update an item in the cache
	 * If the list has reached the specified capacity, the least-recently used value is excised from the list
	 * @param {any} key
	 * @param {any} value
	 * @returns {any} The given value
	 */
	put (key, value) {
		if (this.cache.has(key)) {

			const node = this.cache.get(key);

			this.adapter.remove(node);
		} else if (this.adapter.size() >= this.capacity) {
			const lru = this.adapter.pop();

			this.cache.delete(lru.data.key);
		}

		this.adapter.push(Entry(key, value));

		this.cache.set(key, this.adapter.head);

		return value;
	}

	/**
	 * @summary Remove an item from the cache, if extant
	 * @param {any} key
	 * @returns {(any|null)} The value of the deleted item, if extant; else, null
	 */
	del (key) {
		if (!this.cache.has(key)) return null;

		const node = this.cache.get(key);

		this.adapter.remove(node);
		this.cache.delete(key);

		return node.data.value;
	}
}

export default LruCache;
