#!/bin/bash
cd "$(dirname "$0")"
browserify -t babelify js/main.js | uglifyjs -o ./bundle.js
#browserify -t babelify js/main.js -o ./bundle.js

