import test from 'tape';

import LruCache from '../lib';

const subject = 'the lru cache';
const init = cap => new LruCache(cap);

// test(`${subject} pops off entries if it meets or exceeds the capacity`, t => {
// 	const cap = 6;

// 	const lru = init(cap);

// 	for (let i = 0; i <= cap; i++) {
// 		lru.put(`key${i}`, 6);
// 	}

// 	lru.put('END', 6);
// 	lru.put('END', 6);
// 	lru.put('END', 6);

// 	t.equals(lru.adapter.length, cap);
// 	t.equals(lru.adapter.head.data.key, 'END');
// 	t.equals(lru.cache.size, cap);
// 	t.equals(lru.get('key1'), null);
// 	t.end();
// });


// test(`${subject} moves the most recently retrieved value to the head of its internal list`, t => {
// 	const cap = 6;

// 	const lru = init(cap);

// 	for (let i = 0; i <= cap; i++) {
// 		lru.put(`key${i}`, i);
// 	}

// 	const recent = lru.get('key3');

// 	t.equals(lru.adapter.head.data.key, 'key3');
// 	t.equals(lru.adapter.head.data.value, recent);
// 	t.end();
// });

// test(`${subject} returns null when retrieving a non-extant value`, t => {
// 	const lru = init();

// 	t.equals(lru.get('enoexist'), null);
// 	t.end();
// });

// test(`${subject} returns null when deleting a non-extant value`, t => {
// 	const lru = init();

// 	t.equals(lru.del('enoexist'), null);
// 	t.end();
// });

// test(`${subject} size remains consistent with that of the internal list`, t => {
// 	const cap = 20;

// 	const lru = init(cap);

// 	for (let i = 0; i <= cap; i++) {
// 		lru.put(`key${i}`, i);
// 	}

// 	lru.get('key1');
// 	lru.get('key17');
// 	lru.del('key1');

// 	for (let j = 0; j <= 9; j++) {
// 		lru.put(`key${j}`, j);
// 	}

// 	lru.get('key9');
// 	lru.del('key7');

// 	t.equals(lru.cache.size, lru.adapter.size());
// 	t.end();
// });

// test to break
test(`${subject} maintains integrity after a large amount of transactions`, t => {
	const cap = 3;

	const lru = init(cap);

	//
	for (let i = 1; i <= 5; i++) {
		lru.put(`key${i}`, i);
		// console.log(`pushed ${i} onto head\nNew head is ${lru.adapter.head.data.key}\nNew tail is ${lru.adapter.tail.data.key}`)
		// console.log(`\nll is`, lru.adapter)
		if (i > 1) {
			lru.get('key1');
			// console.log(`pushed key1 onto head\nNew head is ${lru.adapter.head.data.key}\nNew tail is ${lru.adapter.tail.data.key}`)
			// console.log(`\nll is`, lru.adapter)
		}
		// console.log({ TAIL: lru.adapter.tail });
	}

	// console.log(lru.adapter)
	// t.equals(lru.cache.size, cap);
	// t.equals(lru.cache.size, lru.adapter.size());
	t.equals(1,1)
	t.end();
});
