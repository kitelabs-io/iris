import { DatumParameterKey } from '../../../constants';
import {
  DatumParameters,
  DefinitionBytes,
  DefinitionConstr,
  DefinitionField,
  DefinitionInt,
} from '../../../types';

export default (field: DefinitionField, parameters: DatumParameters) => {
  if (!('fields' in field)) return parameters;

  const fields: DefinitionField[] = field.fields;

  parameters[DatumParameterKey.TokenPolicyId] = (
    (fields[0] as DefinitionConstr).fields[0] as DefinitionBytes
  ).bytes;
  parameters[DatumParameterKey.TokenAssetName] = (
    (fields[0] as DefinitionConstr).fields[1] as DefinitionBytes
  ).bytes;
  parameters[DatumParameterKey.PoolAssetAPolicyId] = (
    (fields[1] as DefinitionConstr).fields[0] as DefinitionBytes
  ).bytes;
  parameters[DatumParameterKey.PoolAssetAAssetName] = (
    (fields[1] as DefinitionConstr).fields[1] as DefinitionBytes
  ).bytes;
  parameters[DatumParameterKey.PoolAssetBPolicyId] = (
    (fields[2] as DefinitionConstr).fields[0] as DefinitionBytes
  ).bytes;
  parameters[DatumParameterKey.PoolAssetBAssetName] = (
    (fields[2] as DefinitionConstr).fields[1] as DefinitionBytes
  ).bytes;
  parameters[DatumParameterKey.LpTokenPolicyId] = (
    (fields[3] as DefinitionConstr).fields[0] as DefinitionBytes
  ).bytes;
  parameters[DatumParameterKey.LpTokenAssetName] = (
    (fields[3] as DefinitionConstr).fields[1] as DefinitionBytes
  ).bytes;
  parameters[DatumParameterKey.LpFee] = (fields[4] as DefinitionInt).int;

  parameters[DatumParameterKey.TreasuryFee] = 0;
  parameters[DatumParameterKey.PoolAssetATreasury] = 0;
  parameters[DatumParameterKey.PoolAssetBTreasury] = 0;

  if (fields[5] instanceof Array) return parameters;

  parameters[DatumParameterKey.TreasuryFee] = (fields[5] as DefinitionInt).int;

  if (fields.length === 15) {
    // Definition: https://github.com/splashprotocol/splash-offchain-multiplatform/blob/develop/splash-testing-cardano/plutus.json#L1279
    parameters[DatumParameterKey.RoyaltyFee] = (fields[6] as DefinitionInt).int;
    parameters[DatumParameterKey.PoolAssetATreasury] = (
      fields[7] as DefinitionInt
    ).int;
    parameters[DatumParameterKey.PoolAssetBTreasury] = (
      fields[8] as DefinitionInt
    ).int;
    parameters[DatumParameterKey.RoyaltyA] = (fields[9] as DefinitionInt).int;
    parameters[DatumParameterKey.RoyaltyB] = (fields[10] as DefinitionInt).int;
  } else {
    parameters[DatumParameterKey.PoolAssetATreasury] = (
      fields[6] as DefinitionInt
    ).int;
    parameters[DatumParameterKey.PoolAssetBTreasury] = (
      fields[7] as DefinitionInt
    ).int;
  }

  return parameters;
};
