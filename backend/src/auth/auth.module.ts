import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MemberModule } from '../member/member.module';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import jwtConfig from 'src/config/jwt.config';
import ftConfig from 'src/config/ft.config';

@Module({
  imports: [
    MemberModule,
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(ftConfig),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      useFactory: async (jwt: ConfigType<typeof jwtConfig>) => ({
        secret: jwt.accessSecret,
        global: true,
        signOptions: {
          expiresIn: jwt.accessExpire,
        },
      }),
      inject: [jwtConfig.KEY],
    }),
    forwardRef(() => MemberModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy],
})
export class AuthModule {}
