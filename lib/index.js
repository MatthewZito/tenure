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


	// cap 5
	// put k1
	// put k2, get k1
	// put k3, get k1
	// put k4, get k1
	// put k5, get k1
	// put k6, get k1
	// put k7, get k1

	// ll k6|k1|k5|k4|k3| s = 5 *
	// c k6|k1|k3|k4|k5 s = 5

	get (key) {
		if (!this.cache.has(key)) return null;

		const node = this.cache.get(key);
		// console.log('BEFORE', this.adapter)
		this.adapter.remove(node);

		this.adapter.push(node.data);
		// console.log('AFTER', this.adapter)

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

		const node = this.adapter.push(Entry(key, value));
		this.cache.set(key, node);
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
