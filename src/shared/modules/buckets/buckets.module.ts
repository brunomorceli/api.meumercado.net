import { Module } from '@nestjs/common';

import { BucketsService } from './buckets.service';
import { S3Module } from 'nestjs-s3';

@Module({
  imports: [
    S3Module.forRoot({
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || 'minio',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || 'minio-password',
        },
        region: process.env.S3_REGION || 'us-east-1',
        endpoint: process.env.S3_ENDPOINT || 'http://127.0.0.1:9000',
        forcePathStyle: true,
        //signatureVersion: 'v4',
      },
    }),
  ],
  providers: [BucketsService],
  exports: [BucketsService],
})
export class BucketsModule {}
