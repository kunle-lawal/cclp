const initState = {
    signedIn: false,
    show_signIn: false,
    signIn_error: '',
    signUp_error: '',
    class: ''
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case 'TEST_COMPLETED':
            window.location = `/student/${action.class}`
            return {
                show_signIn: false,
                signIn_error: '',
                signedIn: true,
                class: action.class
            }
        default:
            return state
    }
    return 0;
}

export default authReducer