import argparse

from solcx import install_solc, compile_standard

install_solc(version='latest')
parser = argparse.ArgumentParser(description='Deploy contract')
parser.add_argument('--path', type=str, help='path to smart-contract')
args = parser.parse_args()
out = compile_standard(
    {
        "language": "Solidity",
        "sources": {"svetofor.sol": {"content": open(args.path).read()}},
        "settings": {
            "outputSelection": {
                "*": {"*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]}
            }
        },
    })
abi = out['contracts']['svetofor.sol']['SwitchForMoney']['abi']
bytecode = out['contracts']['svetofor.sol']['SwitchForMoney']['evm']['bytecode']['object']

from web3 import middleware
from web3.middleware import geth_poa_middleware
from web3.gas_strategies.time_based import *

addr = "0x07Ed6e1062A6d7C26906Ed90D7c73C869788d374"
PRIVATE_KEY = '648e8a4608d1b3fc20d358f82531623bb19a443f18e563b198eac4daa1f241a8'

w3 = Web3(Web3.HTTPProvider('https://rinkeby.infura.io/v3/a642f65a7de84bc19cc01c4da5b6a1bb'))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)
w3.middleware_onion.add(middleware.latest_block_based_cache_middleware)
w3.middleware_onion.add(middleware.simple_cache_middleware)

strategy = construct_time_based_gas_price_strategy(15)

w3.eth.setGasPriceStrategy(strategy)

ColoredPet = w3.eth.contract(abi=abi, bytecode=bytecode)

nonce = Web3.toHex(w3.eth.getTransactionCount(addr))
gasprice = w3.eth.generateGasPrice()
print("gasprice: ", gasprice)

tr = {'to': None,
      'from': addr,
      'value': Web3.toHex(0),
      'gasPrice': Web3.toHex(gasprice),
      'nonce': nonce,
      'data': "0x" + bytecode,
      'gas': 5000000,
      }

signed = w3.eth.account.sign_transaction(tr, PRIVATE_KEY)
tx = w3.eth.sendRawTransaction(signed.rawTransaction)
tx_receipt = w3.eth.waitForTransactionReceipt(tx)

ColoredPet = w3.eth.contract(address=tx_receipt.contractAddress, abi=abi)

print("----")
print("Done.")
