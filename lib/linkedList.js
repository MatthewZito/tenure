'use strict';

/**
 * @summary Constructs a new node
 * @param {any} data
 * @returns {object} A new node
 */
function Node (data) {
	return {
		data,
		prev: null,
		next: null
	};
}

class OpenDoublyLinkedList {
	constructor (nodeBuilder = Node) {
		this.length = 0;
		this.head = null;
		this.tail = null;
		this.Node = data => new nodeBuilder(data);
	}

	/* Public API */

	/**
	 * @summary Construct a new node with the given data and insert as the new head
	 * @param {Node} data
	 * @returns {object} The newly-constructed node
	 */
	push (data) {
		console.log(this);
		this.length++;

		return this.#insertHead(this.Node(data));
	}
// push(key1), pop(key1) & push(key2), pop(key2) & push(key3)

// head = null
// tail = null
	/**
	 * @summary Excise the current tail of the list
	 * @returns {object} The excised node
	 */
	pop () {
		if (!this.length) return null;

		this.length--;
		return this.#removeTail();
	}

	/**
	 * @summary Excise the given node from the list
	 * @param {object} node
	 * @returns {this}
	 */
	remove (node) {
		if (!this.length) return this;

		this.length--;
		return this.#excise(node);
	}

	/**
	 * @summary Returns the current size of the list
	 * @returns {number}
	 */
	size () {
		return this.length;
	}

	/* Internal API */

	#insertHead (newNode) {
		if (this.head == null) {
			this.head = newNode;
			this.tail = newNode;

			newNode.prev = null;
			newNode.next = null;

		} else {
			this.#insertBefore(this.head, newNode);
		}

		return newNode;
	}

	#insertTail (newNode) {
		if (this.tail == null) {
			this.#insertHead(newNode);
		} else {
			this.#insertAfter(this.tail, newNode);
		}

		return newNode;
	}

	#removeTail () {
		const prevTail = this.tail;

		// single-node list
		if (this.tail.prev == null) {
			this.head = null;
			this.tail = null;
			return prevTail;
		}

		this.tail = this.tail.prev;

		this.tail.next = null;

		return prevTail;
	}

	#excise (node) {
		if (node.prev == null) {
			this.head = node.next;
		} else {
			node.prev.next = node.next;
		}

		if (node.next == null) {
			this.tail = node.prev;
		} else {
			node.next.prev = node.prev;
		}

		return this;
	}

	#insertBefore (node, newNode) {
		newNode.next = node;

		if (node.prev == null) {
			// newNode.prev = null;
			this.head = newNode;
		} else {
			newNode.prev = node.prev;
			node.prev.next = newNode;
		}

		node.prev = newNode;
	}

	#insertAfter (node, newNode) {
		// set previous node to the node we're inserting after
		newNode.prev = node;

		// node was tail
		if (node.next == null) {
			newNode.next = null;
			this.tail = newNode;
		} else {
			newNode.next = node.next;
			node.next.prev = newNode;
		}

		node.next = newNode;
	}
}

export default OpenDoublyLinkedList;
