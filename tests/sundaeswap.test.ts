import { globals } from './setup';
import {
  BaseAmmDexAnalyzer,
  ClosePoolOperation,
} from '../src/dex/BaseAmmDexAnalyzer';
import { SundaeSwapAnalyzer } from '../src/dex/SundaeSwapAnalyzer';
import { LiquidityPool } from '../src/db/entities/LiquidityPool';
import { Dex } from '../src/constants';
import { Asset } from '../src/db/entities/Asset';
import { AmmDexOperation, Utxo } from '../src/types';
import { LiquidityPoolState } from '../src/db/entities/LiquidityPoolState';

describe('SundaeSwap', () => {
  const analyzer: BaseAmmDexAnalyzer = new SundaeSwapAnalyzer(globals.app);

  beforeEach(() => {
    globals.app.cache.setKey(
      '00',
      LiquidityPool.make(
        Dex.SundaeSwap,
        '04',
        '',
        Asset.fromId(
          '7de52b397c138e44fb6e61aaaeb26219a8059b1749b7c3bd87bd9488.524245525259'
        ),
        Asset.fromId(
          '7de52b397c138e44fb6e61aaaeb26219a8059b1749b7c3bd87bd9488.534245525259'
        ),
        1234
      )
    );
  });

  it('Can index close pool operation', async () => {
    const operations: AmmDexOperation[] = await analyzer.analyzeTransaction({
      hash: 'f76c8b04c7e98435ae312b4ea9453ac8256a59d472eb14e148737095583e23db',
      blockHash:
        '3eac1a7e6bf815e62109019bc933e197eef28d953ccce2b5e092ebee1afedb98',
      blockSlot: 54902346,
      inputs: [],
      outputs: [
        {
          forTxHash:
            '6edb6ff6e09d9226bf0810d85e47b1cbe25e058dc9e3150d62338f70fa898114',
          toAddress:
            'addr1w9qzpelu9hn45pefc0xr4ac4kdxeswq7pndul2vuj59u8tqaxdznu',
          datum:
            'd8799fd8799fd8799f4040ffd8799f581c804f5544c1962a40546827cab750a88404dc7108c0f588b72964754f4456594649ffff41a200d8799f011864ffff',
          index: 0,
          lovelaceBalance: 2_000_000n,
          assetBalances: [
            {
              asset: Asset.fromId(
                '0029cb7c88c7567b63d1a512c0ed626aa169688ec980730c0473b913.7020a2'
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
    });

    const [operation] = operations;
    expect(operations.length).toEqual(1);
    expect(operation).toBeInstanceOf(ClosePoolOperation);
    expect(operation.id).toEqual('a2');
  });

  it('Can index LP states', async () => {
    const operations: AmmDexOperation[] = await analyzer.analyzeTransaction(
      globals.SUNDAESWAP_LP_STATE_TX
    );

    expect(operations.length).toEqual(1);
    expect(operations[0]).toBeInstanceOf(LiquidityPoolState);
    if (operations[0] instanceof LiquidityPoolState) {
      expect(operations[0].txHash).toEqual(globals.SUNDAESWAP_LP_STATE_TX.hash);
    }
  });

  it('Can filter non-related transactions', async () => {
    const operations: AmmDexOperation[] = await analyzer.analyzeTransaction(
      globals.MINSWAP_SWAP_TX
    );

    expect(operations.length).toEqual(0);
  });
});
