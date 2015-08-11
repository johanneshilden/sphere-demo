#!/bin/bash
cd "$(dirname "$0")"

sudo -u postgres -H -- psql -U postgres -d antenna_tests -f test_db.sql 

node basic.js
 
# rm scratch/*
 
