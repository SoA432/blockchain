const SHA256 = require('crypto-js/sha256.js')

class Block {
    /*Index - where the block sits on the chain
    timestamp - when the block was created
    data - any data that u want to assoicate with this block (transaction detail, etc)
    previousHash - previous block before this one*/
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    } 

    /*Method that calculate hash of this block*/
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    /*Initial block in blockchain*/
    createGenesisBlock(){
        return new Block(0, '01/01/2018', 'Genesis Block', '0')
    }

    /*Return latest block*/
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    /*Add new block to chain*/
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid(){
        /* i=0 - Genesis block*/
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}

let amazingCoin = new Blockchain();
amazingCoin.addBlock(new Block(1, '15/05/2018', { amount: 4}));
amazingCoin.addBlock(new Block(2, '18/05/2018', { amount: 10}));

console.log('Is blockchain valid? ' + amazingCoin.isChainValid());

console.log(JSON.stringify(amazingCoin, null, 4));

amazingCoin.chain[1].data = { amount: 5};
amazingCoin.chain[1].hash = amazingCoin.chain[1].calculateHash();

console.log('Is blockchain valid? ' + amazingCoin.isChainValid());

console.log(JSON.stringify(amazingCoin, null, 4));
