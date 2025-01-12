import { initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { onObjectFinalized } from 'firebase-functions/storage';
import { onSchedule } from 'firebase-functions/scheduler';
import { onDocumentCreated } from 'firebase-functions/firestore';
import { auth } from 'firebase-functions/v1';
import { tmpdir } from 'os';
import { basename, dirname, join } from 'path';
import sharp from 'sharp';

const app = initializeApp();
const storage = getStorage(app);
const firestore = getFirestore(app);
const appAuth = getAuth(app);

export const resizeImage = onObjectFinalized({
    region: 'europe-west3'
}, (event) => {
    const filePath = event.data.name || '/racks-photo/placeholder.jpg';
    const fileName = basename(filePath);
    const bucketDir = dirname(filePath);
    const workingDir = tmpdir();
    const isOriginal = () => bucketDir.includes('original');
    if (isOriginal()) {
        const tmpFilePath = join(workingDir, fileName);
        const tmpThumbFilePath = join(workingDir, 'thumb-' + fileName);
        const destBucket = storage.bucket();

        return destBucket
            .file(filePath)
            .download({
                destination: tmpFilePath
            })
            .then(() => {
                return sharp(tmpFilePath)
                    .withMetadata()
                    .resize(1024, 1024, { fit: 'inside' })
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
    else {
        return;
    }
});

const setClaims = (uid: string, allowed: {[key: string]: any}) => {
    const claims = {
        editor: allowed.editor,
        admin: allowed.admin
    };
    return appAuth.setCustomUserClaims(uid, claims);
};

export const onAuth = () => auth.user().onCreate((user) => {
    const email = user.email;
    return firestore.collection('/allowed-emails')
        .get()
        .then(snapshot => snapshot.docs.map(doc => doc.data()))
        .then(data => {
            const current = data.find(docData => docData.email === email);
            if (current) {
                setClaims(user.uid, current);
            }
            else {
                console.warn('User with email', email, 'is not in access list');
            }
        })
        .catch(error => console.warn(error.message));
});

export const updateAllowedUsers = onSchedule('every sunday 20:00', () => {
    return firestore.collection('/allowed-emails')
        .get()
        .then(snapshot => snapshot.docs.map(doc => doc.data()))
        .then(data => {
            data.forEach(allowed => {
                const email: string = allowed.email;
                appAuth.getUserByEmail(email)
                    .then(user => setClaims(user.uid, allowed))
                    .catch(error => console.warn(error.message, ': ', allowed.email));
            });
        });
});

export const calculateTotals = () => onSchedule('every sunday 21:00', () => {
    return firestore.collection('/racks')
        .get()
        .then(snapshot => snapshot.docs.map(doc => doc.data()))
        .then(data => {
            const sumCapacity = (racks: any[]): number => racks.reduce((acc, value) => {
                return acc + (value.capacity || 2);
            }, 0);

            const sheffieldRacks = data.filter(r => !!r.is_sheffield);
            const anyRacks = data.filter(r => !r.is_sheffield);
            const statRecord = {
                date: Timestamp.now(),
                sheffieldRacks: sheffieldRacks.length,
                sheffieldCapacity: sumCapacity(sheffieldRacks),
                anyRacks: anyRacks.length,
                anyCapacity: sumCapacity(anyRacks),
                totalRacks: data.length,
                totalCapacity: sumCapacity(data)
            };

            firestore.collection('/stats')
                .add(statRecord)
                .then(() => console.log('Stat record saved successfully.'))
                .catch(error => console.log(error));
        });
});

export const logNewRacks = onDocumentCreated('/racks/{id}', (event) => {
    const link = 'https://kyiv-bike-racks.web.app/racks?rack_id=' + event.params.id;
    const email = 'unknown';
    const message = `User ${email} created rack ${link}`;
    console.log(message);
    return message;
});
