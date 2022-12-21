import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js'
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js'
import base58 from 'bs58'
import * as config from './config.json'
import * as hashlist from './hashlist.json'

const keypair = Keypair.fromSecretKey(Uint8Array.from(base58.decode(config.bs58PrivateKey)))
const connection = new Connection(config.rpc_url)
const metaplex = new Metaplex(connection).use(keypairIdentity(keypair))
const nftClient = metaplex.nfts()

const ixPerTx = 15

async function signTx(hashes: string[], index: number) {
    await new Promise(res => setTimeout(res, 1000 * index))

    const tx = new Transaction()

    const current = hashes.filter((_, i) => i >= index * ixPerTx && i < (index + 1) * ixPerTx)

    current.forEach(hash => {
        const mintAddress = new PublicKey(hash)
        const ix = nftClient.builders().verifyCreator({ mintAddress }).getInstructions()
        ix.forEach(ix => tx.add(ix))
    })

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

    tx.recentBlockhash = blockhash,
    tx.lastValidBlockHeight = lastValidBlockHeight
    tx.sign(keypair)

    const raw = tx.serialize()

    try {
        await connection.sendRawTransaction(raw)
        console.log('Success indexes:')
        console.log(index * ixPerTx, '...', (index + 1) * ixPerTx - 1)
    } catch (e) {
        console.log('Failed indexes:')
        console.log(index * ixPerTx, '...', (index + 1) * ixPerTx - 1)
    }
}

async function signNfts() {

    const hashes = hashlist['default'] as string[]

    let txCount = Math.floor(hashes.length / ixPerTx)

    for (let i = 0; i <= txCount; i++) {
       await signTx(hashes, i)
    }

}

signNfts()