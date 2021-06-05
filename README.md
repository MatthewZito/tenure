# Tenure | Manageable LRU caching

`Tenure` is a manageable LRU cache instance that uses hashmap lookups and an Open Doubly Linked List to enact the [Least-Recently Used algorithm](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU))

## Installation

```bash
npm install tenure
```

OR

```bash
yarn add tenure
```

![LRU Cache Algorithm](https://github.com/matthewzito/tenure/blob/master/doc/lru.png)

## Supported Environments

`Tenure` currently supports UMD, CommonJS (node versions >= 10), and ESM build-targets

Commonjs:

```js
const LruCache = require('tenure');
```

ESM:

```js
import LruCache from 'tenure';
```

## API

### new LruCache(capacity?: Number): LruCache

*Initialize a new cache instance with a given capacity*

When capacity is reached, the algorithm will begin removing the least-recently used record on every `put` transaction.
Capacity indicates the maximum number of records to maintain for a given cache.

Cache defaults to 10.

**Example**

```js
import LruCache from 'tenure';

const cache = new LruCache(10);
```

### LruCache.get(key: any): (any|null)

*Retrieve an item from the cache; the item will be designated 'most-recently used'*

**Example**

```js
import LruCache from 'tenure';

const cache = new LruCache(10);

cache.put('key1', 'val1');
cache.get('key1'); // 'val1'
cache.get('key4'); // null
```

### LruCache.put(key: any, value: any): any

*Insert or update an item in the cache*

If the list has reached the specified capacity, the least-recently used value is evicted from the cache.

**Example**

```js
import LruCache from 'tenure';

const cache = new LruCache(10);

cache.put('key1', 'val1');
```

### LruCache.del(key: any): (any|null)

*Remove an item from the cache, if extant*

**Example**

```js
import LruCache from 'tenure';

const cache = new LruCache(10);

cache.put('key1', 'val1');
cache.del('key1'); // 'val1'
cache.del('key9'); // null
```
