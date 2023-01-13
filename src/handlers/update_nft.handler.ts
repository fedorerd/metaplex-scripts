import { CreatorInput } from '@metaplex-foundation/js';
import { PublicKey, Transaction } from '@solana/web3.js';
import { Signer } from 'crypto';
import { Client } from '../core';

export async function updateNft(client: Client, mints: PublicKey[], args: {
    newUpdateAuthority?: PublicKey;
    symbol?: string;
    sellerFeeBasisPoints?: number;
    creators?: CreatorInput[];
    isMutable?: boolean;
}) {


    const { metaplex, connection, keypair } = client

    const nftClient = metaplex.nfts()
    const tx = new Transaction()

    await Promise.all(
        mints.map(async (mintAddress) => {
            const nft = await nftClient.findByMint({
                mintAddress
            })

            await nftClient.update({
                nftOrSft: nft,
                ...args
            })
        })
    )

}