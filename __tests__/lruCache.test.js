import test from 'tape';

import LruCache from '../lib';

const subject = 'the lru cache';
const init = (cap, cb) => new LruCache(cap, cb);

test(`${subject} pops off entries if it meets or exceeds the capacity`, t => {
	const cap = 6;

	const lru = init(cap);

	for (let i = 0; i <= cap; i++) {
		lru.put(`key${i}`, 6);
	}

	lru.put('END', 6);
	lru.put('END', 6);
	lru.put('END', 6);

	t.equals(lru.size(), cap);
	t.equals(lru.adapter.head().value.key, 'END');
	t.equals(lru.has('END'), true);
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

	t.equals(lru.adapter.head().value.key, `key${i - 1}`);
	t.equals(lru.adapter.head().value.data, i - 1);

	const recent = lru.get('key3');

	t.equals(lru.adapter.head().value.key, 'key3');
	t.equals(lru.adapter.head().value.data, recent);
	t.end();
});

test(`${subject} returns null when retrieving a non-extant value`, t => {
	const lru = init();

	t.equals(lru.get('enoexist'), null);
	t.end();
});

test(`${subject} returns false when deleting a non-extant value`, t => {
	const lru = init();

	t.equals(lru.del('enoexist'), false);
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

	t.equals(lru.cache.size, lru.size());
	t.end();
});

test(`${subject} size remains consistent with that of the internal list`, t => {
	const cap = 20;

	const lru = init(cap);

	for (let i = 0; i <= 50; i++) {
		lru.put(`key${i}`, i);
	}

	lru.get('key49');

	t.equals(lru.cache.size, lru.size());
	t.end();
});

test(`${subject} internal list maintains integrity when compared to manually observed iterations`, t => {
	const cap = 3;

	const lru = init(cap);

	lru.put('key1'); // head = tail = key1
	t.equals(lru.adapter.head(), lru.adapter.tail());
	t.equals(lru.adapter.head().value.key, 'key1');

	lru.put('key2'); // head = k2, tail = k1
	t.equals(lru.adapter.head().value.key, 'key2');
	t.equals(lru.adapter.tail().value.key, 'key1');
	t.equals(lru.size(), 2);

	lru.get('key1'); // head = k1, tail = k2
	t.equals(lru.adapter.head().value.key, 'key1');
	t.equals(lru.adapter.tail().value.key, 'key2');
	t.equals(lru.size(), 2);

	lru.put('key3'); // head = k3, tail = k2  | k3, k1, k2 |
	t.equals(lru.adapter.head().value.key, 'key3');
	t.equals(lru.adapter.tail().value.key, 'key2');
	t.equals(lru.size(), 3);

	lru.get('key1'); // | k1, k3, k2 |
	t.equals(lru.adapter.head().value.key, 'key1');
	t.equals(lru.adapter.tail().value.key, 'key2');
	t.equals(lru.size(), 3);

	lru.put('key4'); // head = k4, tail = k1 -> | k4, k1, k3 |
	t.equals(lru.adapter.head().value.key, 'key4');
	t.equals(lru.adapter.tail().value.key, 'key3');

	lru.get('key1'); // head = k1, tail = k3 -> | k1, k4, k3 |
	t.equals(lru.adapter.head().value.key, 'key1');
	t.equals(lru.adapter.tail().value.key, 'key3');
	t.equals(lru.size(), 3);

	t.equals(lru.cache.size, lru.size());
	t.end();
});

test(`${subject} should return keys`, t => {
	const cap = 15;

	const lru = init(cap);

	for (let i = 0; i <= 20; i++) {
		lru.put(`key${i}`, i);
	}

	const keys = lru.keys();

	for (let i = 0; i < 15; i++) {
		t.equals(keys[i], `key${i + 6}`);
	}

	t.end();
});

test(`${subject} should maintain knowledge of the lru, and support dropping`, t => {
	const maxcap = 3;
	let evictions = 0;

	const lru = init(maxcap, function incr(k, v) {
		if (k != v) t.fail(`Evicted instances not synced; Have (k=${k},v=${v}), Want (k=v)`);
		evictions++;
	});

	lru.put(1, 1);
	lru.put(2, 2);
	lru.get(1);
	lru.put(3, 3);
	lru.get(1);
	lru.put(4, 4);
	lru.get(1);
	lru.put(5, 5);

	if (lru.size() != maxcap) {
		t.fail(`Eviction policy failure; Have size ${lru.size()}, Want size ${maxcap}`);
	}

	if (lru.lru().join() != '4,4') {
		t.fail(`Least recently used failure; Have ${lru.lru()} Want ${[4,4]}`);
	}

	if (evictions != 2)  {
		t.fail(`Eviction policy failure; Have ${evictions} evictions, Want ${2} evictions`);
	}

	evictions = 0;
	lru.drop();

	if (evictions != maxcap) {
		t.fail(`Expected drop to remove all cached values; Have ${evictions} evictions, Want ${maxcap} evictions`);
	}

	if (lru.keys().length != 0) {
		t.fail(`Expected drop to remove all keys; Have ${lru.keys().length} keys, Want ${0} keys`);
	}

	t.end();
});

