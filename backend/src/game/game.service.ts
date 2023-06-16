import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async create(createGameDto: CreateGameDto) {
    const newGameHistory = await this.prisma.gameHistory.create({
      data: createGameDto
    });
    return newGameHistory;
  }

  async findGamesByIntraId(intraId : string) {
    const games = await this.prisma.gameHistory.findMany({
      where: { gameP1Id: intraId }
    })
    return games;
  }

  findAll( ){
    return `This action returns all game`;

  }
  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
