export const setThesesID = (id) => {
    return {
        type: "SET_ID",
        id
    }
};

export const changeDataTxtForm = (key, word) => {
    return {
        type: "CHANGE_TXT",
        key,
        word
    }
};

export const updateDataArrayForm = (index, group, data) => {
    return {
        type: "UPDATE_ARRAY",
        data,
        group,
        index
    }
};

export const setDataArrayForm = (group, data) => {
    return {
        type: "SET_ARRAY_ID",
        group,
        data
    }
};

export const clearDataArrayForm = (index, group) => {
    return {
        type: "CLEAR_ARRAY",
        group,
        index
    }
};

export const deleteDataArrayForm = (index, group) => {
    return {
        type: "REMOVE_ARRAY",
        group,
        index
    }
};
