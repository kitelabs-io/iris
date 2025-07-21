import { Asset } from '../src/db/entities/Asset';
import {
  BaseAmmDexAnalyzer,
  ClosePoolOperation,
} from '../src/dex/BaseAmmDexAnalyzer';
import { SundaeSwapV3Analyzer } from '../src/dex/SundaeSwapV3Analyzer';
import { AmmDexOperation, Utxo } from '../src/types';
import { globals } from './setup';

describe('SundaeSwapV3', () => {
  const analyzer: BaseAmmDexAnalyzer = new SundaeSwapV3Analyzer(globals.app);

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
            'a59f2f2389682f324957f676029718c78e5315ec4b591c5483df7125bf2416ca',
          toAddress:
            'addr1x8srqftqemf0mjlukfszd97ljuxdp44r372txfcr75wrz26rnxqnmtv3hdu2t6chcfhl2zzjh36a87nmd6dwsu3jenqsslnz7e',
          datum:
            'd8799f581cccf318a499816d03c0a35d856d31ea4d684920c19591644abb9a5ddf9f9f4040ff9f581c0196e7016dbb34ac3794912d897fc9529eaa1ddf529483649fbd24c745535441524bffff00181e181ed87a80001a003567e0ff',
          index: 0,
          lovelaceBalance: 3_500_000n,
          assetBalances: [
            {
              asset: Asset.fromId(
                'e0302560ced2fdcbfcb2602697df970cd0d6a38f94b32703f51c312b.000de140ccf318a499816d03c0a35d856d31ea4d684920c19591644abb9a5ddf'
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
    expect(operation.id).toEqual(
      'ccf318a499816d03c0a35d856d31ea4d684920c19591644abb9a5ddf'
    );
  });
});
