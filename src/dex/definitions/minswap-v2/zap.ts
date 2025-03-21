import { DatumParameterKey } from '../../../constants';

/**
 * https://github.com/minswap/minswap-dex-v2/blob/main/src/types/order.ts
 */
export default {
  constructor: 0,
  fields: [
    {
      constructor: 0,
      fields: [
        {
          bytes: DatumParameterKey.SenderPubKeyHash,
        },
      ],
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: 0,
          fields: [
            {
              bytes: DatumParameterKey.SenderPubKeyHash,
            },
          ],
        },
        {
          constructor: 0,
          fields: [
            {
              constructor: 0,
              fields: [
                {
                  constructor: 0,
                  fields: [
                    {
                      bytes: DatumParameterKey.SenderStakingKeyHash,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      constructor: 0,
      fields: [],
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: 0,
          fields: [
            {
              bytes: DatumParameterKey.SenderPubKeyHash,
            },
          ],
        },
        {
          constructor: 0,
          fields: [
            {
              constructor: 0,
              fields: [
                {
                  constructor: 0,
                  fields: [
                    {
                      bytes: DatumParameterKey.SenderPubKeyHash,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      constructor: 0,
      fields: [],
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
      constructor: 4,
      fields: [
        {
          constructor: 0,
          fields: [
            {
              int: DatumParameterKey.SwapInA,
            },
            {
              int: DatumParameterKey.SwapInB,
            },
          ],
        },
        {
          int: DatumParameterKey.MinReceive,
        },
        {
          constructor: 0,
          fields: [],
        },
      ],
    },
    {
      int: DatumParameterKey.BatcherFee,
    },
    {
      constructor: 1,
      fields: [],
    },
  ],
};
