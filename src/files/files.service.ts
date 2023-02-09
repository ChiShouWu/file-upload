import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { File, FileDocument } from './file.schema';
import { getFileExtension } from '../utils/utils';
import { FileNames } from '../interfaces/file-names.interface';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name)
    private fileModel: Model<FileDocument>,
  ) {
    // make sure the uploads folder exists
    fs.mkdir('./uploads', { recursive: true });
  }

  /**
   * Store file info into db and store file into file system
   * @param file
   * @returns an url to access the file
   */
  async upload(file: Express.Multer.File): Promise<string> {
    // store a record into
    const { originalname, size } = file;
    const ext = getFileExtension(originalname);
    const newFileName = `${uuidv4()}.${ext}`;

    // store file into file system
    const newFilePath = `./uploads/${newFileName}`;
    try {
      await fs.writeFile(newFilePath, file.buffer);
    } catch (error) {
      console.error(`Error while storing file: ${error}`);
      throw new InternalServerErrorException();
    }

    // store file info into db
    const newFile = new this.fileModel({
      name: originalname,
      storedName: newFileName,
      size,
      path: newFilePath,
    });
    newFile.save();
    return newFile.id;
  }

  async findAll() {
    return this.fileModel.find({}, { storedName: 0 }).exec();
  }

  /**
   * Find the file by filedid return stored filename
   * @param id
   * @returns stored file name
   */
  async findOne(id: string): Promise<FileNames> {
    const file = await this.fileModel.findById(id).exec();
    if (!file) {
      throw new NotFoundException('File not found');
    }

    const { name, storedName } = file;
    return { storedName: `${storedName}`, originalName: name };
  }

  async remove(id: string) {
    // remove file from db
    const file = await this.fileModel.findByIdAndDelete(id).exec();

    // remove file from file system
    fs.rm(`./uploads/${file.storedName}`);
  }
}
