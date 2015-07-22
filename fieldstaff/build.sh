#!/bin/bash
cd "$(dirname "$0")"
browserify -t reactify js/main.js | uglifyjs -o ./bundle.js

