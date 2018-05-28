const SHA256 = require('crypto-js/sha256.js')

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    /*Index - where the block set on the chain
    timestamp - when the block was created
    data - any data that u want to assoicate with this block (transaction detail, etc)
    previousHash - previous block before this one*/
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    } 

    /*Method that calculate hash of this block*/
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log('Block mined: ' + this.hash);
    }
}

class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    /*Initial block in blockchain*/
    createGenesisBlock(){
        return new Block('01/01/2018', 'Genesis Block', '0')
    }

    /*Return latest block*/
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    /*Add new block to chain*/
    // addBlock(newBlock){
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        
        return balance;
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
amazingCoin.createTransaction(new Transaction('address1', 'address2', 100));
amazingCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\nStrart the miner...');
amazingCoin.minePendingTransactions('someOne-address');

console.log('\nBalance of someOne is', amazingCoin.getBalanceOfAddress('someOne-address'));

console.log('\nStrart the miner again...');
amazingCoin.minePendingTransactions('someOne-address');

console.log('\nBalance of someOne is', amazingCoin.getBalanceOfAddress('someOne-address'));

console.log('Is blockchain valid? ' + amazingCoin.isChainValid());
console.log(JSON.stringify(amazingCoin, null, 4));

// console.log('Mining block 1...');
// amazingCoin.addBlock(new Block(1, '15/05/2018', { amount: 4}));

// console.log('Mining block 2...');
// amazingCoin.addBlock(new Block(2, '18/05/2018', { amount: 10}));



// console.log('Is blockchain valid? ' + amazingCoin.isChainValid());

// console.log(JSON.stringify(amazingCoin, null, 4));

// amazingCoin.chain[1].data = { amount: 5};
// amazingCoin.chain[1].hash = amazingCoin.chain[1].calculateHash();

// console.log('Is blockchain valid? ' + amazingCoin.isChainValid());

// console.log(JSON.stringify(amazingCoin, null, 4));
