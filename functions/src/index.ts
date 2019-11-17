import * as functions from 'firebase-functions';
import {Storage} from '@google-cloud/storage';
import {tmpdir} from 'os';
import {basename, dirname, join} from 'path';
import * as sharp from 'sharp';
import admin = require('firebase-admin');

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
const storage = new Storage();
export const resizeImage = functions.storage.object().onFinalize((metadata) => {
    const filePath = metadata.name || '/racks-photo/placeholder.jpg';
    const fileName = basename(filePath);
    const bucket = metadata.bucket;
    const bucketDir = dirname(filePath);
    const workingDir = tmpdir();
    const isOriginal = () => bucketDir.includes('original');

    if(isOriginal()) {
        const tmpFilePath = join(workingDir, fileName);
        const tmpThumbFilePath = join(workingDir, 'thumb-' + fileName) ;
        const destBucket = storage.bucket(bucket);
        return destBucket
            .file(filePath)
            .download({
                destination: tmpFilePath
            })
            .then(() => {
                return sharp(tmpFilePath)
                    .withMetadata()
                    .resize(1024, 1024, {fit: "inside"})
                    .jpeg({
                        quality: 65,
                        progressive: true
                    })
                    .toFile(tmpThumbFilePath);
            })
            .then(() => {
                return destBucket.upload(tmpThumbFilePath, {
                    destination: join(bucketDir, '..', 'preview', fileName)
                });
            })
            .catch(error => console.log(error));
    }
    else return;

});

export const onAuth = functions.auth.user().onCreate((user, context) => {
    const email = user.email;
    return admin.firestore().collection('/allowed-emails')
        .get()
        .then(snapshot => {
            const emails: string[] = snapshot.docs.map(doc => doc.data().email);
            const isAllowed = emails.some(value => value == email);
            if(isAllowed) admin.auth().setCustomUserClaims(user.uid, {editor: true});
        });
});