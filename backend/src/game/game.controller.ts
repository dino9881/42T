import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('game')
@ApiResponse({
  status: 500,
  description: '서버 에러',
})
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiOperation({ summary: '게임 전적 추가' })
  @ApiResponse({
    status: 201,
    description: '전적 추가 완료',
  })
  @ApiResponse({
    status: 404,
    description: '멤버를 찾지 못함',
  })
  @ApiBody({ type: CreateGameDto })
  @Post('add')
  addHistory(@Body() game: CreateGameDto) {
    return this.gameService.addHistory(game);
  }

  @ApiOperation({ summary: 'intraId로 게임 전적 가져오기' })
  @ApiResponse({
    status: 404,
    description: '멤버를 찾지 못함',
  })
  @ApiResponse({
    status: 200,
    description: '최근 전적 5개를 가져옴 (총 개수, 데이터)',
    type: CreateGameDto,
    isArray: true,
  })
  @Get('history/:intraId')
  findGamesByIntraId(@Param('intraId') intraId: string) {
    return this.gameService.findGamesByIntraId(intraId);
  }

  // 추가해야할 기능
  // game queue 등록
  // game start : 2명이 모이면 게임 시작
}
