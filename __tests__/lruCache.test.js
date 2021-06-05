import test from 'tape';

import LruCache from '../lib';

const subject = 'the lru cache';
const init = cap => new LruCache(cap);

test(`${subject} pops off entries if it meets or exceeds the capacity`, t => {
	const cap = 6;

	const lru = init(cap);

	for (let i = 0; i <= cap; i++) {
		lru.put(`key${i}`, 6);
	}

	lru.put('END', 6);
	lru.put('END', 6);
	lru.put('END', 6);

	t.equals(lru.adapter.length, cap);
	t.equals(lru.adapter.head.data.key, 'END');
	t.equals(lru.cache.size, cap);
	t.equals(lru.get('key1'), null);
	t.end();
});


test(`${subject} moves the most recently retrieved value to the head of its internal list`, t => {
	const cap = 6;

	const lru = init(cap);

	let i = 0;
	while (i <= cap) {
		lru.put(`key${i}`, i);
		lru.get(`key${i}`);
		i++;
	}

	t.equals(lru.adapter.head.data.key, `key${i - 1}`);
	t.equals(lru.adapter.head.data.value, i - 1);

	const recent = lru.get('key3');

	t.equals(lru.adapter.head.data.key, 'key3');
	t.equals(lru.adapter.head.data.value, recent);
	t.end();
});

test(`${subject} returns null when retrieving a non-extant value`, t => {
	const lru = init();

	t.equals(lru.get('enoexist'), null);
	t.end();
});

test(`${subject} returns null when deleting a non-extant value`, t => {
	const lru = init();

	t.equals(lru.del('enoexist'), null);
	t.end();
});

test(`${subject} size remains consistent with that of the internal list`, t => {
	const cap = 20;

	const lru = init(cap);

	for (let i = 0; i <= cap; i++) {
		lru.put(`key${i}`, i);
		lru.get('key1');
	}

	lru.get('key1');
	lru.get('key17');
	lru.del('key1');

	for (let j = 0; j <= 9; j++) {
		lru.put(`key${j}`, j);
	}

	lru.get('key9');
	lru.del('key7');

	t.equals(lru.cache.size, lru.adapter.size());
	t.end();
});

test(`${subject} size remains consistent with that of the internal list`, t => {
	const cap = 20;

	const lru = init(cap);

	for (let i = 0; i <= 50; i++) {
		lru.put(`key${i}`, i);
	}

	lru.get('key49');

	t.equals(lru.cache.size, lru.adapter.size());
	t.end();
});

test(`${subject} internal list maintains integrity when compared to manually observed iterations`, t => {
	const cap = 3;

	const lru = init(cap);

	lru.put('key1'); // head = tail = key1
	t.equals(lru.adapter.head, lru.adapter.tail);
	t.equals(lru.adapter.head.data.key, 'key1');

	lru.put('key2'); // head = k2, tail = k1
	t.equals(lru.adapter.head.data.key, 'key2');
	t.equals(lru.adapter.tail.data.key, 'key1');
	t.equals(lru.adapter.size(), 2);

	lru.get('key1'); // head = k1, tail = k2
	t.equals(lru.adapter.head.data.key, 'key1');
	t.equals(lru.adapter.tail.data.key, 'key2');
	t.equals(lru.adapter.size(), 2);

	lru.put('key3'); // head = k3, tail = k2  | k3, k1, k2 |
	t.equals(lru.adapter.head.data.key, 'key3');
	t.equals(lru.adapter.tail.data.key, 'key2');
	t.equals(lru.adapter.size(), 3);

	lru.get('key1'); // | k1, k3, k2 |
	t.equals(lru.adapter.head.data.key, 'key1');
	t.equals(lru.adapter.tail.data.key, 'key2');
	t.equals(lru.adapter.size(), 3);

	lru.put('key4'); // head = k4, tail = k1 -> | k4, k1, k3 |
	t.equals(lru.adapter.head.data.key, 'key4');
	t.equals(lru.adapter.tail.data.key, 'key3');

	lru.get('key1'); // head = k1, tail = k3 -> | k1, k4, k3 |
	t.equals(lru.adapter.head.data.key, 'key1');
	t.equals(lru.adapter.tail.data.key, 'key3');
	t.equals(lru.adapter.size(), 3);

	t.equals(lru.cache.size, lru.adapter.size());
	t.end();
});
