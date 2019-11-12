import * as functions from 'firebase-functions';
import {Storage} from '@google-cloud/storage';
import {tmpdir} from 'os';
import {basename, join} from 'path';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
const storage = new Storage();
export const resizeImage = functions.storage.object().onFinalize((metadata) => {
    console.log("ON FINALIZE", metadata);
    const filePath = metadata.name || '/racks-photo/placeholder.jpg';
    console.log('FILE PATH', filePath);
    const fileName = basename(filePath);
    const bucket = metadata.bucket;
    const isOriginal = () => filePath.includes('/original/');

    if(isOriginal()) {
        const tmpFilePath = join(tmpdir(), fileName);
        const destBucket = storage.bucket(bucket);
        return destBucket
            .file(filePath)
            .download({
                destination: tmpFilePath
            })
            .then(() => {
                return destBucket.upload(tmpFilePath, {
                    destination: filePath.replace('original', '1280')
                })
            });
    }
    else return;

});
