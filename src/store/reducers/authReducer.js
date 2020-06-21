const initState = {
    signedIn: false,
    show_signIn: false,
    signIn_error: '',
    signUp_error: '',
    class: ''
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case 'LOGIN_ERROR':
            console.log(action.error)
            return {
                show_signIn: true,
                signIn_error: action.error.code,
            }
        case 'LOGIN_SUCCESS':
            window.location = `/student/${action.class}`
            return {
                show_signIn: false,
                signIn_error: '',
                signedIn: true,
                class: action.class
            }
        case 'SIGNUP_SUCCESSFUL':
            window.location = `/student/${action.class}`
            return {
                signedIn: true,
                signUp_error: '',
                signedIn: true,
                class: action.class
            }
        case 'SIGNUP_ERROR':
            return {
                signUp_error: action.error,
                show_signUp: true
            }
        case 'SIGNOUT_ERROR':
            return {
                signUp_error: action.error,
                show_signUp: true
            }
        case 'SIGNOUT':
            window.location = `/login/${action.userType}`
            return {
                show_signUp: true
            }
        case 'USER_DELETED':
            break
        default:
            return state
    }
    return 0;
}

export default authReducer