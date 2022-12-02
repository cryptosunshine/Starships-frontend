import { Store } from './type'

export const store:Store = {
    address: "",
    autoConnect: true,
    targetAddressList: [],
    myNFTList: [],
    metaData: undefined
}
const reducer = (state:any,action:any) => {
    const actionFunction:any = {
        setAddress: () => {
            return {
                ...state,
                address: action.value
            }
        },
        setAutoConnect: () => {
            return {
                ...state,
                autoConnect: action.value
            }
        },
        setTargetAddressList: () => {
            return {
                ...state,
                targetAddressList: action.value
            }
        },
        setMyNFTList: () => {
            return {
                ...state,
                myNFTList: action.value
            }
        },
        setMetaData: () => {
            return {
                ...state,
                metaData: action.value
            }
        },
    }
    return actionFunction[action.type]()
}

export default reducer;
