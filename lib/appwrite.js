import { Account, Client, Databases, ID, Avatars, Query, Storage } from 'react-native-appwrite'

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.Yungle.group2',
    // steph's individual yungle ids
    // projectId: '6767668500095edad3b7', 
    // databaseId: '6767688f0000ae9361c0',
    // userCollectionId: '676768ab002bc77ca99f',
    // photoCollectionId: '676769b10003bec31bfa',
    // interestId:
    // '676a1c61000f8c7113fe',
    // messageId:
    // '6769e1320019d30ee498',
    // storageId: '67676a72002733c5210e',
    projectId: '678ee948001c1b86b8fd',
    databaseId: '678ef3bc003394eb07c8',
    userCollectionId: '678ef3d00012b8967b98',
    photoCollectionId: '678ef4ff00127f16ec11',
    notificationId: "678fcdc6000fb935fd73",
    interestId: '678ef509001de42814b5',
    messageId: '678ef4f5000ae5135e27',
    storageId: '678ef5a00010bf43fb7d',
    connectionsId: '67b0e04f00066f6a2a24',
    chatSessionId: '67ba5dde001edaa8ccf8',
    notificationPreferencesId: '678fcdc6000fb935fd74'
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    photoCollectionId,
    interestId,
    storageId,
    messageId,
    notificationId,
    connectionsId,
    chatSessionId,
    notificationPreferencesId
} = appwriteConfig;
// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username, extraData) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if (!newAccount) throw Error;
        const avatarUrl = avatars.getInitials(username);
        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId, appwriteConfig.userCollectionId, ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl,
                ...extraData
            }
        );
        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password)

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId, appwriteConfig.userCollectionId, [Query.equal('accountId', currentAccount.$id)]
        )
        if (!currentUser || currentUser.documents.length === 0) {
            console.log("User document not found");
            return null;
        }

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}
export const getConnections = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;
        console.log(currentAccount.$id)
        const connections = await databases.listDocuments(databaseId, connectionsId, [Query.equal('senderId', currentAccount.$id), Query.or([Query.equal('outgoingRequest', true), Query.equal('suggestionRejected', true), Query.equal('friendReqAccepted', true)])]);

        if (!connections || connections.documents.length === 0) {
            console.log("No connections found");
            return [];
        }

        return connections.documents.filter(conn => conn?.receiver?.$id);
    }
    catch (error) {
        throw new Error(error);
    }
}

export const getUsers = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw new Error("No account found");

        const users = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.notEqual('accountId', currentAccount.$id)]
        );

        if (!users || users.documents.length === 0) {
            console.log("No users found in the collection");
            return [];
        }

        return users.documents;
    } catch (error) {
        console.log("Error fetching users:", error);
        return [];
    }
};


export const getInterest = async (query) => {
    try {
        const interest = await databases.listDocuments(
            databaseId,
            interestId,
            [Query.equal("interest_name", query)]
        );

        if (interest.documents[0] != null) {
            return interest.documents[0]["user"];
        }
        else {
            return [];
        }
    } catch (error) {
        throw new Error(error);
    }
}

export async function getRecommendations() {
    let userCollection = await getUsers();
    console.log(userCollection)
    let connectionCollection = await getConnections();
    console.log(connectionCollection)
    let connectionUserIds = new Set(connectionCollection.map(connection => connection.receiver.$id).filter(Boolean));
    let filteredUsers = userCollection.filter(user => !connectionUserIds.has(user.$id));
    return filteredUsers;
}

