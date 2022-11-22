export const store = {
    count: 0,
    address: "",
    autoConnect: true,
    targetAddressList: [],
    myAddressList: []
}
const reducer = (state:any,action:any) => {
    const actionFunction:any = {
        add: () => {
            console.log(action.value)
            return {
                ...state,
                 count: state.count+action.value
            }
        },
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
        setMyAddressList: () => {
            return {
                ...state,
                myAddressList: action.value
            }
        },
    }
    return actionFunction[action.type]()
}

export default reducer;
