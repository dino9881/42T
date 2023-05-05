import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as dotenv from 'dotenv'

dotenv.config()

const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'user',
  password: '1234',
  database: '42T',
  logging: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],

  // TypeOrm 자동 동기화, migration 작업을 위해 중지
  synchronize: false,

  // dist/migrations에 있는 파일들을 실행
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  // migrate run 자동 실행
  // migrationsRun: true,
//   cli: {
//     // entitiesDir: 'src/entities',
//     // src/migrations에 있는 파일들을 dist/migrations에 생성
//     migrationsDir: 'src/migrations',
//   },
}

export default ormconfig