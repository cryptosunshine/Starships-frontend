export type Store = {
    address: string,
    autoConnect: boolean,
    targetAddressList: string[],
    myNFTList: any[],
    metaData: MetaData | undefined
}

export type MetaData = {
    battlegroundAddresses: string[],
    battlegroundSupply: number,
    escapeAddressesstarships: string,
    gameAddressesstarships: string,
    starshipsmaxSupplystarships: number,
    starshipsmintedstarships: number,
    starshipsmintedAddressesstarships: string[],
    starshipsmintingEnabledstarships: boolean,
    starshipsownerstarships: string,
    starshipsurlstarships: string
}