export async function signOut() {
    try {
        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const searchUsers = async (query) => {
    try {
        const users = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.search('name', query)]
        )
        return users.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const updateUser = async (newName, newLocation, newMajor, newCareer, newSchool) => {
    try {
        const currentUser = await getCurrentUser();
        const docId = currentUser.$id;

        const validNewName = newName && typeof newName === 'object' ? newName.name : newName;
        const validNewLocation = newLocation && typeof newLocation === 'object' ? newLocation.location : newLocation;
        const validNewMajor = newMajor && typeof newMajor === 'object' ? newMajor.major : newMajor;
        const validNewCareer = newCareer && typeof newCareer === 'object' ? newCareer.career : newCareer;
        const validNewSchool = newSchool && typeof newSchool === 'object' ? newSchool.school : newSchool;

        const updated = await databases.updateDocument(databaseId, userCollectionId, docId, {
            name: validNewName,
            location: validNewLocation,
            major: validNewMajor,
            career: validNewCareer,
            school: validNewSchool,
        });
        console.log("Updated");
    } catch (error) {
        console.error("Error updating document:", error.message);
        throw new Error(error);
    }
}

export async function createLabel(interest_name) {
    if (interest_name) {
        try {
            const interests = await databases.listDocuments(
                databaseId,
                interestId,
                [Query.equal('interest_name', interest_name)]
            );
            console.log(interests);
            const currentUser = await getCurrentUser();
            if (!interests.documents[0]) {
                console.log("IF")
                const currList = [];
                currList.push(currentUser.$id);
                const newInterest = await databases.createDocument(
                    databaseId,
                    interestId,
                    ID.unique(),
                    {
                        interest_name,
                        user: currList,
                    }
                );
            }
            else {
                console.log("ELSE")
                const currentInt = interests.documents[0];
                const currList = currentInt.user;
                if (!currList.includes(currentUser.$id)) {
                    currList.push(currentUser.$id);
                }
                const updatedInt = await databases.updateDocument(
                    databaseId,
                    interestId,
                    currentInt.$id,
                    {
                        user: currList
                    }
                );
            }
        } catch (error) {
            console.error("Error updating document:", error.message);
            throw new Error(error);
        }
    }
}

export const getUserPhotos = async (userId) => {
    try {
        const photos = await databases.listDocuments(
            databaseId,
            photoCollectionId,
            [Query.equal("creator", userId)]
        );

        return photos.documents;
    } catch (error) {
        throw new Error(error);
    }
}
export async function getFilePreview(fileId, type) {
    let fileUrl;

    try {
        if (type === "video") {
            fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
        } else if (type === "image") {
            fileUrl = storage.getFilePreview(
                appwriteConfig.storageId,
                fileId,
                2000,
                2000,
                "top",
                100
            );
        } else {
            throw new Error("Invalid file type");
        }

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export async function uploadFile(file, type) {
    if (!file) return;

    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest };

    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            asset
        );

        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    } catch (error) {
        console.error("Error uploading document:", error.message);
        throw new Error(error);
    }
}

export const createImagePost = async (form) => {
    try {
        const photoUrl = await Promise.all([
            uploadFile(form.photo, "image")
        ]);
        const newPhoto = await databases.createDocument(
            databaseId,
            photoCollectionId,
            ID.unique(),
            {
                image: photoUrl[0],
                creator: form.userId
            }
        );
        return newPhoto;
    } catch (error) {
        console.error("Error creating document:", error.message);
        throw new Error(error);
    }
}

export const getMessages = async (sessionID) => {
    try {
        const currentUser = await getCurrentUser();
        const messages = await databases.listDocuments(databaseId, messageId, [Query.equal('sessionID', sessionID)]);

        return messages.documents;
    } catch (error) {
        throw new Error(error);
    }
}
export const createMessages=async(sessionID,Message)=>{
const sender= await getCurrentUser()
const messageDocument={}
messageDocument.sender=sender.$id
messageDocument.time=new Date().toISOString();
messageDocument.sessionID=sessionID
messageDocument.read=false
const message = await databases.createDocument(databaseId,messageId,ID.unique,messageDocument);

}
export const getNotification = async () => {
    try {
        const currentUser = await getCurrentUser();
        const notification = await databases.listDocuments(databaseId, notificationId, [Query.equal('receiver', currentUser.$id)])
        return notification.documents;
    } catch (error) {
        throw new Error(error)
    }
}
export const createNotification = async (receiver, type, message = '') => {
    try {
        let notification;
        const currentUser = await getCurrentUser();
        notification = createNotificationArr(receiver,currentUser, type, message)
        notification.sender = currentUser.$id;
        const newNotification = await databases.createDocument(databaseId, notificationId, ID.unique(), notification)
        console.log("notif created")
    }
    catch (error) {
        throw new Error(error)
    }
}
const createNotificationArr = (receiver,sender, type, message = '') => {
    let notification = {};
    notification.receiver = receiver
    notification.time = new Date().toISOString();
    switch (type) {
        case 'Message':
            notification.title = `Message from ${sender.username}`
            notification.description = `${sender.username} commented:"${message}"`
            break;
        case 'Like':
            notification.title = `New Like`
            notification.description = `${sender.username} liked your post`
            break;
        case 'Friend Request':
            notification.title = 'Friend Request'
            notification.description = `${sender.username} sent you a friend request`
            break;
    }
    return notification;
}

export async function updateNotif(senderName, wasAccepted){
    try{
        print("reached")
        print(senderName)
        const notifications = await databases.listDocuments(
            databaseId,
            notificationId,
            [Query.equal('name', senderName), Query.equal('title', 'Friend Request')]
        )
        const currNotif = notifications.documents[0]
        if(wasAccepted){
            const updated = await databases.updateDocument(
                databaseId,
                notificationId,
                currNotif.$id,
                {
                    title: "Friend Request Accepted",
                    description: "You've accepted the friend request",
                }
            );
        }
        else{
            const updated = await databases.updateDocument(
                databaseId,
                notificationId,
                currNotif.$id,
                {
                    title: "Friend Request Rejected",
                    description: "You've rejected the friend request"
                }
            );
        }
    }
    catch(error){
        console.error("Error updating document:", error.message);
        throw new Error(error);
    }
}

export async function createConnection(otherUser, suggestionAccepted, accID) {
    console.log("connection created")
    // console.log(otherUser)
    // console.log(accID)
    try {
        const currentUser = await getCurrentUser();
        const connections = await databases.listDocuments(
            databaseId,
            connectionsId,
            // check to see if theres a request
            [Query.equal('senderId', currentUser.accountId), Query.equal('receiverId', accID)]
        );
        console.log(connections);
        if (!connections.documents[0]) {
            // no previous interaction
            console.log("no existing connection")
            if (suggestionAccepted) {
                const newConnection = await databases.createDocument(
                    databaseId,
                    connectionsId,
                    ID.unique(),
                    {
                        outgoingRequest: true,
                        sender: currentUser.$id,
                        receiver: otherUser,
                        senderId: currentUser.accountId,
                        receiverId: accID
                    }
                )
            }
            else {
                const newConnection = await databases.createDocument(
                    databaseId,
                    connectionsId,
                    ID.unique(),
                    {
                        outgoingRequest: false,
                        sender: currentUser.$id,
                        receiver: otherUser,
                        suggestionRejected: true,
                        senderId: currentUser.accountId,
                        receiverId: accID
                    }
                )
            }
        }
        else {
            console.log("exists a connection")
            // there is an existing connection, edit so that there is an outgoing request
            const currentConnection = connections.documents[0];
            if (suggestionAccepted) {
                const updatedInt = await databases.updateDocument(
                    databaseId,
                    connectionsId,
                    currentConnection.$id,
                    {
                        outgoingRequest: true
                    }
                );
            }
            else {
                const updatedInt = await databases.updateDocument(
                    databaseId,
                    connectionsId,
                    currentConnection.$id,
                    {
                        suggestionRejected: true
                    }
                );
            }
        }
    } catch (error) {
        console.error("Error updating document:", error.message);
        throw new Error(error);
    }
}

// sender is the user who sent the friend request, wasAccepted refers to if the friend request was accepted or rejected
export async function updateConnection(senderName, wasAccepted){
    // sender is username, query based off username to get userId for connection update
    try{
        const senderDoc = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal('username', senderName)]
        );
        console.log("Sender fetched");
        sender = senderDoc.documents[0];
        const currentUser = await getCurrentUser();
        const connections = await databases.listDocuments(
            databaseId,
            connectionsId,
            // find the request
            [Query.equal('senderId', sender.accountId), Query.equal('receiverId', currentUser.accountId)]
        );
        console.log("Connection fetched")
        const currentConnection = connections.documents[0];
        if(wasAccepted){
            const updatedInt = await databases.updateDocument(
                databaseId,
                connectionsId,
                currentConnection.$id,
                {
                    outgoingRequest: false,
                    friendReqAccepted: true,
                }
            );
        }
        else{
            const updatedInt = await databases.updateDocument(
                databaseId,
                connectionsId,
                currentConnection.$id,
                {
                    outgoingRequest: false,
                }
            );
        }
        console.log("Connection Updated")
    }
    catch (error){
        console.error("Error updating document:", error.message);
        throw new Error(error);
    }
}

