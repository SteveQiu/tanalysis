export const UPDATE_DATA = 'DATA:DATA';

export function updateData(raw) {
    // console.log(raw);
    return {
        type: UPDATE_DATA,
        payload: raw
    }
}