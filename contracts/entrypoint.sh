#!/usr/bin/env sh

. ~/.bashrc
foundryup
anvil > anvil.log &
make install
make deploy-local &
tail -f anvil.log