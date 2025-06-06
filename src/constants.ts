export enum DatumParameterKey {
  Action = 'Action',
  SenderPubKeyHash = 'SenderPubKeyHash',
  SenderStakingKeyHash = 'SenderStakingKeyHash',
  ReceiverPubKeyHash = 'ReceiverPubKeyHash',
  ReceiverStakingKeyHash = 'ReceiverStakingKeyHash',
  SenderKeyHashes = 'SenderKeyHashes',
  SwapInAmount = 'SwapInAmount',
  SwapInA = 'SwapInA',
  SwapInB = 'SwapInB',
  MinReceive = 'MinReceive',
  MinReceiveA = 'MinReceiveA',
  MinReceiveB = 'MinReceiveB',
  Expiration = 'Expiration',
  AllowPartialFill = 'AllowPartialFill',
  Deposit = 'Deposit',
  DepositA = 'DepositA',
  DepositB = 'DepositB',
  LpTokens = 'LpTokens',
  StakeAdminPolicy = 'StakeAdminPolicy',
  Amp = 'Amp',
  Balance0 = 'Balance0',
  Balance1 = 'Balance1',
  Multiplier0 = 'Multiplier0',
  Multiplier1 = 'Multiplier1',
  OrderHash = 'OrderHash',
  InvariantD = 'InvariantD',

  TotalFees = 'TotalFees',
  BatcherFee = 'BatcherFee',
  DepositFee = 'DepositFee',
  ScooperFee = 'ScooperFee',
  ExecutionFee = 'ExecutionFee',
  MakerFee = 'MakerFee',
  TakerFee = 'TakerFee',
  ContainedFee = 'ContainedFee',
  ContainedFeePayment = 'ContainedFeePayment',
  PoolIdentifier = 'PoolIdentifier',
  TotalLpTokens = 'TotalLpTokens',
  LpFee = 'LpFee',
  LpFeeNumerator = 'LpFeeNumerator',
  LpFeeDenominator = 'LpFeeDenominator',
  PoolAssetABarFee = 'PoolAssetABarFee',
  PoolAssetBBarFee = 'PoolAssetBBarFee',
  OpeningFee = 'OpeningFee',
  FinalFee = 'FinalFee',
  ProtocolFee = 'ProtocolFee',
  SwapFee = 'SwapFee',
  BaseFee = 'BaseFee',
  SimpleFee = 'SimpleFee',
  FeeBasis = 'FeeBasis',
  AgentFee = 'AgentFee',
  SwapFeeInBasis = 'SwapFeeInBasis',
  OtherFeeInBasis = 'OtherFeeInBasis',
  ProtocolFeeInBasis = 'ProtocolFeeInBasis',
  ProjectFeeInBasis = 'ProjectFeeInBasis',
  ReserveFeeInBasis = 'ReserveFeeInBasis',
  FeeSharingNumerator = 'FeeSharingNumerator',
  ReserveA = 'ReserveA',
  ReserveB = 'ReserveB',
  Direction = 'Direction',
  AScale = 'AScale',
  BScale = 'BScale',
  TreasuryFee = 'TreasuryFee',
  TreasuryFeeNumerator = 'TreasuryFeeNumerator',
  RoyaltyFee = 'RoyaltyFee',
  FeeANumerator = 'FeeANumerator',
  FeeBNumerator = 'FeeBNumerator',

  TokenPolicyId = 'TokenPolicyId',
  TokenAssetName = 'TokenAssetName',
  SwapInTokenPolicyId = 'SwapInTokenPolicyId',
  SwapInTokenAssetName = 'SwapInTokenAssetName',
  SwapOutTokenPolicyId = 'SwapOutTokenPolicyId',
  SwapOutTokenAssetName = 'SwapOutTokenAssetName',
  PoolAssetAPolicyId = 'PoolAssetAPolicyId',
  PoolAssetAAssetName = 'PoolAssetAAssetName',
  PoolAssetATreasury = 'PoolAssetATreasury',
  PoolAssetBPolicyId = 'PoolAssetBPolicyId',
  PoolAssetBAssetName = 'PoolAssetBAssetName',
  LpTokenPolicyId = 'LpTokenPolicyId',
  LpTokenAssetName = 'LpTokenAssetName',

  RoyaltyA = 'RoyaltyA',
  RoyaltyB = 'RoyaltyB',
  PoolAssetBTreasury = 'PoolAssetBTreasury',
  ProjectTreasuryA = 'ProjectTreasuryA',
  ProjectTreasuryB = 'ProjectTreasuryB',
  Treasury0 = 'Treasury0',
  Treasury1 = 'Treasury1',
  ReserveTreasuryA = 'ReserveTreasuryA',
  ReserveTreasuryB = 'ReserveTreasuryB',
  RootKLast = 'RootKLast',
  LastInteraction = 'LastInteraction',
  RequestScriptHash = 'RequestScriptHash',
  LqBound = 'LqBound',
  OriginalOffer = 'OriginalOffer',
  LeftOverOffer = 'LeftOverOffer',
  PriceNumerator = 'PriceNumerator',
  PriceDenominator = 'PriceDenominator',
  PastOrderFills = 'PastOrderFills',
  ConsumedTxHash = 'ConsumedTxHash',
  CancelDatum = 'CancelDatum',
  Batcher = 'Batcher',
  Beacon = 'Beacon',
  Unknown = 'Unknown',
}

