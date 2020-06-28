export const logInUserAction = (authInfo) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const  firebase = getFirebase();
        const firestore = getFirestore();
        const auth = firebase.auth();
        console.log(authInfo);
        auth.signInWithEmailAndPassword(authInfo.email, authInfo.password).then(() => {
            dispatch({ type: 'LOGIN_SUCCESS', class: authInfo.class })
        }).catch((error) => {
            dispatch({ type: 'LOGIN_ERROR', error: error, data: authInfo })
        })
    }
}

export const signUp = (authInfo) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        const auth = firebase.auth();
        // console.log(authInfo);
        auth.createUserWithEmailAndPassword(authInfo.email, authInfo.password).then(() => {
            const user = firebase.auth().currentUser;
            if (authInfo.type === 'student') {
                firestore.collection('users').doc(user.uid).set({
                    first_name: authInfo.firstName,
                    last_name: authInfo.lastName,
                    class: authInfo.class,
                    type: 'student',
                    loginAttempts: authInfo.loginAttempts ? authInfo.loginAttempts : 1
                }, { merge: true })
                firestore.collection('class').doc(authInfo.class).collection('students').doc(authInfo.username).set({
                    first_name: authInfo.firstName,
                    last_name: authInfo.lastName,
                    class: authInfo.class,
                    type: 'student'
                }, { merge: true })
                firestore.collection('class').doc(authInfo.class).set({
                    studentNames: firebase.firestore.FieldValue.arrayUnion(`${authInfo.firstName}_${authInfo.lastName}`)
                }, { merge: true }).then(() => {
                    dispatch({ type: 'SIGNUP_SUCCESSFUL', class: authInfo.class })
                })
            } else if(auth.type === 'admin') {
                firestore.collection('users').doc(user.uid).set({
                    type: auth.type,
                    loginAttempts: authInfo.loginAttempts ? authInfo.loginAttempts : 1
                })
            }
        }).catch((error) => {
            console.log(error);
            dispatch({ type: 'SIGNIN_ERROR' })
        })
    }
}

export const signOut = (authInfo) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        const auth = firebase.auth();
        firebase.auth().signOut().then(function () {
            dispatch({ type: 'SIGNOUT', userType: getState().firebase.profile.type})
        }).catch(function (error) {
            dispatch({ type: 'SIGNOUT_ERROR', error: error })
        });
    }
}

export const updatePasswords = (newPassword) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        const auth = firebase.auth();
        const user = firebase.auth().currentUser;
        console.log(newPassword);
        user.updatePassword(newPassword).then(() => {
            console.log(`${user} password reset`)
        })
    }
}

// export const dataEntry = (authInfo) => {
//     return (dispatch, getState, { getFirebase, getFirestore }) => {
//         const firebase = getFirebase();
//         const firestore = getFirestore();
//         const username = `${authInfo.firstName}_${authInfo.lastName}`;

//         console.log(authInfo);

//         firestore.collection('class').doc(authInfo.class).collection('students').doc(username).set({
//             first_name: authInfo.firstName,
//             last_name: authInfo.lastName,
//             class: authInfo.class,
//             type: 'student'
//         }, { merge: true })
            
//     }
// }


// export const signIn = (authInfo, type) => {
//     return (dispatch, getState, { getFirebase, getFirestore}) => {
//         const firebase = getFirebase();
//         // const firestore = getFirestore();
//         // const auth = firebase.auth(); 
//         var provider
//         if(type === 'twitter') {
//             provider = new firebase.auth.TwitterAuthProvider();
//         } else if(type === 'facebook') {
//             provider = new firebase.auth.FacebookAuthProvider(); 
//         } else if(type === 'google') {
//             provider = new firebase.auth.GoogleAuthProvider();
//         }
//         // var provider = (type === 'twitter') ? new firebase.auth.TwitterAuthProvider() : new firebase.auth.FacebookAuthProvider(); 
//         // firebase.auth().useDeviceLanguage() //This is to use the device provided language.

//         firebase.auth().signInWithRedirect(provider);
//     }
// }

// export const login = (authInfo, type) => {
//     return (dispatch, getState, {getFirebase, getFirestore}) => {
//         const firebase = getFirebase();
//         const firestore = getFirestore();
//         const auth = firebase.auth(); 
//         auth.getRedirectResult().then((result) => {
//             // var token = result.credential.accessToken;
//             // var secret = result.credential.secret;
//             var user = result.user;
//             let handle = type === 'twitter.com' ? result.additionalUserInfo.username : (type === "google.com" ? result.additionalUserInfo.profile.given_name : result.additionalUserInfo.profile.first_name) + "_" + (type === "google.com" ? result.additionalUserInfo.profile.family_name : result.additionalUserInfo.profile.last_name);
//             let photo = type === 'twitter.com' ? user.photoURL.replace('normal','400x400') : user.photoURL;

//             firestore.collection('users').doc(user.uid).set({
//                 username: user.displayName,
//                 handle: handle,
//                 photo: photo,
//                 emailVerified: user.emailVerified,
//                 email: type === 'twitter.com' ? 'none' : user.email,
//                 method: type
//             })
//             firestore.collection('userProfile').doc(handle).set({
//                 username: user.displayName,
//                 handle: user.displayName,
//                 photo: photo,
//                 method: type
//             })
//             firestore.collection('userProfile').doc('users').update({
//                 allUsers: firebase.firestore.FieldValue.arrayUnion(handle)
//             }).then(() => {
//                 dispatch({ type: 'SIGNUP_SUCCESSFUL' })
//             })
//         }).catch(function (error) {
//             dispatch({ type: 'SIGNUP_SUCCESSFUL', err: error })
//             // Handle Errors here.
//             // var errorCode = error.code;
//             // var errorMessage = error.message;
//             // // The email of the user's account used.
//             // var email = error.email;
//             // // The firebase.auth.AuthCredential type that was used.
//             // var credential = error.credential;
//             // ...
//         });
//     }
// }

// export const signOut = () => {
//     return (dispatch, getState, {getFirebase}) => {
//         const firebase = getFirebase();
//         firebase.auth().signOut().then(() => {
//             dispatch({type: 'LOGOUT_SUCCESS'})
//         }).catch((err) => {
//             dispatch({type: 'LOGOUT_ERROR'})
//         })
//     }
// }