import { Injectable, RequestTimeoutException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class SaveLocalFilesProvider {
  private readonly uploadPath = path.join(process.cwd(), 'photos');

  public async fileUpload(file: Express.Multer.File): Promise<string> {
    console.log(this.uploadPath);

    try {
      if (!fs.existsSync(this.uploadPath)) {
        fs.mkdirSync(this.uploadPath, { recursive: true });
      }

      const fileName = this.generateFileName(file);
      const filePath = path.join(this.uploadPath, fileName);

      console.log(`Saving file to: ${filePath}`);

      fs.writeFileSync(filePath, file.buffer);

      return filePath;
    } catch (error) {
      throw new RequestTimeoutException('Error saving file locally', error);
    }
  }

  private generateFileName(file: Express.Multer.File): string {
    const name = file.originalname.split('.')[0].replace(/\s/g, '').trim();
    const extension = path.extname(file.originalname);
    return `${name}-${Date.now()}-${uuid4()}${extension}`;
  }
}
