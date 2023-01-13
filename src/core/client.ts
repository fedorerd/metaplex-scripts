import { keypairIdentity, Metaplex } from "@metaplex-foundation/js";
import { Connection, Keypair } from "@solana/web3.js";
import base58 from 'bs58';

export class Client {
    connection: Connection
    keypair: Keypair
    metaplex: Metaplex

    constructor (
        rpc_url: string,
        bs58_private_key: string
    ) {
        this.connection = new Connection(rpc_url)
        this.keypair = Keypair.fromSecretKey(Uint8Array.from(base58.decode(bs58_private_key)))
        this.metaplex = new Metaplex(this.connection).use(keypairIdentity(this.keypair))
    }
}