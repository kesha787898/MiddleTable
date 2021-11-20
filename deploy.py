import argparse

from solcx import install_solc
from eth_account import Account

install_solc(version='latest')
from web3 import Web3, HTTPProvider
from solcx import compile_source

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Deploy contract')
    parser.add_argument('--path', type=str, help='path to smart-contract')
    args = parser.parse_args()

    with open(args.path, 'r') as contract:
        s = str(contract.read())
        compiled_sol = compile_source(source=s)
        contract_interface = compiled_sol['<stdin>:Greeter']

        w3 = Web3(HTTPProvider("rinkeby.etherscan.io"))
        w3.eth.enable_unaudited_features()
        account = Account.from_key(123)
        contract_ = w3.eth.contract(abi=contract_interface['abi'], bytecode=contract_interface['bin'])
        contract_data = contract_.constructor().buildTransaction()
        signed = w3.eth.account.signTransaction(contract_data, 213)
        w3.eth.sendRawTransaction(signed.rawTransaction)
