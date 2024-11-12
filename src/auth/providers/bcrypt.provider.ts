import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class BcryptProvider implements HashingProvider {
  hashPassword(data: string | Buffer): Promise<string>;

  comparePassword(data: string | Buffer, encrypted: string): Promise<boolean>;
}