test(`${subject} capably deletes items as expected`, t => {
	const maxcap = 9;
	let evictions = 0;

	const lru = init(maxcap, function incr(k, v) {
		if (k != v) t.fail(`Evicted instances not synced; Have (k=${k},v=${v}), Want (k=v)`);
		evictions++;
	});

	for (let i = 0; i <= maxcap; i++) lru.put(i, i);

	if (lru.size() != maxcap) t.fail(`Size mismatch; Have ${lru.size()}, Want ${maxcap}`);

	let c = 0;

	function r (k) {
		c++;
		if (!lru.del(k)) t.fail(`Failed to delete item ${k}`);

		if (lru.size() != maxcap - c) t.fail(`Size mismatch; Have ${lru.size()} Want ${c}`)

		if (lru.has(k)) t.fail(`Failed to delete key ${k}`)
	}

	r(maxcap);
	r(maxcap - 1);
	r(maxcap - 3);

	t.end();
});

test(`${subject} method 'has' is inconsequential qua eviction policies`, t => {
	const maxcap = 9;
	let evictions = 0;

	const lru = init(maxcap, function incr(k, v) {
		if (k != v) t.fail(`Evicted instances not synced; Have (k=${k},v=${v}), Want (k=v)`);
		evictions++;
	});


	for (let i = maxcap + 1; i < maxcap * 2; i++) {
		lru.put(i, i);
		lru.has(i);
	}

	if (evictions != 0) {
		t.fail(`Has should not trigger the eviction policy; Have ${evictions} evictions, Want ${0} evictions`);
	}

	t.end();
});

test(`${subject} should resize as expected`, t => {
	const maxcap = 9;
	let evictions = 0;

	const lru = init(maxcap, function incr(k, v) {
		if (k != v) t.fail(`Evicted instances not synced; Have (k=${k},v=${v}), Want (k=v)`);
		evictions++;
	});

	for (let i = 0; i < maxcap; i++) lru.put(i, i);

	lru.resize(maxcap / 3);

	if (evictions != 6) {
		t.fail(`Eviction policy failed; Have ${evictions} evictions, Want ${6} evictions`);
	}

	lru.resize(lru.size() + maxcap)

	for (let i = 0; i <= lru.capacity(); i++) lru.put(i, i);

	if (evictions != 6 + 1) {
		t.fail(`Eviction policy failed; Have ${evictions} evictions, Want ${6 + 1} evictions`);
	}

	t.end();
});

test(`${subject}, mitigation and default values`, t => {
	const maxcap = 9;
	let evictions = 0;

	const lru = init(maxcap, function incr(k, v) {
		if (k != v) t.fail(`Evicted instances not synced; Have (k=${k},v=${v}), Want (k=v)`);
		evictions++;
	});

	if (Array.isArray(lru.lru())) t.fail('LRU should be nil');

	if (lru.del(9)) t.fail('Deleting a non-extant value should return false');

	if (lru.has(9)) t.fail('Has used with a non-extant key should return false');

	for (let i = 0; i < lru.capacity(); i++) lru.put(i, i);

	t.equals(evictions, 0);
 	t.equals(lru.size(), maxcap);

	t.end();
});


test(`${subject} eviction policy should maintain integrity across many transactions`, t => {
	const maxcap = 256;
	let evictions = 0;

	const lru = init(maxcap, function incr(k, v) {
		if (k != v) t.fail(`Evicted instances not synced; Have (k=${k},v=${v}), Want (k=v)`);
		evictions++;
	});


	for (let i = 0; i < maxcap * 2; i++) lru.put(i, i);


	if (lru.size() != maxcap) {
		t.fail(`Cache capacity failure; Have %v, Want %v`, lru.size(), maxcap);
	}

	if (evictions != maxcap) {
		t.fail(`Cache eviction failure; Have %v, Want %v`, evictions, maxcap);
	}

	for (const [i, k] of lru.keys().entries()) {
		const v = lru.get(k);

		if (!v) t.fail('Key retrieval failure');

		if (v != k) t.fail(`Invalid key; Have ${v}, Want ${k}`);

		if (v != i + maxcap) t.fail(`Invalid key; Have ${v}, Want ${i + maxcap}`);
	}

	for (let i = 0; i < maxcap; i++) {
		if (lru.has(i)) t.fail(`Cache contains stale value; ${i} should have been evicted`);
	}

	for (let i = maxcap; i < maxcap * 2; i++) {
		if (!lru.get(i)) t.fail(`Premature cache eviction; ${i} should not have been evicted`);
	}

	t.end();
});
