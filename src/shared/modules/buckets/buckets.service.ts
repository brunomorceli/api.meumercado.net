import { InjectS3, S3 } from 'nestjs-s3';
import { HttpException, Injectable } from '@nestjs/common';
import { HttpStatusCode } from 'axios';

@Injectable()
export class BucketsService {
  constructor(@InjectS3() private readonly s3: S3) {}

  private async createBucket(bucket: string): Promise<void> {
    const buckets = await this.s3.listBuckets({});

    if (!buckets.Buckets.some((b) => b.Name === bucket)) {
      await this.s3.createBucket({ Bucket: bucket });
    }
  }

  async uploadImage(bucket: string, key: string, blob: string): Promise<void> {
    await this.createBucket(bucket);

    const data = {
      Key: key,
      Body: Buffer.from(blob.split(';base64,').pop(), 'base64'),
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
      Bucket: bucket,
    };

    try {
      await this.s3.putObject(data);
    } catch (e) {
      throw new HttpException(
        'Erro ao tentar enviar imagem.',
        HttpStatusCode.InternalServerError,
      );
    }
  }

  getImageUrl(bucket: string, id: string): string {
    return `${process.env.S3_ENDPOINT}/${bucket}/${id}`;
  }
}
