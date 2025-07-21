import { globals } from './setup';
import { MuesliSwapAnalyzer } from '../src/dex/MuesliSwapAnalyzer';
import { HybridOperation, Utxo } from '../src/types';
import { LiquidityPoolState } from '../src/db/entities/LiquidityPoolState';
import { BaseHybridDexAnalyzer } from '../src/dex/BaseHybridDexAnalyzer';
import { Asset } from '../src/db/entities/Asset';

describe('MuesliSwap', () => {
  const analyzer: BaseHybridDexAnalyzer = new MuesliSwapAnalyzer(globals.app);

  it('Can index LP states', async () => {
    const operations: HybridOperation[] = await analyzer.analyzeTransaction(
      globals.MUESLISWAP_LP_STATE_TX
    );

    expect(operations.length).toEqual(1);
    expect(operations[0]).toBeInstanceOf(LiquidityPoolState);
    // @ts-ignore
    expect(operations[0].txHash).toEqual(globals.MUESLISWAP_LP_STATE_TX.hash);
  });

  it('Can index addr1z9cy2gmar6cpn8yymll93lnd7lw96f27kn2p3eq5d4tjr7rshnr04ple6jjfc0cvcmcpcxmsh576v7j2mjk8tw890vespzvgwd', async () => {
    const txn = {
      hash: '732dd27e1fb58d0ee0fb0af69db802551d82ceafdd0af143ad7dc0550308db4b',
      blockHash:
        '0244af51d6385c114b24bb97b3aafe5e094fb05b072d422f56ba68fef781d8e6',
      blockSlot: 153729615,
      inputs: [],
      outputs: [
        {
          forTxHash:
            '732dd27e1fb58d0ee0fb0af69db802551d82ceafdd0af143ad7dc0550308db4b',
          toAddress:
            'addr1z9cy2gmar6cpn8yymll93lnd7lw96f27kn2p3eq5d4tjr7rshnr04ple6jjfc0cvcmcpcxmsh576v7j2mjk8tw890vespzvgwd',
          datum:
            'd8799fd8799f4040ffd8799f581c5dac8536653edc12f6f5e1045d8164b9f59998d3bdc300fc92843489444e4d4b52ff1b0000002d3b7d40b5181eff',
          index: 3,
          lovelaceBalance: 5386390312n,
          assetBalances: [
            {
              asset: Asset.fromId(
                '6fdc63a1d71dc2c65502b79baae7fb543185702b12c3c5fb639ed737.93237c26780971289912e3fc907bd7b2cc1ca33ff248616e13299a1219be3ed0'
              ),
              quantity: 7352188821401n,
            },
            {
              asset: Asset.fromId(
                'de9b756719341e79785aa13c164e7fe68c189ed04d61c9876b2fe53f.4d7565736c69537761705f414d4d'
              ),
              quantity: 1n,
            },
            {
              asset: Asset.fromId(
                '909133088303c49f3a30f1cc8ed553a73857a29779f6c6561cd8093f.84d4a0bfea45bb27edc569ce490ac22f863c48f6e0d270e05365dbc1e21344ad'
              ),
              quantity: 1n,
            },
          ],
        } as Utxo,
      ],
      fee: 0n,
      mints: [],
      datums: {},
      redeemers: [],
    };
    const operations: HybridOperation[] =
      await analyzer.analyzeTransaction(txn);

    expect(operations.length).toEqual(1);
    expect(operations[0]).toBeInstanceOf(LiquidityPoolState);
    // @ts-ignore
    expect(operations[0].txHash).toEqual(txn.hash);
  });

  it('Can index addr1z9cy2gmar6cpn8yymll93lnd7lw96f27kn2p3eq5d4tjr7xnh3gfhnqcwez2pzmr4tryugrr0uahuk49xqw7dc645chscql0d7', async () => {
    const txn = {
      hash: 'ce1024e74e65e4ac8ca642c9d911914127a3eb5d53d5d5763351b4024207d984',
      blockHash:
        '0244af51d6385c114b24bb97b3aafe5e094fb05b072d422f56ba68fef781d8e6',
      blockSlot: 153729615,
      inputs: [],
      outputs: [
        {
          forTxHash:
            'ce1024e74e65e4ac8ca642c9d911914127a3eb5d53d5d5763351b4024207d984',
          toAddress:
            'addr1z9cy2gmar6cpn8yymll93lnd7lw96f27kn2p3eq5d4tjr7xnh3gfhnqcwez2pzmr4tryugrr0uahuk49xqw7dc645chscql0d7',
          datum:
            'd8799fd8799f4040ffd8799f581c279c909f348e533da5808898f87f9a14bb2c3dfbbacccd631d927a3f44534e454bff1a002a39b7181eff',
          index: 3,
          lovelaceBalance: 191572814n,
          assetBalances: [
            {
              asset: Asset.fromId(
                '279c909f348e533da5808898f87f9a14bb2c3dfbbacccd631d927a3f.534e454b'
              ),
              quantity: 51490n,
            },
            {
              asset: Asset.fromId(
                'de9b756719341e79785aa13c164e7fe68c189ed04d61c9876b2fe53f.4d7565736c69537761705f414d4d'
              ),
              quantity: 1n,
            },
            {
              asset: Asset.fromId(
                '909133088303c49f3a30f1cc8ed553a73857a29779f6c6561cd8093f.0de488cdbd03990f316b5b9746e86595e57dfe1b3dd85a74291e0c04fdafbf6e'
              ),
              quantity: 1n,
            },
          ],
        } as Utxo,
      ],
      fee: 0n,
      mints: [],
      datums: {},
      redeemers: [],
    };
    const operations: HybridOperation[] =
      await analyzer.analyzeTransaction(txn);

    expect(operations.length).toEqual(1);
    expect(operations[0]).toBeInstanceOf(LiquidityPoolState);
    // @ts-ignore
    expect(operations[0].txHash).toEqual(txn.hash);
  });

  it('Can index addr1z85t4tvj3rwf40wqnx6x72kqq6c6stra7jvkupnlqrqyarthhd58w0qrqpyv4dc2c2mk98sduawl7l4gjuc9rafyv98sgylfw3', async () => {
    const txn = {
      hash: 'ce1024e74e65e4ac8ca642c9d911914127a3eb5d53d5d5763351b4024207d984',
      blockHash:
        '0244af51d6385c114b24bb97b3aafe5e094fb05b072d422f56ba68fef781d8e6',
      blockSlot: 153729615,
      inputs: [],
      outputs: [
        {
          forTxHash:
            'ce1024e74e65e4ac8ca642c9d911914127a3eb5d53d5d5763351b4024207d984',
          toAddress:
            'addr1z85t4tvj3rwf40wqnx6x72kqq6c6stra7jvkupnlqrqyarthhd58w0qrqpyv4dc2c2mk98sduawl7l4gjuc9rafyv98sgylfw3',
          datum:
            'd8799fd8799f4040ffd8799f581c8a1cfae21368b8bebbbed9800fec304e95cce39a2a57dc35e2e3ebaa444d494c4bff1a039ec70800d87a80181e06ff',
          index: 3,
          lovelaceBalance: 38960429696n,
          assetBalances: [
            {
              asset: Asset.fromId(
                '8a1cfae21368b8bebbbed9800fec304e95cce39a2a57dc35e2e3ebaa.4d494c4b'
              ),
              quantity: 129894n,
            },
            {
              asset: Asset.fromId(
                'de9b756719341e79785aa13c164e7fe68c189ed04d61c9876b2fe53f.4d7565736c69537761705f414d4d'
              ),
              quantity: 1n,
            },
            {
              asset: Asset.fromId(
                '909133088303c49f3a30f1cc8ed553a73857a29779f6c6561cd8093f.3ef937764ed6b36a07b041ab5d1de7f7d776dc711e402d25a5f1d764c535fb4e'
              ),
              quantity: 1n,
            },
          ],
        } as Utxo,
      ],
      fee: 0n,
      mints: [],
      datums: {},
      redeemers: [],
    };
    const operations: HybridOperation[] =
      await analyzer.analyzeTransaction(txn);

    expect(operations.length).toEqual(1);
    expect(operations[0]).toBeInstanceOf(LiquidityPoolState);
    // @ts-ignore
    expect(operations[0].txHash).toEqual(txn.hash);
  });

  it('Can filter CLMM', async () => {
    const txn = {
      hash: 'ce1024e74e65e4ac8ca642c9d911914127a3eb5d53d5d5763351b4024207d984',
      blockHash:
        '0244af51d6385c114b24bb97b3aafe5e094fb05b072d422f56ba68fef781d8e6',
      blockSlot: 153729615,
      inputs: [],
      outputs: [
        {
          forTxHash:
            'ce1024e74e65e4ac8ca642c9d911914127a3eb5d53d5d5763351b4024207d984',
          toAddress:
            'addr1z9qndmhduxjfqvz9rm36p8vsp9vm4l40mx6ndevngkk8srm28uczn6ce6zd5nx2dgr2sza96juq73qz4uhsdxaq74ghs3mz5fw',
          datum:
            'd8799fd8799f4040ffd8799f581c8db269c3ec630e06ae29f74bc39edd1f87c819f1056206e879a1cd614c446a65644d6963726f555344ff1b000000061c0dbc6d181ed8799f0613ffd8799f1306ffd8799f190145190169ff05ff',
          index: 3,
          lovelaceBalance: 26144887878n,
          assetBalances: [
            {
              asset: Asset.fromId(
                '8a1cfae21368b8bebbbed9800fec304e95cce39a2a57dc35e2e3ebaa.446a65644d6963726f555344'
              ),
              quantity: 13295092943n,
            },
            {
              asset: Asset.fromId(
                'de9b756719341e79785aa13c164e7fe68c189ed04d61c9876b2fe53f.76d5a1581738921e32b3a5facb3e4cc230c010a2204be2864bb45948d27612e6'
              ),
              quantity: 1n,
            },
            {
              asset: Asset.fromId(
                'f33bf12af1c23d660e29ebb0d3206b0bfc56ffd87ffafe2d36c42a45.4d7565736c69537761705f634c50'
              ),
              quantity: 1n,
            },
          ],
        } as Utxo,
      ],
      fee: 0n,
      mints: [],
      datums: {},
      redeemers: [],
    };
    const operations: HybridOperation[] =
      await analyzer.analyzeTransaction(txn);

    expect(operations.length).toEqual(0);
  });

  it('Can filter non-related transactions', async () => {
    const operations: HybridOperation[] = await analyzer.analyzeTransaction(
      globals.MINSWAP_SWAP_TX
    );

    expect(operations.length).toEqual(0);
  });
});
