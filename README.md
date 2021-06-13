[![Build
Status](https://travis-ci.com/MatthewZito/tenure.svg?branch=master)](https://travis-ci.com/MatthewZito/tenure)
[![npm version](https://badge.fury.io/js/tenure.svg)](https://badge.fury.io/js/tenure)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Tenure | Manageable LRU caching

`Tenure` is a manageable LRU cache instance that uses hashmap lookups and an Open Doubly Linked List to enact the
[Least-Recently Used algorithm](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU))

## Algorithm

![LRU Cache Algorithm](https://github.com/matthewzito/tenure/blob/master/doc/lru.png)

## Installation

```bash
npm install tenure
```

OR

```bash
yarn add tenure
```


## Supported Environments

`Tenure` currently supports UMD, CommonJS (node versions >= 10), and ESM build-targets

## API Reference


<br><a name="LruCache"></a>

# LruCache

* [LruCache](#LruCache)
    * [new LruCache(capacity, cb)](#new_LruCache_new)
    * [.get(key)](#LruCache+get) ⇒ <code>any</code> \| <code>null</code>
    * [.put(key, value)](#LruCache+put) ⇒ <code>boolean</code>
    * [.del(key)](#LruCache+del) ⇒ <code>boolean</code>
    * [.keys()](#LruCache+keys) ⇒ <code>array</code>
    * [.has(key)](#LruCache+has) ⇒
    * [.lru()](#LruCache+lru) ⇒ <code>array</code> \| <code>null</code>
    * [.drop()](#LruCache+drop)
    * [.resize(cap)](#LruCache+resize) ⇒ <code>number</code>
    * [.size()](#LruCache+size) ⇒ <code>number</code>
    * [.capacity()](#LruCache+capacity) ⇒ <code>number</code>


<br><a name="new_LruCache_new"></a>

## new LruCache(capacity, cb)
> Implements a canonical Least Recently-Used Cache


| Param | Type | Description |
| --- | --- | --- |
| capacity | <code>number</code> | The maximum capacity (items) of the cache; beyond this threshold, the eviction policy is enacted. Defaults to 10 |
| cb | <code>function</code> | Optional callback to be invoked upon each eviction; called with evicted item key, value |


<br><a name="LruCache+get"></a>

## lruCache.get(key) ⇒ <code>any</code> \| <code>null</code>
Retrieve an item from the cache; if extant, the item will be designated 'most-recently used'
**Returns**: <code>any</code> \| <code>null</code> - The retrieved value, if extant; else, null  

| Param | Type |
| --- | --- |
| key | <code>any</code> | 


<br><a name="LruCache+put"></a>

## lruCache.put(key, value) ⇒ <code>boolean</code>
Add or update a given key / value pair in the cache

Put transactions will move the key to the head of the cache, designating it as 'most recently-used'

If the cache has reached the specified capacity, Put transactions will also enact the eviction policy,
thereby removing the least recently-used item
**Returns**: <code>boolean</code> - A boolean indicating whether an eviction occurred  

| Param | Type |
| --- | --- |
| key | <code>any</code> | 
| value | <code>any</code> | 


<br><a name="LruCache+del"></a>

## lruCache.del(key) ⇒ <code>boolean</code>
Remove an item corresponding to a given key from the cache, if extant
**Returns**: <code>boolean</code> - A boolean indicating whether of not the delete transaction occurred  

| Param | Type |
| --- | --- |
| key | <code>any</code> | 


<br><a name="LruCache+keys"></a>

## lruCache.keys() ⇒ <code>array</code>
**Returns**: <code>array</code> - An array of all keys currently extant in the cache  

<br><a name="LruCache+has"></a>

## lruCache.has(key) ⇒
Verify the existence of a key in the cache without enacting the eviction policy
**Returns**: A boolean flag verifying the existence (or lack thereof) of a given key in the cache  

| Param | Type |
| --- | --- |
| key | <code>any</code> | 


<br><a name="LruCache+lru"></a>

## lruCache.lru() ⇒ <code>array</code> \| <code>null</code>
**Returns**: <code>array</code> \| <code>null</code> - the least recently-used key / value pair, or null if not extant  

<br><a name="LruCache+drop"></a>

## lruCache.drop()
Drop all items from the cache, effectively purging it

<br><a name="LruCache+resize"></a>

## lruCache.resize(cap) ⇒ <code>number</code>
Resizes the cache capacity.

Invoking this transaction will evict all least recently-used items to adjust the cache, where necessary
**Returns**: <code>number</code> - the number of evictions enacted  

| Param | Type | Description |
| --- | --- | --- |
| cap | <code>number</code> | new capacity |


<br><a name="LruCache+size"></a>

## lruCache.size() ⇒ <code>number</code>
**Returns**: <code>number</code> - the current size of the cache  

<br><a name="LruCache+capacity"></a>

## lruCache.capacity() ⇒ <code>number</code>
**Returns**: <code>number</code> - the current maximum buffer capacity of the cache  
