import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
      upload_preset: 'product-name',
    });
  }

  async uploadImage(file: Express.Multer.File, folder?: string): Promise<any> {
    console.log(folder);
    const response: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: folder }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(file.buffer);
    });

    return {
      name: file.originalname,
      mimetype: file.mimetype,
      resource_type: response.resource_type,
      url: response.url,
    };
  }
}
