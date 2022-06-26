export const UPDATE_QUOTE = 'QUOTE:QUOTE';

export function updateQuote(ticker) {
    return {
        type: UPDATE_QUOTE,
        payload: (ticker||'').toUpperCase()
    }
}

export const UPDATE_TERM = 'QUOTE:TERM';

export function updateTerm(term) {
    return {
        type: UPDATE_TERM,
        payload: term
    }
}