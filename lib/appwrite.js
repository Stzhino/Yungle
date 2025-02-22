import { Account, Client, Databases, ID, Avatars, Query, Storage } from 'react-native-appwrite'

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.yungle.group_three',
    projectId: '6791a2a5001be532fa28',
    databaseId: '6791a46000383bb878fa',
    userCollectionId: '67b96217001a07c37f7d',
    photoCollectionId: '67b964e6002b38069693',
    interestId:
    '67b96404003d3fe484d2',
    messageId:
    '67b9654d003d4a5ebb0a',
    storageId: '6791a76f002a58a1fb76',
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
    messageId
} = appwriteConfig;
// Init your React Native SDK

export const DATABASES_ID = databaseId;

export const MESSAGE_ID = messageId;
export const client = new Client();
 
export const mess_databases = new Databases(client);

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.

    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);
    const storage = new Storage(client);

export const createUser = async (email, password, username) => {
    try{
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if(!newAccount) throw Error;
        const avatarUrl = avatars.getInitials(username);
        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId, appwriteConfig.userCollectionId, ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )
        return newUser;
    } catch(error){
        console.log(error);
        throw new Error(error);
    }
}

export const signIn = async(email, password) => {
    try{
        const session = await account.createEmailPasswordSession(email, password)

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId, appwriteConfig.userCollectionId, [Query.equal('accountId', currentAccount.$id)]
        )
        if(!currentUser) throw Error;

        return currentUser.documents[0];
    }catch (error){
        console.log(error);
    }
}

export const getUsers = async () => {
    try{
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;
        const users = await databases.listDocuments(databaseId, userCollectionId, [Query.notEqual('accountId',currentAccount.$id)]);

        return users.documents;
    } catch (error){
        throw new Error(error);
    }
}

export async function signOut() {
    try {
      const session = await account.deleteSession("current");
  
      return session;
    } catch (error) {
      throw new Error(error);
    }
}

export const searchUsers = async(query) => {
    try{
        const users = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.search('name', query)]
        )
        return users.documents;
    } catch(error){
        throw new Error(error);
    }
}

export const updateUser = async(newName, newLocation, newMajor, newCareer, newSchool) => {
    try{
        const currentUser = await getCurrentUser();
        const docId = currentUser.$id;
    
        const validNewName = newName && typeof newName === 'object' ? newName.name : newName;
        const validNewLocation = newLocation && typeof newLocation === 'object' ? newLocation.location : newLocation;
        const validNewMajor = newMajor && typeof newMajor === 'object' ? newMajor.major : newMajor;
        const validNewCareer = newCareer && typeof newCareer === 'object' ? newCareer.career : newCareer;
        const validNewSchool = newSchool && typeof newSchool === 'object' ? newSchool.school : newSchool;

        const updated = await databases.updateDocument(databaseId, userCollectionId, docId,{
            name: validNewName,
            location: validNewLocation,
            major: validNewMajor,
            career: validNewCareer,
            school: validNewSchool,
        });
        console.log("Updated");
    }catch(error){
        console.error("Error updating document:", error.message);
        throw new Error(error);
    }
}

export async function createLabel(interest_name){
    if(interest_name){
        try{
            const interests=await databases.listDocuments(
                databaseId,
                interestId,
                [Query.equal('interest_name', interest_name)]
            );
            console.log(interests);
            const currentUser = await getCurrentUser();
            if(!interests.documents[0]){
                console.log("IF")
                const currList = [];
                currList.push(currentUser.$id);
                const newInterest=await databases.createDocument(
                    databaseId,
                    interestId,
                    ID.unique(),
                    {
                        interest_name,
                        user: currList,
                    }
                );
            }
            else{
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
                        user:currList
                    }
                );
            }
        }catch(error){
            console.error("Error updating document:", error.message);
            throw new Error(error);
        }
    }
}

export const getUserPhotos = async (userId) => {
    try{
        const photos = await databases.listDocuments(
            databaseId,
            photoCollectionId,
            [Query.equal("creator", userId)]
        );

        return photos.documents;
    } catch (error){
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

export const createImagePost = async(form) => {
    try {
        const photoUrl=await Promise.all([
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

/*
export async function getMessages() {
    try {
        const currentUser = await getCurrentUser();
        
        // Fetch existing chat messages
        const chats = await databases.listDocuments(
            databaseId,
            messageId,
            [Query.equal('receiver', currentUser.$id)]
        );

        if (chats.documents.length === 0) {
            // Get messages from shared database
            const chatMessages = await databases.createDocument(
                databaseId,
                chatsConfigId,
                ID.unique(),
                {
                    userId: currentUser.$id,
                    sender: currentUser.sender,
                    name: currentUser.name,
                    avatarUrl: currentUser.avatar,
                    message: '',
                    timestamp: new Date().toISOString(),
                    status: 'messages'
                }
            );
            
            const chatList = await databases.listDocuments(
                databaseId,
                chatsTableId,
                [Query.equal('userId', currentUser.$id)]
            );

            // Add timestamps to messages
            for (const chat of chatList.documents) {
                const messageWithTimestamp = await createMessageWithTimestamp(chat);
                await addOrUpdateMessageToAppwrite(messageWithTimestamp, chat);
            }

            return [chatList.documents[0]];
        }
        
        return chatMessages.documents;
    } catch (error) {
        console.error("Error fetching messages:", error.message);
        throw new Error(error);
    }
}

export async function createMessageWithTimestamp(chat) {
    const timestamp = new Date().toISOString();
    
    return await databases.createDocument(
        databaseId,
        chatsConfigId,
        ID.unique(),
        {
            userId: chat.userId,
            sender: chat.sender,
            name: chat.name,
            avatarUrl: chat.avatarUrl,
            message: chat.message + ' ' + timestamp,
            timestamp: timestamp,
            status: 'messages'
        }
    );
}

export async function addOrUpdateMessageToAppwrite(message, chat) {
    try {
        if (message.id === null) {
            await databases.createDocument(
                databaseId,
                chatsConfigId,
                ID.unique(),
                {
                    ...message
                }
            );
        } else {
            const updatedDoc = await databases.updateDocument(
                databaseId,
                chatsConfigId,
                message.id,
                {
                    ...message
                }
            );
            
            if (updatedDoc.id === null) {
                throw new Error('Failed to update document');
            }
        }
    } catch (error) {
        console.error('Error updating or creating message:', error.message);
        throw new Error(error);
    }
}
    */
