from web3 import Web3
from pygame import mixer

w3 = Web3(Web3.HTTPProvider('https://rinkeby.infura.io/v3/a642f65a7de84bc19cc01c4da5b6a1bb'))
ABI = """[{"inputs":[],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"id","type":"string"}],"name":"NewSwitch","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"id","type":"string"}],"name":"SwitchOff","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"id","type":"string"}],"name":"SwitchOn","type":"event"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"AmountToEnable","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"CreateSwitch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"IsOn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"newOwner","type":"address"}],"name":"TransferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"VoteOff","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"VoteOn","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"}]"""
contract = w3.eth.contract("0xD0d86636E4b9a789075fC579A737fAA39C37eb4d", abi=ABI)

isOn = True
isMusicPlaying = True
mixer.init()
mixer.music.load('audio.mp3')
mixer.music.play()
while True:
    isOn = contract.functions.IsOn("c").call()
    if isOn != isMusicPlaying:

        if isOn:
            mixer.music.play()
            isMusicPlaying = True
        else:
            mixer.music.stop()
            isMusicPlaying = False
