#!/bin/sh

echo "*********** BEGIN PRODUCTION SCRIPT *************"

mkdir test

# Copy master files
cp -R -f ../master/* reveal/client

# Replace master multiplex config with client config
#mv('-f', 'reveal/client/js/reveal-config-client.js', 'reveal/client/js/reveal-config.js');
mv -f ../client/js/reveal-config-client.js reveal/client/js/reveal-config.js