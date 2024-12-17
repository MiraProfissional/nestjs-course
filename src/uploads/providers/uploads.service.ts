import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from '../upload.entity';
import { SaveLocalFilesProvider } from './save-local-files.provider';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { ConfigService } from '@nestjs/config';
import { UploadFile } from '../interfaces/upload-file.interface';
import { fileTypes } from '../enums/file-types.enum';

@Injectable()
export class UploadsService {
  constructor(
    private readonly configService: ConfigService,

    private readonly saveLocalFilesProvider: SaveLocalFilesProvider,

    @InjectRepository(Upload)
    private readonly uploadsRepository: Repository<Upload>,

    private readonly uploadToAwsProvider: UploadToAwsProvider,
  ) {}

  public async uploadFile(file: Express.Multer.File) {
    // Throw error for unsupported MIME types
    if (
      !['image/gif', 'image/jpeg', 'image/jpg', 'image/png'].includes(
        file.mimetype,
      )
    ) {
      throw new BadRequestException('Mime type not supported');
    }

    try {
      // Upload the file to AWS S3
      // const name = await this.uploadToAwsProvider.fileUpload(file);

      // In that case, we will save locally
      const name = await this.saveLocalFilesProvider.fileUpload(file);

      // Generate to a new entry in database
      const uploadFile: UploadFile = {
        name: name,
        path: `${name}`,
        type: fileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };

      const upload = this.uploadsRepository.create(uploadFile);

      return await this.uploadsRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
