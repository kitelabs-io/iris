import { DatumParameterKey } from '../../../constants';
import { DatumParameters, DefinitionField } from '../../../types';

export default {
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
        (field: DefinitionField, foundParameters: DatumParameters) => {
          if ('fields' in field) {
            if (field.constructor === 1) {
              return;
            }

            const constr: DefinitionField = field.fields[0];

            if (
              'fields' in constr &&
              'fields' in constr.fields[0] &&
              'bytes' in constr.fields[0].fields[0]
            ) {
              const field: DefinitionField = constr.fields[0].fields[0];
              foundParameters[DatumParameterKey.SenderStakingKeyHash] =
                field.bytes;

              return;
            }
          }

          throw new Error("Template definition does not match with 'bytes'");
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
              bytes: DatumParameterKey.ReceiverPubKeyHash,
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
                      bytes: DatumParameterKey.ReceiverStakingKeyHash,
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
      constructor: 1,
      fields: [],
    },
    {
      constructor: 1,
      fields: [
        {
          int: DatumParameterKey.MinReceiveA,
        },
        {
          int: DatumParameterKey.MinReceiveB,
        },
      ],
    },
    {
      int: DatumParameterKey.BatcherFee,
    },
    {
      int: DatumParameterKey.DepositFee,
    },
    {
      bytes: DatumParameterKey.LpTokenAssetName,
    },
    {
      bytes: DatumParameterKey.TokenAssetName, // Factory token name
    },
  ],
};
