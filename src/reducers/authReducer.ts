// // authReducer.ts
// import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../actions/actionTypes';

// const initialState = {
//   isAuthenticated: false,
//   user: null,
//   errorMessage: null,
// };

// export default function authReducer(state = initialState, action) {
//   switch (action.type) {
//     case LOGIN_SUCCESS:
//       return {
//         ...state,
//         isAuthenticated: true,
//         user: action.payload.user,
//         errorMessage: null,
//       };
//     case LOGIN_FAILURE:
//       return {
//         ...state,
//         isAuthenticated: false,
//         user: null,
//         errorMessage: action.payload.message,
//       };
//     case LOGOUT:
//       return {
//         ...state,
//         isAuthenticated: false,
//         user: null,
//         errorMessage: null,
//       };
//     default:
//       return state;
//   }
// }