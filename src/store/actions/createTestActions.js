export const addTest = (testData, totalClasses) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        const firebase = getFirebase();
        addTestData(firebase, firestore, testData, totalClasses, 1);
        // const user = firebase.auth().currentUser; //add in this info later
        // const classCollection = firestore.collection('class');
        // console.log(testData);
    }
}

let addTestData = (firebase, firestore, testData, maxCalls, currCall) => {
    const user = firebase.auth().currentUser; //add in this info later
    const classCollection = firestore.collection('class');
    // console.log(testData);
    // if (currCall < maxCalls) {
    //     currCall++;
    //     addTestData(firebase, firestore, testData, maxCalls, currCall);
    // }
    classCollection.doc(testData.class[currCall - 1]).collection('tests').add({
        dateCreated: Date.now(),
        dueDate: Date.now(),
        questions: testData.questions,
        theme: testData.testTheme
    }).then((docRef) => {
        classCollection.doc(testData.class[currCall - 1]).collection('testAnswers').doc(docRef.id).set({
            dateCreated: Date.now(),
            dueDate: Date.now(),
            testAnswers: testData.testAnswers,
        }, { merge: true })
        if(currCall < maxCalls) {
            currCall++;
            addTestData(firebase, firestore, testData, maxCalls, currCall);
        }
    }).catch((err) => {
        console.log(err);
    })
}

export const addResolution = (resolutionData, postID) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make asyn call to database
        const firestore = getFirestore();
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const userCollection = firestore.collection('users');

        firestore.collection('resolutions').add({
            content: (resolutionData.public) ? resolutionData.content : "",
            postID: postID,
            time: new Date(),
            handle: resolutionData.handle,
            username: resolutionData.username,
            profilePicture: resolutionData.profilePicture,
            public: resolutionData.public,
        }).then((docRef) => {
            const resolutionID = docRef.id;
            firestore.collection('userProfile').doc(resolutionData.handle).collection('resolutions').add({
                content: (resolutionData.public) ? resolutionData.content : "",
                postID: postID,
                time: new Date(),
                handle: resolutionData.handle,
                username: resolutionData.username,
                profilePicture: resolutionData.profilePicture,
                public: resolutionData.public,
            }).then((docRef) => {
                userCollection.doc(user.uid).collection('resolutions').add({
                    content: resolutionData.content,
                    postID: postID,
                    time: new Date(),
                    locked: resolutionData.locked,
                    public: resolutionData.public,
                    handle: resolutionData.handle,
                    username: resolutionData.username,
                    profilePicture: resolutionData.profilePicture,
                    documentID: resolutionID,
                    userDocRef: docRef.id
                }).then(() => {
                    firestore.collection('totals').doc("totalResolutions").update({
                        total: firebase.firestore.FieldValue.increment(1)
                    })
                    userCollection.doc(user.uid).update({
                        totalResolutions: firebase.firestore.FieldValue.increment(1)
                    })
                    dispatch({ type: 'RESOLUTION_ADDED' });
                })
            })
            
            //addResolutionToUser(resolutionData, postID, docRef)
        }).catch((err) => {
            dispatch({ type: 'RESOLUTION_ADD_ERROR', err });
        })
    }
}

// export const updatePublicResolution = (resolutionData, postID) => {
//     return (dispatch, getState, { getFirebase, getFirestore }) => {
//         // make asyn call to database
//         const firestore = getFirestore();
//         const firebase = getFirebase();
//         const user = firebase.auth().currentUser;
//         const userCollection = firestore.collection('users');
        
//         firestore.collection('resolutions').update({
//             content: resolutionData.content,
//             public: resolutionData.public,
//         }).then((docRef) => {
//             userCollection.doc(user.uid).collection('resolutions').update({
//                 content: resolutionData.content,
//                 locked: resolutionData.locked,
//                 public: resolutionData.public,
//             })
//             dispatch({ type: 'RESOLUTION_ADDED' });
//         }).catch((err) => {
//             dispatch({ type: 'RESOLUTION_ADD_ERROR', err });
//         })
//     }
// }

export const updateResolution = (resolutionData) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make asyn call to database
        const firestore = getFirestore();
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const userCollection = firestore.collection('users');

        firestore.collection('resolutions').doc(resolutionData.resolutionID).update({
            content: (resolutionData.public) ? resolutionData.content : "",
            public: resolutionData.public
        }).then((docRef) => {
            firestore.collection('userProfile').doc(resolutionData.handle).collection('resolutions').doc(resolutionData.userPublicID).update({
                content: (resolutionData.public) ? resolutionData.content : "",
                locked: resolutionData.locked,
                public: resolutionData.public,
            }).then(() => {
                userCollection.doc(user.uid).collection('resolutions').doc(resolutionData.uid).update({
                    content: resolutionData.content,
                    locked: resolutionData.locked,
                    public: resolutionData.public,
                })
            })
            dispatch({ type: 'RESOLUTION_UPDATED' });
        }).catch((err) => {
            dispatch({ type: 'RESOLUTION_UPDATE_ERROR', err });
        })
       
    }
}

export const togglePublic = (resolutionData) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make asyn call to database
        const firestore = getFirestore();
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const userCollection = firestore.collection('users');
        
        firestore.collection('resolutions').doc(resolutionData.resolutionID).update({
            content: (resolutionData.public) ? resolutionData.content : "",
            public: resolutionData.public
        }).then((docRef) => {
            firestore.collection('userProfile').doc(resolutionData.handle).collection('resolutions').doc(resolutionData.userPublicID).update({
                content: (resolutionData.public) ? resolutionData.content : "",
                public: resolutionData.public,
            }).then(() => {
                userCollection.doc(user.uid).collection('resolutions').doc(resolutionData.uid).update({
                    public: resolutionData.public,
                })
            })
            // dispatch({ type: 'RESOLUTION_UPDATED' });
        }).catch((err) => {
            // dispatch({ type: 'RESOLUTION_UPDATE_ERROR', err });
        })

    }
}

export const deleteResolution = (documentId) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make asyn call to database
        const firestore = getFirestore();
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const userCollection = firestore.collection('users');

        firestore.collection('totals').doc("totalResolutions").update({
            total: firebase.firestore.FieldValue.increment(-1)
        })
        firestore.collection('resolutions').doc(documentId.resolutionID).delete().then(() => {
            userCollection.doc(user.uid).collection('resolutions').doc(documentId.uid).delete();
            userCollection.doc(user.uid).update({
                totalResolutions: firebase.firestore.FieldValue.increment(-1)
            })
            firestore.collection('userProfile').doc(documentId.handle).collection('resolutions').doc(documentId.userPublicID).delete();
        })
    }
}

export const toggleLock = (resolutionData) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make asyn call to database
        const firestore = getFirestore();
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const userCollection = firestore.collection('users');
        userCollection.doc(user.uid).collection('resolutions').doc(resolutionData.uid).update({
            locked: resolutionData.locked,
        })

    }
}