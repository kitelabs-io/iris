import { DatumParameterKey } from '../../../constants';
import { DatumParameters, DefinitionField } from '../../../types';

export default {
  constructor: 0,
  fields: [
    {
      int: DatumParameterKey.Deposit,
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: DatumParameterKey.Unknown,
          fields: [
            {
              bytes: DatumParameterKey.SenderPubKeyHash,
            },
          ],
        },
        {
          constructor: 0,
          fields: [
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

              throw new Error(
                "Template definition does not match with 'bytes'"
              );
            },
          ],
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

              throw new Error(
                "Template definition does not match with 'bytes'"
              );
            },
          ],
        },
      ],
    },
    [],
    {
      constructor: 0,
      fields: [],
    },
    {
      int: DatumParameterKey.Expiration,
    },
    {
      bytes: DatumParameterKey.PoolAssetAPolicyId,
    },
    {
      bytes: DatumParameterKey.PoolAssetAAssetName,
    },
    {
      bytes: DatumParameterKey.PoolAssetBPolicyId,
    },
    {
      bytes: DatumParameterKey.PoolAssetBAssetName,
    },
    {
      constructor: 2,
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
      int: DatumParameterKey.AScale,
    },
    {
      int: DatumParameterKey.BScale,
    },
  ],
};
