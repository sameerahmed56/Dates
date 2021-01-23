import { OFFILINE_ATTENDANCE } from './actions'

export const reducer = (state = {}, action) => {
    // initialState
    let newState = {}
    console.log(action, "action")
    switch (action.type) {

        case OFFILINE_ATTENDANCE:
            newState = {
                ...state,
                offAttendanceState: action.payload
            }

        default:
            return state
    }

}




