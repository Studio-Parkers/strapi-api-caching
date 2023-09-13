# Strapi plugin strapi-api-caching

A plugin that caches API responses into a JSON file and serves the file when the request url matches.

## Table of Contents
- [Requirements](#requirements)
- [Features](#features)
- [Installation](#installation)

## Requirements
- Strapi v4.4.0+
- Node 18
- NPM >= 6.0.0

## Features
- Caches API response (of public GET requests) into JSON file with hashed request URI as filename.
- Settings section where you can customize the cache folder, select which endpoints to cache.
- Choice between caching only root endpoints or also cache endpoints with query parameters (e.g. populate, filter, etc.).
- Automatically clears caches when an entry is updated.
- Automatically clears caches of entries that have a relation with an updated entry.

## Installation
Add the plugin to your project:
```bash
yarn add strapi-api-caching
```

Enable the middleware in your config:
```json
[
    ...
    "plugin::strapi-api-caching.caching"
    ...
]
```
