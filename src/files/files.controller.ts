import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Res,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  ParseFilePipeBuilder,
  HttpStatus,
  FileTypeValidator,
  HttpCode,
  UseFilters,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  FileExtensionValidationPipe,
  FileMineTypeValidationPipe,
  FileSizeValidationPipe,
  ParseFile,
} from '../validators/file.validator';
import { Response } from 'express';
import { IsObjectIdPipe } from '../pipes/IsObjectId.pipe';
import { BoundaryErrorFilter } from '../filters/boundary.filter';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseFilters(BoundaryErrorFilter)
  @UseInterceptors(FileInterceptor('data', {}))
  async upload(
    @UploadedFile(
      ParseFile,
      new FileExtensionValidationPipe(['mpg', 'mpeg', 'mp4', 'mpg4']),
      new FileMineTypeValidationPipe(['video/mp4', 'video/mpeg']),
    )
    file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const fileid = await this.filesService.upload(file);
    const filePath = `/files/${fileid}`;
    res.set({ Location: filePath }).send();
  }

  @Get()
  async findAll() {
    return this.filesService.findAll();
  }

  @Get(':fileid')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('fileid', IsObjectIdPipe) id: string,
    @Res() res: Response,
  ) {
    const fileName = await this.filesService.findOne(id);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileName.originalName}}"`,
    );

    res.sendFile(fileName.storedName, { root: './uploads' }, (err) => {
      if (err) {
        console.error(err);
        res.status(HttpStatus.NOT_FOUND).send({
          message: 'File not found',
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
        });
      }
    });
  }

  @Delete(':fileid')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('fileid', IsObjectIdPipe) id: string) {
    return this.filesService.remove(id);
  }
}
