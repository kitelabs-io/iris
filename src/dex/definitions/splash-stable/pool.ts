import { DefinitionConstr } from '../../../types';
import { DatumParameterKey } from '../../../constants';

// Datum definition at https://github.com/splashprotocol/splash-offchain-multiplatform/blob/develop/spectrum-offchain-cardano/src/data/stable_pool_t2t.rs#L92
export default {
  constructor: 0,
  fields: [
    {
      constructor: 0,
      fields: [
        {
          bytes: DatumParameterKey.TokenPolicyId, // Pool NFT
        },
        {
          bytes: DatumParameterKey.TokenAssetName,
        },
      ],
    },
    {
      int: DatumParameterKey.Amp,
    },
    {
      constructor: 0,
      fields: [
        {
          bytes: DatumParameterKey.PoolAssetAPolicyId,
        },
        {
          bytes: DatumParameterKey.PoolAssetAAssetName,
        },
      ],
    },
    {
      constructor: 0,
      fields: [
        {
          bytes: DatumParameterKey.PoolAssetBPolicyId,
        },
        {
          bytes: DatumParameterKey.PoolAssetBAssetName,
        },
      ],
    },
    {
      int: DatumParameterKey.Multiplier0,
    },
    {
      int: DatumParameterKey.Multiplier1,
    },
    {
      constructor: 0,
      fields: [
        {
          bytes: DatumParameterKey.LpTokenPolicyId,
        },
        {
          bytes: DatumParameterKey.LpTokenAssetName,
        },
      ],
    },
    {
      constructor: 0,
      fields: [],
    },
    {
      constructor: 0,
      fields: [],
    },
    {
      int: DatumParameterKey.LpFeeNumerator,
    },
    {
      int: DatumParameterKey.TreasuryFeeNumerator,
    },
    {
      bytes: '',
    },
    {
      bytes: '',
    },
    {
      int: DatumParameterKey.ProjectTreasuryA,
    },
    {
      int: DatumParameterKey.ProjectTreasuryB,
    },
  ],
};
