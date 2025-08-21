import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeesStructure } from './entities/fees-structure.entity';
import { FeesStructureService } from './fees-structure.service';
import { FeesStructureController } from './fees-structure.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtMiddleware } from 'src/config/jwt.middleware';

@Module({

  imports: [TypeOrmModule.forFeature([FeesStructure]),
  ConfigModule.forRoot({ isGlobal: true }),


  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      },
    }),
  }),
  ],
  providers: [FeesStructureService],
  controllers: [FeesStructureController],
})
export class FeesStructureModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
