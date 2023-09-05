# Strapi plugin strapi-api-caching

A plugin that caches API responses into a JSON file and serves the file when the request url matches.

![Screenshot 2023-09-05 at 11 38 54 (2)](https://github.com/Studio-Parkers/strapi-api-caching/assets/15921568/dd2058a0-a9c9-47a7-83ac-325c3269e498)
![Screenshot 2023-09-05 at 11 38 38 (2)](https://github.com/Studio-Parkers/strapi-api-caching/assets/15921568/dfcba06b-6681-4e11-b52f-e54be0b8acf6)


## Table of Contents
- [Requirements](#requirements)
- [Features](#features)
- [Installation](#installation)

## Requirements
- Strapi v4.4.0+
- Node 18
- NPM >= 6.0.0

## Features
- Caches API response (of public GET requests) intro JSON file with hashed request URI as filename
- Settings section where you can customize the cache folder, select which endpoints to cache and enable query paramater caching
- Option to cache query paramters (if turned off, only the root url will be cached and any url including query paramters will never be cached)

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
