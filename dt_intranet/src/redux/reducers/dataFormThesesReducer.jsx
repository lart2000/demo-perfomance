let emptyObj = {
                title_thesis : null,
                date_lift    : null,
                code         : null,
                author       : [],
                jury         : [],
                adviser      : []
            };

export default (state = emptyObj, action) => {
    let index = action.index;
    let data   = action.data;
    switch (action.type) {
        case "SET_ID":
            state["id"] = action.id;
            return state;
        case "CHANGE_TXT":
            state[action.key] = action.word;
            return state;
        case "UPDATE_ARRAY":
            state[action.group][index] = data;
            return state;
        case "CLEAR_ARRAY":
            delete state[action.group][index];
            return state;
        case "REMOVE_ARRAY":
            state[action.group].splice(index, 1);
            return state;
        case "SET_ARRAY_ID":
            state[action.group] = data;
            return state;
        case "CLEAR_DATA_FORM":
            return emptyObj;
    }
    return state;
}