export async function getChatSession() {
    try {
        console.log('fetching chatSessions');
        const currentUser = await getCurrentUser();
        const chatSession = await databases.listDocuments(databaseId, chatSessionId, [Query.or([
            Query.equal('PersonA', currentUser.$id),
            Query.equal('PersonB', currentUser.$id)
        ])])
        return chatSession.documents
    } catch (error) {
        console.log("Failed to fetch chat session")
        console.log(error)
    }
}

export const getNotificationPreferences = async () => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) throw new Error("No user found");

        const preferences = await databases.listDocuments(
            databaseId,
            notificationPreferencesId,
            [Query.equal('userId', currentUser.$id)]
        );
        
        if (preferences.documents.length > 0) {
            return preferences.documents[0];
        }
        
        // If no preferences exist, create default preferences with all required attributes
        const defaultPreferences = {
            userId: currentUser.$id,
            friendRequests: true,
            messages: true,
            likes: true,
            comments: true,
            position: 'top'
        };
        
        const newPreferences = await databases.createDocument(
            databaseId,
            notificationPreferencesId,
            ID.unique(),
            defaultPreferences
        );
        
        return newPreferences;
    } catch (error) {
        console.error("Error getting notification preferences:", error);
        throw new Error(error);
    }
};

export const updateNotificationPreferences = async (preferences) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) throw new Error("No user found");

        // Only include the fields we want to update
        const updatedPreferences = {
            userId: currentUser.$id,
            friendRequests: preferences.friendRequests ?? true,
            messages: preferences.messages ?? true,
            likes: preferences.likes ?? true,
            comments: preferences.comments ?? true,
            position: preferences.position ?? 'top'
        };

        // Validate position value
        if (!['top', 'bottom'].includes(updatedPreferences.position)) {
            throw new Error("Invalid position value");
        }

        const existingPreferences = await databases.listDocuments(
            databaseId,
            notificationPreferencesId,
            [Query.equal('userId', currentUser.$id)]
        );
        
        if (existingPreferences.documents.length > 0) {
            return await databases.updateDocument(
                databaseId,
                notificationPreferencesId,
                existingPreferences.documents[0].$id,
                updatedPreferences
            );
        }
        
        return await databases.createDocument(
            databaseId,
            notificationPreferencesId,
            ID.unique(),
            updatedPreferences
        );
    } catch (error) {
        console.error("Error updating notification preferences:", error);
        throw new Error(error);
    }
};