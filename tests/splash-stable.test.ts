import { Dex } from '../src/constants';
import { Asset } from '../src/db/entities/Asset';
import { LiquidityPoolState } from '../src/db/entities/LiquidityPoolState';
import { BaseAmmDexAnalyzer } from '../src/dex/BaseAmmDexAnalyzer';
import { SplashStableAnalyzer } from '../src/dex/SplashStableAnalyzer';
import { AmmDexOperation, Utxo } from '../src/types';
import { ASSETS } from './fixtures';
import { globals } from './setup';

describe('Splash Stable', () => {
  const analyzer: BaseAmmDexAnalyzer = new SplashStableAnalyzer(globals.app);

  it('Can index stable v1 pools', async () => {
    // https://cardanoscan.io/transaction/5b678b0d877ff7f879fc9ec233a8663d5dd7a4fbb598a1300b7b205c00f10eed
    const expected = {
      poolType: 'stable',
      id: '5cb6e093f8a900f82ad299c807511b9faf2273adbac58cf4a35a4c99.72734552475f4144415f4e4654',
      x: {
        asset: '',
        amount: '5476896306247',
      },
      y: {
        asset: ASSETS.OADA.identifier(''),
        amount: '7983860256785',
      },
      lq: {
        asset: '153c2bfbe184b1edc7a0d89bca1608b1dccb24535102fa1f732a9ca2.6c71',
        amount: '9223358604495062282',
      },
      outputId: {
        transactionId:
          '5b678b0d877ff7f879fc9ec233a8663d5dd7a4fbb598a1300b7b205c00f10eed',
        transactionIndex: 0,
      },
      lpFeeNumerator: 100,
      treasuryFeeNumerator: 0,
      treasuryA: 0,
      treasuryB: 0,
      feePercent: 0.1,
    };

    const operations: AmmDexOperation[] = await analyzer.analyzeTransaction({
      hash: '5b678b0d877ff7f879fc9ec233a8663d5dd7a4fbb598a1300b7b205c00f10eed',
      blockHash:
        '15086c3f058b70c111cc782a314b6a37b78ad9b9acde4537e477a6640e9a218b',
      blockSlot: 156864457,
      inputs: [],
      outputs: [
        {
          forTxHash:
            '5b678b0d877ff7f879fc9ec233a8663d5dd7a4fbb598a1300b7b205c00f10eed',
          toAddress:
            'addr1x9wnm7vle7al9q4aw63aw63wxz7aytnpc4h3gcjy0yufxwaj764lvrxdayh2ux30fl0ktuh27csgmpevdu89jlxppvrs84l0h4',
          datum:
            'd8799fd8799f581c66eabfc9d78f7bbfb4a5ad9ae7de59f0a8bebcc96f0f57c33044f110436e6674ff190c80d8799f4040ffd8799f581cf6099832f9563e4cf59602b3351c3c5a8a7dda2d44575ef69b82cf8d40ff0101d8799f581c153c2bfbe184b1edc7a0d89bca1608b1dccb24535102fa1f732a9ca2426c71ffd87980d8798018640040400000ff',
          index: 0,
          lovelaceBalance: 5_476_896_306247n,
          assetBalances: [
            {
              asset: Asset.fromId(
                '153c2bfbe184b1edc7a0d89bca1608b1dccb24535102fa1f732a9ca2.6c71'
              ),
              quantity: 9_223_358_604_495_062_282n,
            },
            {
              asset: Asset.fromId(
                '66eabfc9d78f7bbfb4a5ad9ae7de59f0a8bebcc96f0f57c33044f110.6e6674'
              ),
              quantity: 1n,
            },
            {
              asset: ASSETS.OADA,
              quantity: 7_983_860_256_785n,
            },
          ],
        } as Utxo,
      ],
      fee: 0n,
      mints: [],
      datums: {},
      redeemers: [],
    });

    expect(operations.length).toEqual(1);
    const [pool] = operations as [LiquidityPoolState];

    expect(pool).toBeInstanceOf(LiquidityPoolState);
    expect(pool.txHash).toEqual(expected.outputId.transactionId);
    expect(pool.dex).toEqual(Dex.SplashStable);
    expect(pool.tokenLp.policyId + '.' + pool.tokenLp.nameHex).toEqual(
      expected.lq.asset
    );
    expect(pool.feePercent).toEqual(expected.feePercent);
    expect(
      pool.tokenA ? pool.tokenA.policyId + pool.tokenA.nameHex : ''
    ).toEqual(expected.x.asset);
    expect(pool.tokenB.policyId + pool.tokenB.nameHex).toEqual(
      expected.y.asset
    );
    expect(BigInt(pool.reserveA)).toEqual(
      BigInt(expected.x.amount) - BigInt(expected.treasuryA)
    );
    expect(BigInt(pool.reserveB)).toEqual(
      BigInt(expected.y.amount) - BigInt(expected.treasuryB)
    );
    expect(pool.extra.feeNumerator).toEqual(
      expected.lpFeeNumerator + expected.treasuryFeeNumerator
    );
  });
});
