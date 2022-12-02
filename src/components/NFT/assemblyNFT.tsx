import React, { FC, useState, useEffect } from 'react';
import { reduceAddress } from '../../utils/index'

const Encounter = ({list, callback}: {list: any, callback: any}) => {
    const [activeNFT, SetActiveNFT] = useState<any>();

    const Item = (e: any) => {
        let item = e.item;
        return <div className={'card ' + ((activeNFT && activeNFT.id.id == item.id.id) && 'card-active')} onClick={() => {
            SetActiveNFT(item);
            callback(item)
        }}>
            <img src={item.url} style={{ height: `200px` }} />
            <div className='card-id'>
                <span>ID: </span> <a href={"https://explorer.sui.io/objects/" + item.id.id} target="_blank">{reduceAddress(item.id.id)}</a>
            </div>
            <div>
                <span>Name:</span> {item.name}
            </div>
            <div>
                <span>Level:</span> {item.level}
            </div>
            <div>
                <span>Speed:</span> {item.speed}
            </div>
            <div>
                <span>Milestone:</span> {item.milestone}
            </div>
        </div>
    }
    return (
        <div style={{width: `100%`, display: `flex`, flexWrap: `wrap`}}>
            {
              list && list.map((e: any, i: number) => {
                return <Item item={e} key={i}/>
              })
            }
        </div>
    )
}

export default Encounter;