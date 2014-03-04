#!/bin/sh

echo "*********** BEGIN PRODUCTION SCRIPT *************"

# Copy master files
cp -R -f reveal/master/* reveal/client

# Replace master multiplex config with client config
#mv('-f', 'reveal/client/js/reveal-config-client.js', 'reveal/client/js/reveal-config.js');
mv -f reveal/client/js/reveal-config-client.js reveal/client/js/reveal-config.js