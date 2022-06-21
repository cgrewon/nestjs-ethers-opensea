import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Res ,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Req,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

import { NftService } from './nft.service';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Post('create')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Req() req,
    @Body() createNftDto: CreateNftDto
  ) {
    return await this.nftService.create(req.user, createNftDto);
  }


  @Get('asset/:fileId')
  getNftAsset(@Res() res, @Param('fileId') fileId) {
    res.sendFile(fileId, { root: 'nft_assets' });
  }

  @Post('upload/media')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './nft_assets',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadNftMedia( @UploadedFile() file) {
    console.log(file);
    return {
      status: HttpStatus.OK,
      data: {
        path: `${process.env.HOST}nft/asset/${file.path}`,
      },
    };
  }


  @Get()
  findAll() {
    return this.nftService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nftService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNftDto: UpdateNftDto) {
    return this.nftService.update(+id, updateNftDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nftService.remove(+id);
  }
}
