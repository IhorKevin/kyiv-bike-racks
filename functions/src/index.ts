import * as functions from 'firebase-functions';
import {Storage} from '@google-cloud/storage';
import {tmpdir} from 'os';
import {basename, dirname, join} from 'path';
import * as sharp from 'sharp';
import admin = require('firebase-admin');

admin.initializeApp();

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

function setClaims(user: admin.auth.UserRecord, allowed: {[key: string]: any}) {
    const claims = {
        editor: allowed.editor,
        admin: allowed.admin
    };
    return admin.auth().setCustomUserClaims(user.uid, claims);
}

export const onAuth = functions.auth.user().onCreate((user, context) => {
    const email = user.email;
    return admin.firestore().collection('/allowed-emails')
        .get()
        .then(snapshot => snapshot.docs.map(doc => doc.data()))
        .then(data => {
            const current = data.find(docData => docData.email == email);
            if(current) setClaims(user, current);
            else console.warn('User with email', email, 'is not in access list');
        })
        .catch(error => console.warn(error.message));
});

export const updateAllowedUsers = functions.pubsub.schedule('every sunday 20:00').onRun((context) => {
    return admin.firestore().collection('/allowed-emails')
        .get()
        .then(snapshot => snapshot.docs.map(doc => doc.data()))
        .then(data => {
            data.forEach(allowed => {
                const email: string = allowed.email;
                admin
                    .auth()
                    .getUserByEmail(email)
                    .then(user => {
                        if(user) setClaims(user, allowed);
                    })
                    .catch(error => console.warn(error.message,': ', allowed.email));
            });
        });
});

export const calculateTotals = functions.pubsub.schedule('every sunday 21:00').onRun((context) => {
    return admin.firestore().collection('/racks')
        .get()
        .then(snapshot => snapshot.docs.map(doc => doc.data()))
        .then(data => {

            const sumCapacity = (racks: any[]): number => racks.reduce((acc, value) => {
                return acc + (value.capacity || 2);
            }, 0);

            const sheffieldRacks = data.filter(r => !!r.is_sheffield);
            const anyRacks = data.filter(r => !r.is_sheffield);
            const statRecord = {
                date: admin.firestore.Timestamp.now(),
                sheffieldRacks: sheffieldRacks.length,
                sheffieldCapacity: sumCapacity(sheffieldRacks),
                anyRacks: anyRacks.length,
                anyCapacity: sumCapacity(anyRacks),
                totalRacks: data.length,
                totalCapacity: sumCapacity(data)
            };

            admin.firestore().collection('/stats')
                .add(statRecord)
                .then(() => console.log('Stat record saved successfully.'))
                .catch(error => console.log(error));
        });
});

export const logNewRacks = functions.firestore.document('/racks/{id}').onCreate((snapshot, context) => {
    const link = 'https://kyiv-bike-racks.web.app/racks?rack_id=' + context.params.id;
    const email = 'unknown';
    const message = `User ${email} created rack ${link}`;
    console.info(message);
    return message;
});
