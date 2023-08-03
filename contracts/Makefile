-include .env

install:
	forge install --no-git Openzeppelin/openzeppelin-contracts@v4.8.1 foundry-rs/forge-std smartcontractkit/chainlink@v1.13.0 PaulRBerg/prb-math@v3

deploy:
	forge script script/GiveawayManager.s.sol:GiveawayManagerScript --rpc-url ${RPC_URL} --etherscan-api-key ${EXPLORER_KEY} --broadcast --legacy --verify -vvvv


deploy-local:
	forge script script/GiveawayManager.s.sol:GiveawayManagerScript --rpc-url ${LOCAL_RPC_URL} --broadcast -vvvv

# tests
test-contracts-all:
	forge test -vvvvv

test-contracts-offline:
	forge test --no-match-test testFork -vvvv

test-contracts-online:
	forge test --match-test testFork -vvvv

test-contracts-invariant:
	forge test --match-test invariant -vvvvv

# docs
gen-docs:
	forge doc

run-doc-server:
	forge doc --serve --port 4000

clean:
	rm -rf lib
