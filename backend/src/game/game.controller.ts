import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Game')
@ApiResponse({
  status: 500,
  description: '서버 에러',
})
@ApiUnauthorizedResponse({ description: 'access token 오류' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiOperation({ summary: '게임 전적 추가' })
  @ApiCreatedResponse({ description: '전적 추가 완료' })
  @ApiNotFoundResponse({ description: '멤버를 찾지 못함' })
  @ApiConflictResponse({ description: 'P1과 P2가 동일한 멤버' })
  @ApiBody({ type: CreateGameDto })
  @Post('add')
  addHistory(@Body() game: CreateGameDto) {
    return this.gameService.addHistory(game);
  }

  @ApiOperation({ summary: 'intraId로 게임 전적 가져오기' })
  @ApiParam({
    name: 'intraId',
    required: true,
    description: '게임 전적을 받아올 인트라아이디',
  })
  @ApiNotFoundResponse({ description: '멤버를 찾지 못함' })
  @ApiOkResponse({
    description: '최근 전적 5개를 가져옴 (총 개수, 데이터)',
    type: CreateGameDto,
    isArray: true,
  })
  @Get('history/:intraId')
  findGamesByIntraId(@Param('intraId') intraId: string) {
    return this.gameService.findGamesByIntraId(intraId);
  }
}
