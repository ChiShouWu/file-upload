import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

// validate input is file
@Injectable()
export class ParseFile implements PipeTransform {
  transform(
    file: Express.Multer.File,
    metadata: ArgumentMetadata,
  ): Express.Multer.File | Express.Multer.File[] {
    const validateFailedMessage = 'Validation failed (file expected)';
    if (file === undefined || file === null) {
      throw new BadRequestException(validateFailedMessage);
    }
    return file;
  }
}

// validate file size with dynamic input file size
@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  /**
   * size unit it k bytes
   * @param maxSize
   */
  constructor(private readonly maxSize: number) {}
  transform(
    file: Express.Multer.File,
    metadata: ArgumentMetadata,
  ): Express.Multer.File {
    if (file.size > this.maxSize * 1024) {
      throw new BadRequestException('File size is too large');
    }
    return file;
  }
}

// validate file extension name with dynamic input file extension names
@Injectable()
export class FileExtensionValidationPipe implements PipeTransform {
  constructor(private readonly allowedExtensions: string[]) {}

  transform(
    file: Express.Multer.File,
    metadata: ArgumentMetadata,
  ): Express.Multer.File {
    const ext = file.originalname.split('.').pop();
    if (!this.allowedExtensions.includes(ext)) {
      throw new UnsupportedMediaTypeException();
    }
    return file;
  }
}

// validate file mine type with dynamic input file mine types
@Injectable()
export class FileMineTypeValidationPipe implements PipeTransform {
  constructor(private readonly allowedMineTypes: string[]) {}

  transform(
    file: Express.Multer.File,
    metadata: ArgumentMetadata,
  ): Express.Multer.File {
    if (!this.allowedMineTypes.includes(file.mimetype)) {
      throw new UnsupportedMediaTypeException();
    }
    return file;
  }
}
