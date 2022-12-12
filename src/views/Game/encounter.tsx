import React, { FC, useState, useEffect } from 'react';
import { useWallet } from "@mysten/wallet-adapter-react";
import { Ed25519Keypair, JsonRpcProvider, RawSigner, Secp256k1Keypair } from '@mysten/sui.js';
import { useGlobal } from '../../state/provider'
import { contractAddress, globalMetaData, x0 } from '../../config/index'
import { reduceAddress } from '../../utils/index'
import AssemblyNFT from '../../components/NFT/assemblyNFT'
import { HexString } from "aptos";

interface EncounterType {
    id: string,
    scale: number,
    status: number,
    starship: string[],
}
const Encounter: FC = () => {
    const { wallets, wallet, select, connecting, connected, getAccounts, signAndExecuteTransaction } = useWallet();
    const provider = new JsonRpcProvider();
    const { state, dispatch } = useGlobal()
    const [encounterList, setEncounterList] = useState<EncounterType[]>();
    const [activeEncounter, SetActiveEncounter] = useState<any>();
    const [modal, setModal] = useState<boolean>(false);
    const [joinModal, setJoinModal] = useState<boolean>(false);
    const [bttlegroundModal, setBttlegroundModal] = useState<boolean>(false);
    const [battlegroundListStarships, setBattlegroundListStarships] = useState<any>();
    const [activeNFT, SetActiveNFT] = useState<any>();
    const [activeBattle, SetActiveBattle] = useState<any>();

    useEffect(() => {
        document.addEventListener('click', () => {
            setModal(false);
            setJoinModal(false);
            setBttlegroundModal(false);
        })
    },[]);

    useEffect(() => {
        getBattlegroundList()
    }, [state.address])

    const getBattlegroundList = async () => {
        const object: any = await provider.getObject(globalMetaData);
        const MetaData = object && object.details.data.fields;
        dispatch({ type: 'setMetaData', value: MetaData });
    }

    useEffect(() => {
        if (!state.metaData || !state.metaData.battlegroundAddresses) return;
        let list: EncounterType[] = [];
        console.log(state.metaData)
        state.metaData.battlegroundAddresses.map((e: string) => {
            let encounterObj: EncounterType = {
                id: e,
                scale: 0,
                status: 0,
                starship: []
            }
            list.push(encounterObj);
        })
        setEncounterList(list);

    }, [state.metaData])

    const getBattlegroundDetail = async (battleground: string) => {
        const object: any = await provider.getObject(battleground);
        const battlegroundDetail = object && object.details.data.fields;
        
        let list:any = [];
        await Promise.all(battlegroundDetail.starshipAddresses.map(async (e:any) => {
            const result: any = await provider.getObject(e);
            const starship = result && result.details.data.fields;
            list.push(starship)
        }))
        console.log(list)
        setBattlegroundListStarships(list)
    }

    const fighting = async () => {
        if(!activeNFT) return;
        const reasult: any = await signAndExecuteTransaction({
            kind: "moveCall",
            data: {
                packageObjectId: contractAddress, // Immutable
                module: 'starships',
                function: 'newBattleground',
                typeArguments: [],
                arguments: [
                    globalMetaData, // Shared
                    activeNFT.id.id,
                ],
                gasBudget: 10000,
            },
        });
        console.log(reasult.effects.created[0].reference.objectId)
        let objectId = reasult.effects.created[0].reference.objectId;
        provider.getObject(objectId).then((e: any) => {
            console.log(e.details.data.fields)
        })
        getBattlegroundList()
        setModal(false);
    }

    const joinInFighting = async (id: string) => {
        if(!activeBattle || !id) return;
        const reasult = await signAndExecuteTransaction({
            kind: "moveCall",
            data: {
                packageObjectId: contractAddress, // Immutable
                module: 'starships',
                function: 'joinInBattleground',
                typeArguments: [],
                arguments: [
                    activeBattle.id, // Shared
                    id,
                ],
                gasBudget: 10000,
            },
        });
        console.log(reasult)
        provider.getObject(activeBattle).then((e: any) => {
            console.log(e.details.data.fields)
        })
        setJoinModal(false);
    }

    const attack = async () => {
        let objectId = "0x108ac2943049ddb46c7ce94a0fb5c8e3c0c5e20c"
        const reasult = await signAndExecuteTransaction({
            kind: "moveCall",
            data: {
                packageObjectId: contractAddress,
                module: 'starships',
                function: 'attack',
                typeArguments: [],
                arguments: [
                    objectId,
                    "0x84a630b1613df5e63806012433e96fe7f4371148",
                    '0x4e7d547cbf0a49bbac71527b38e91e9d09ee4c9c',
                ],
                gasBudget: 10000,
            },
        });
        console.log(reasult)
    }

    const quitBattleground = async (id: string) => {
        const reasult = await signAndExecuteTransaction({
            kind: "moveCall",
            data: {
                packageObjectId: contractAddress,
                module: 'starships',
                function: 'quitBattleground',
                typeArguments: [],
                arguments: [
                    activeBattle.id, // Shared
                    id,
                ],
                gasBudget: 10000,
            },
        });
        console.log(reasult)
        setJoinModal(false);
    }

    const burnBattleground = async () => {
        let objectId = "0x6e7944d3005248c8a015fb59bbe66ad9661f89c6"
        const reasult = await signAndExecuteTransaction({
            kind: "moveCall",
            data: {
                packageObjectId: contractAddress,
                module: 'starships',
                function: 'burnBattleground',
                typeArguments: [],
                arguments: [
                    globalMetaData,
                    objectId
                ],
                gasBudget: 10000,
            },
        });
        console.log(reasult)
    }

    const Item = ({ item }: { item: EncounterType }) => {

        return <div className={'card ' + ((activeEncounter && activeEncounter.id == item.id) && 'card-active')}>
            <img src={`/img/Encounter.webp`} style={{ height: `200px` }} onClick={(e) => {
                e.stopPropagation();
                setBttlegroundModal(true);
                getBattlegroundDetail(item.id)
            }}/>
            <div className='card-id'>
                <span>ID: </span> <a href={"https://explorer.sui.io/objects/" + item.id} target="_blank">{reduceAddress(item.id)}</a>
            </div>
            <div>
                <div className='btn' style={{marginTop: `20px`, fontSize: `14px`}} onClick={(e) => {
                    e.stopPropagation();
                    setJoinModal(true);
                    SetActiveBattle(item);
                }}>Join the battle</div>
            </div>
        </div>
    }
    const Publish = async () => {
        const moduleData = "a11ceb0b060000000a01000c020c1e032a22044c0805545407a8019b0108c3023c06ff020e0a8d03050c9203280000010102020203020402050006020004070200020a0c010001020b0c010001050c0700010d070100000008000100010e01040100020f0607010203100901010804110a0b0003030d010108010302050308050c02080007080100020b020108000b03010800010804010b05010900010800070900020a020a020a020b05010804070801020b030109000b02010900010b02010800010900010608010105010b0301080002090005066d79636f696e066f7074696f6e04636f696e087472616e736665720a74785f636f6e746578740375726c064d59434f494e095478436f6e7465787404696e69740b64756d6d795f6669656c640c436f696e4d657461646174610b54726561737572794361700355726c064f7074696f6e046e6f6e650f6372656174655f63757272656e63790d667265657a655f6f626a6563740673656e6465720000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000020a0207064d59434f494e0a02010000020109010000000002120b00310607000701070138000a0138010c020c030b0238020b030b012e110438030200"
        const data = new HexString(moduleData).toUint8Array()
        // const reasult = await signAndExecuteTransaction({
        //     kind: "publish",
        //     data: {
        //         compiledModules: data,
        //         gasBudget: 10000,
        //     },
        // });
    }

    return (
        <>
            <div style={{width: `100%`}}>
                <div className='btn' onClick={(e) => {
                    e.stopPropagation();
                    setModal(true);
                }}>Fighting</div>
                <div className='btn' onClick={(e) => {
                    Publish()
                }}>Publish</div>
                {/* <div className='btn' onClick={() => attack()}>Attack</div>
                <div className='btn' onClick={() => quitBattleground()}>quit Battleground</div>
                <div className='btn' onClick={() => burnBattleground()}>Burn Battleground</div> */}
            </div>
            {
                encounterList && encounterList.map((e: any, i: number) => {
                    return <Item item={e} key={i}/>
                })
            }
            {modal &&
                <div className='modal' style={{width: `1000px`, height: `800px`}} onClick={(e) => {
                    e.stopPropagation();
                    setModal(true);
                }}>
                    <div style={{fontSize: `20px`}}>Your Starship</div>
                    <div>Choose a battleship and create a battlefield.</div>
                    <AssemblyNFT list={state.myNFTList.filter((e:any) => e.position == x0)} callback={(e:any) => SetActiveNFT(e)}/>
                    <div className='btn' style={{marginTop: `20px`}} onClick={() => fighting()}>Create a battlefield</div>
                </div>
            }
            {joinModal &&
                <div className='modal' style={{width: `1000px`, height: `800px`}} onClick={(e) => {
                    e.stopPropagation();
                    setJoinModal(true);
                }}>
                    <div style={{fontSize: `20px`}}>Your Starship</div>
                    <div>Choose a battleship and join the battle.</div>
                    <AssemblyNFT list={state.myNFTList.filter((e:any) => e.position == x0)} callback={(e:any) => SetActiveNFT(e)}/>
                    <div className='btn' style={{marginTop: `20px`}} onClick={() => joinInFighting(activeNFT.id.id)}>Join the battle</div>
                </div>
            }
            {bttlegroundModal &&
                <div className='modal' style={{width: `1000px`, height: `800px`}} onClick={(e) => {
                    e.stopPropagation();
                    setBttlegroundModal(true);
                }}>
                    <div style={{fontSize: `20px`}}>Battleship</div>
                    <div>All starships in this battleground.</div>
                    <AssemblyNFT list={battlegroundListStarships} callback={(e:any) => SetActiveNFT(e)}/>
                    <div className='btn' style={{marginTop: `20px`}} onClick={() => quitBattleground(activeNFT.id.id)}>Quit the battle</div>

                </div>
            }
        </>
    )
}

export default Encounter;