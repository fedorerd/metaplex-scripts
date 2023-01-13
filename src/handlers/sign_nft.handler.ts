import { PublicKey, Transaction } from '@solana/web3.js'
import { Metadata, Nft, Sft } from '@metaplex-foundation/js'
import { Client } from '../core'

const maxInstructions = 25

export async function signNft(client: Client, mints: PublicKey[]) {

    const { metaplex, connection, keypair } = client

    const nftClient = metaplex.nfts()
    const tx = new Transaction()

    let ixCount: number = 0

    mints.forEach(mint => {
        const ix = nftClient.builders().verifyCreator({ mintAddress: mint }).getInstructions()
        ix.forEach(ix => {
            if (ixCount > maxInstructions) return
            tx.add(ix)
            ixCount++
        })
    })

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

    tx.recentBlockhash = blockhash,
    tx.lastValidBlockHeight = lastValidBlockHeight
    tx.sign(keypair)

    const raw = tx.serialize()

    try {
        const txid = await connection.sendRawTransaction(raw)
        console.log('Tx sent successfully: ')
        console.log(txid)
    } catch (e) {
        console.log('Tx failed')
        console.error(e.message)
    }
}

export async function validateVerifiedCreators(client: Client, mints: PublicKey[], creators?: PublicKey[]) {

    const { metaplex } = client

    const nfts = await metaplex.nfts().findAllByMintList({
        mints
    }).then(nfts => nfts.filter(nft => nft !== null) as (Metadata | Nft | Sft)[])

    const unverified = nfts
        .filter(nft => 
            creators 
            ? nft.creators.filter(c => creators.some(expected => expected.equals(c.address))).every(c => c.verified)
            : nft.creators.every(c => c.verified)
        )
        .map(nft => nft.address.toBase58())

    console.log(unverified)

}