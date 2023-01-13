import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js'
import { Metaplex, keypairIdentity, Metadata } from '@metaplex-foundation/js'
import base58 from 'bs58'
import * as config from './config/config.json'
import * as hashlist from './config/hashlist.json'
import fs from 'fs'