export enum Dex {
  Minswap = 'Minswap',
  MinswapStable = 'MinswapStable',
  MinswapV2 = 'MinswapV2',
  SundaeSwap = 'SundaeSwap',
  SundaeSwapV3 = 'SundaeSwapV3',
  WingRiders = 'WingRiders',
  WingRidersV2 = 'WingRidersV2',
  WingRidersStableV2 = 'WingRidersStableV2',
  MuesliSwap = 'MuesliSwap',
  Spectrum = 'Spectrum',
  Splash = 'Splash',
  SplashStable = 'SplashStable',
  TeddySwap = 'TeddySwap',
  GeniusYield = 'GeniusYield',
  VyFinance = 'VyFinance',
  Axo = 'Axo',
}

export enum IrisEventType {
  SyncUpdated = 'SyncUpdated',
  AssetCreated = 'AssetCreated',
  AssetUpdated = 'AssetUpdated',
  LiquidityPoolCreated = 'LiquidityPoolCreated',
  LiquidityPoolUpdated = 'LiquidityPoolUpdated',
  LiquidityPoolStateCreated = 'LiquidityPoolStateCreated',
  LiquidityPoolStateUpdated = 'LiquidityPoolStateUpdated',
  LiquidityPoolSwapCreated = 'LiquidityPoolSwapCreated',
  LiquidityPoolSwapUpdated = 'LiquidityPoolSwapUpdated',
  LiquidityPoolZapCreated = 'LiquidityPoolZapCreated',
  LiquidityPoolZapUpdated = 'LiquidityPoolZapUpdated',
  LiquidityPoolDepositCreated = 'LiquidityPoolDepositCreated',
  LiquidityPoolDepositUpdated = 'LiquidityPoolDepositUpdated',
  LiquidityPoolWithdrawCreated = 'LiquidityPoolWithdrawCreated',
  LiquidityPoolWithdrawUpdated = 'LiquidityPoolWithdrawUpdated',
  LiquidityPoolTickCreated = 'LiquidityPoolTickCreated',
  LiquidityPoolTickUpdated = 'LiquidityPoolTickUpdated',
  OperationStatusCreated = 'OperationStatusCreated',
  OrderBookCreated = 'OrderBookCreated',
  OrderBookUpdated = 'OrderBookUpdated',
  OrderBookOrderCreated = 'OrderBookOrderCreated',
  OrderBookOrderUpdated = 'OrderBookOrderUpdated',
  OrderBookMatchCreated = 'OrderBookMatchCreated',
  OrderBookTickCreated = 'OrderBookTickCreated',
  OrderBookTickUpdated = 'OrderBookTickUpdated',
}

export enum DexOperationStatus {
  Pending = 0,
  OnChain = 1,
  Complete = 2,
  Cancelled = 3,
}

export enum SwapOrderType {
  Instant = 0,
  Limit = 1,
}

export enum ApplicationContext {
  Indexer = 'indexer',
  Api = 'api',
}

export enum TickInterval {
  Minute = '1m',
  Hour = '1h',
  Day = '1D',
}

export const FIRST_SYNC_SLOT: number = 50367177;
export const FIRST_SYNC_BLOCK_HASH: string =
  '91c16d5ae92f2eb791c3c2da9b38126b98623b07f611d4a4b913f0ab2af721d2';

export const BIPS = 10_000;
