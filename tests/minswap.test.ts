import { globals } from './setup';
import { BaseAmmDexAnalyzer } from '../src/dex/BaseAmmDexAnalyzer';
import { AmmDexOperation } from '../src/types';
import { LiquidityPoolState } from '../src/db/entities/LiquidityPoolState';
import { MinswapAnalyzer } from '../src/dex/MinswapAnalyzer';

describe('Minswap', () => {
  const analyzer: BaseAmmDexAnalyzer = new MinswapAnalyzer(globals.app);

  it('Can index LP states', async () => {
    const operations: AmmDexOperation[] = await analyzer.analyzeTransaction(
      globals.MINSWAP_LP_STATE_TX
    );

    expect(operations.length).toEqual(1);
    expect(operations[0]).toBeInstanceOf(LiquidityPoolState);
    // @ts-ignore
    expect(operations[0].txHash).toEqual(globals.MINSWAP_LP_STATE_TX.hash);
  });

  it('Can filter non-related transactions', async () => {
    const operations: AmmDexOperation[] = await analyzer.analyzeTransaction(
      globals.SUNDAESWAP_SWAP_TX
    );

    expect(operations.length).toEqual(0);
  });
});
