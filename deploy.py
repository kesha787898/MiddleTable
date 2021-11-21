import argparse

from solcx import install_solc, compile_standard
from web3 import middleware
from web3.middleware import geth_poa_middleware
from web3.gas_strategies.time_based import *

if __name__ == '__main__':
    install_solc(version='latest')
    parser = argparse.ArgumentParser(description='Deploy contract')
    parser.add_argument('--path', type=str, help='path to smart-contract')
    parser.add_argument('--addr', type=str, help='address od wallet smart-contract')
    parser.add_argument('--private_key', type=str, help='privae key')

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

    w3 = Web3(Web3.HTTPProvider('https://rinkeby.infura.io/v3/a642f65a7de84bc19cc01c4da5b6a1bb'))
    w3.middleware_onion.inject(geth_poa_middleware, layer=0)
    w3.middleware_onion.add(middleware.latest_block_based_cache_middleware)
    w3.middleware_onion.add(middleware.simple_cache_middleware)

    strategy = construct_time_based_gas_price_strategy(15)

    w3.eth.setGasPriceStrategy(strategy)

    ColoredPet = w3.eth.contract(abi=abi, bytecode=bytecode)

    nonce = Web3.toHex(w3.eth.getTransactionCount(args.addr))
    gasprice = w3.eth.generateGasPrice()
    print("gasprice: ", gasprice)

    tr = {'to': None,
          'from': args.addr,
          'value': Web3.toHex(0),
          'gasPrice': Web3.toHex(gasprice),
          'nonce': nonce,
          'data': "0x" + bytecode,
          'gas': 5000000,
          }

    signed = w3.eth.account.sign_transaction(tr, args.private_key)
    tx = w3.eth.sendRawTransaction(signed.rawTransaction)
    tx_receipt = w3.eth.waitForTransactionReceipt(tx)

    ColoredPet = w3.eth.contract(address=tx_receipt.contractAddress, abi=abi)

    print("----")
    print("Done.")
