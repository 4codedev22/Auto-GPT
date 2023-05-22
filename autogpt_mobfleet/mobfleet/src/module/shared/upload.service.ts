import { Injectable, Logger } from '@nestjs/common';
import AWS from 'aws-sdk';
import { Stream } from 'stream';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
    logger = new Logger('UploadService');
    private readonly bucket = process.env.AWS_S3_BUCKET;

    private readonly s3 = new AWS.S3({ s3ForcePathStyle: true });
    constructor() {
        AWS.config.update({ region: process.env.AWS_REGION });
    }

    async getUploadUrl(key: string, expiresInSeconds: number): Promise<string> {
        const methodLogger = new Logger('UploadService - getUploadUrl');
        const params = {
            Bucket: this.bucket,
            Key: key.toLowerCase(),
        };
        methodLogger.debug({ region: process.env.AWS_REGION, ...params }, 'params');
        return await new Promise((resolve, reject) => {
            this.s3.headObject(params, err => {
                if (err && err.code === 'NotFound') {
                    methodLogger.debug('', 'getSignedUrl');

                    const url = this.s3.getSignedUrl('putObject', {
                        ...params,
                        Expires: expiresInSeconds,
                        ContentType: 'application/octet-stream',
                    });
                    methodLogger.debug(url, 'getSignedUrl');
                    resolve(url);
                } else {
                    methodLogger.error(err, 'File already Exists');
                    reject(new Error('File already Exists'));
                }
            });
        });
    }

    private async upload(name: string, stream: Buffer, addUUIDToFileName = true): Promise<AWS.S3.ManagedUpload.SendData> {
        const methodLogger = new Logger('UploadService - upload');
        const filename = `${addUUIDToFileName ? uuid() + '-' : ''}${name.toLowerCase()}`;
        const params = { Bucket: this.bucket, Key: filename, Body: stream, ACL: 'public-read' };
        const { Body, ...otherParams } = params;
        methodLogger.debug(otherParams, 'UploadService - upload - params');

        return await new Promise((resolve, reject) => {
            this.s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
                if (err) {
                    methodLogger.error(err, 'upload error');
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }



    private async uploadStream(name: string, stream: Stream, addUUIDToFileName = true): Promise<AWS.S3.ManagedUpload.SendData> {
        const methodLogger = new Logger('UploadService - uploadStream');
        const filename = `${addUUIDToFileName ? uuid() + '-' : ''}${name.toLowerCase()}`;
        const params = { Bucket: this.bucket, Key: filename, ACL: 'public-read' };
        methodLogger.debug(params, 'UploadService - upload - params');

        return await new Promise((resolve, reject) => {
            this.s3.upload({ Body: stream, ...params }, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
                if (err) {
                    methodLogger.error(err, 'uploadStream - upload error');
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    async uploadFile(buffer: Buffer, filename: string, addUUIDToFileName = true): Promise<AWS.S3.ManagedUpload.SendData | undefined> {
        const methodLogger = new Logger('UploadService - uploadFile');
        return await this.upload(filename, buffer, addUUIDToFileName)
            .catch(err => {
                methodLogger.error(err, 'Unable to upload');
                throw err;
            })
            .then(data => data);
    }

    async uploadFileStream(stream: Stream, filename: string, addUUIDToFileName = true): Promise<AWS.S3.ManagedUpload.SendData | undefined> {
        const methodLogger = new Logger('UploadService - uploadFileStream');
        return await this.uploadStream(filename, stream, addUUIDToFileName)
            .catch(err => {
                methodLogger.error(err, 'Unable to uploadFileStream');
                throw err;
            })
            .then(data => data);
    }

    private async getObject(bucket: string, key: string): Promise<AWS.S3.Body> {
        const methodLogger = new Logger('UploadService - getObject');
        const params = {
            Bucket: bucket,
            Key: key.toLowerCase(),
        };
        return await new Promise((resolve, reject) => {
            this.s3.getObject(params, (err: Error, data: AWS.S3.GetObjectOutput) => {
                if (err) {
                    methodLogger.error(err, 's3.getObject fail');
                    reject(err);
                } else {
                    resolve(data.Body);
                }
            });
        });
    }

    async getFileBuffer(bucket: string, fileKey: string): Promise<AWS.S3.Body> {
        const methodLogger = new Logger('UploadService - getFileBuffer');
        const fileBuffer = await this.getObject(bucket, fileKey)
            .catch(err => {
                methodLogger.error(err, 'Unable get file');
            })
            .then(data => data);
        return fileBuffer as AWS.S3.Body;
    }
}
