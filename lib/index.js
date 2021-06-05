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

		return this.adapter.head;
	}

	del (key) {
		if (!this.cache.has(key)) return null;

		const node = this.cache.get(key);

		this.adapter.remove(node);
		this.cache.delete(key);
	}
}

export default LruCache;


// GET - check if item in cache, x
// if NOT, return null and exit x
// yes, move to head of list and return x

// if cache full, also pop off tail of list (LRU)

// PUT - if item in cache
// yes, update item value, move to head
// no, is cache full?
// no, add to hashtable and head of list
// full, pop off tail and append the new item

// always add new to head
