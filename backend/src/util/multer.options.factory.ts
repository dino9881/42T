import { Logger } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

const mkdir = (directory: string) => {
  const logger = new Logger('Mkdir');
  const absolutePath = path.join(process.cwd(), directory);
  try {
    fs.readdirSync(absolutePath);
  } catch (err) {
    logger.log(
      `지정한 경로에 ${directory}가 존재하지 않아 ${directory}를 생성합니다.`,
    );
    fs.mkdirSync(absolutePath, { recursive: true });
  }
};

const storage = (dirctory: string): multer.StorageEngine => {
  mkdir(dirctory);
  return multer.diskStorage({
    destination(req, file, done) {
      const absolutePath = path.join(process.cwd(), dirctory);
      console.log('File destination:', absolutePath); // 로그 추가
      done(null, absolutePath);
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      const fileName = `${path.basename(
        file.originalname,
        ext,
      )}${Date.now()}${ext}`;
      console.log('File name:', fileName);
      done(null, fileName);
    },
  });
};

export const multerOptions = () => {
  const result: MulterOptions = {
    storage: storage('avatars'),
  };
  return result;
};
