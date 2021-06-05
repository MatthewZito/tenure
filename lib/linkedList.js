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
		const newNode = new Node(data);

		if (this.head == null) {
			this.head = this.tail = newNode;
			this.length = 1;
			return newNode;
		}

		// new node becomes head
		newNode.next = this.head;
		newNode.prev = null;

		// prev of old head -> new node
		if (this.head !== null) {
			this.head.prev = newNode;
		}

		// head points to new node
		this.head = newNode;

		this.length++;
		return newNode;
	}

	/**
	 * @summary Excise the current tail of the list
	 * @returns {object} The excised node
	 */
	pop () {
		if (!this.length) return null;

		this.length--;

		const prevTail = this.tail;

		// single-node list
		if (this.tail.prev == null) {
			this.head = null;
			this.tail = null;
			return prevTail;
		}

		// set new tail to prev tail's predecessor
		this.tail = this.tail.prev;

		// new tail has no success
		this.tail.next = null;

		return prevTail;
	}

	/**
	 * @summary Excise the given node from the list
	 * @param {object} staleNode
	 * @returns {this}
	 */
	remove (staleNode) {
		// 1 remove k1 from tail
		// 2 push k1
		if (this.head == null) return;

		if (this.head === staleNode) {
			this.head = staleNode.next;
		}

		if (this.tail === staleNode) {
			this.tail = staleNode.prev; // k2
		}

		// realloc pointers
		if (staleNode.next != null) {
			staleNode.next.prev = staleNode.prev;
		}

		if (staleNode.prev != null) {
			staleNode.prev.next = staleNode.next;
		}

		this.length--;

		return this;
	}

	/**
	 * @summary Returns the current size of the list
	 * @returns {number}
	 */
	size () {
		return this.length;
	}
}

export default OpenDoublyLinkedList;
