export const SRC_TOKENS_ROPSTEN = [
  {
    label: 'DAI (Multi-collateral DAI)',
    ticker: 'DAI',
    value: '0xaD6D458402F60fD3Bd25163575031ACDce07538D',
  },
]

export const DEST_TOKENS_ROPSTEN = [
  {
    label: 'BAT (Basic Attention)',
    ticker: 'BAT',
    value: '0xDb0040451F373949A4Be60dcd7b6B8D6E42658B6',
  },
  {
    label: 'KNC (Kyber Network)',
    ticker: 'KNC',
    value: '0x7b2810576aa1cce68f2b118cef1f36467c648f92',
  },
  {
    label: 'LINK (Chain Link)',
    ticker: 'LINK',
    value: '0xb4f7332ed719Eb4839f091EDDB2A3bA309739521',
  },
  {
    label: 'MANA (Decentraland)',
    ticker: 'MANA',
    value: '0x72fd6C7C1397040A66F33C2ecC83A0F71Ee46D5c',
  },
  {
    label: 'OMG (OmiseGo)',
    ticker: 'OMG',
    value: '0x4BFBa4a8F28755Cb2061c413459EE562c6B9c51b',
  },
  {
    label: 'RDN (Raiden Network)',
    ticker: 'RDN',
    value: '0x5422Ef695ED0B1213e2B953CFA877029637D9D26',
  },
  {
    label: 'REQ (Request)',
    ticker: 'REQ',
    value: '0xb43D10BbE7222519Da899B72bF2c7f094b6F79D7',
  },
  {
    label: 'SNT (Status Network)',
    ticker: 'SNT',
    value: '0xbF5d8683b9BE6C43fcA607eb2a6f2626A18837a6',
  },
  {
    label: 'WETH (Wrapped ETH)',
    ticker: 'WETH',
    value: '0xbCA556c912754Bc8E7D4Aad20Ad69a1B1444F42d',
  },
  {
    label: 'ZIL (Zilliqa)',
    ticker: 'ZIL',
    value: '0xaD78AFbbE48bA7B670fbC54c65708cbc17450167',
  },
]

export const tickerToAddress = (ticker) => {
  const mapping = {
    DAI: SRC_TOKENS_ROPSTEN[0].value,
    BAT: DEST_TOKENS_ROPSTEN[0].value,
    KNC: DEST_TOKENS_ROPSTEN[1].value,
    LINK: DEST_TOKENS_ROPSTEN[2].value,
    MANA: DEST_TOKENS_ROPSTEN[3].value,
    OMG: DEST_TOKENS_ROPSTEN[4].value,
    RDN: DEST_TOKENS_ROPSTEN[5].value,
    REQ: DEST_TOKENS_ROPSTEN[6].value,
    SNT: DEST_TOKENS_ROPSTEN[7].value,
    WETH: DEST_TOKENS_ROPSTEN[8].value,
    ZIL: DEST_TOKENS_ROPSTEN[9].value,
  }

  return mapping[ticker]
}

export const addressToTicker = (address) => {
  const mapping = {
    '0xaD6D458402F60fD3Bd25163575031ACDce07538D': SRC_TOKENS_ROPSTEN[0].ticker,
    '0xDb0040451F373949A4Be60dcd7b6B8D6E42658B6': DEST_TOKENS_ROPSTEN[0].ticker,
    '0x7b2810576aa1cce68f2b118cef1f36467c648f92': DEST_TOKENS_ROPSTEN[1].ticker,
    '0xb4f7332ed719Eb4839f091EDDB2A3bA309739521': DEST_TOKENS_ROPSTEN[2].ticker,
    '0x72fd6C7C1397040A66F33C2ecC83A0F71Ee46D5c': DEST_TOKENS_ROPSTEN[3].ticker,
    '0x4BFBa4a8F28755Cb2061c413459EE562c6B9c51b': DEST_TOKENS_ROPSTEN[4].ticker,
    '0x5422Ef695ED0B1213e2B953CFA877029637D9D26': DEST_TOKENS_ROPSTEN[5].ticker,
    '0xb43D10BbE7222519Da899B72bF2c7f094b6F79D7': DEST_TOKENS_ROPSTEN[6].ticker,
    '0xbF5d8683b9BE6C43fcA607eb2a6f2626A18837a6': DEST_TOKENS_ROPSTEN[7].ticker,
    '0xbCA556c912754Bc8E7D4Aad20Ad69a1B1444F42d': DEST_TOKENS_ROPSTEN[8].ticker,
    '0xaD78AFbbE48bA7B670fbC54c65708cbc17450167': DEST_TOKENS_ROPSTEN[9].ticker,
  }

  return mapping[address]
}
