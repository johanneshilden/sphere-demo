#!/bin/bash
cd "$(dirname "$0")"
browserify -t babelify js/main.js | uglifyjs -o ./bundle.js

