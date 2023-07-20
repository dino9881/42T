import { Socket } from 'socket.io';

export interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export interface GameProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  ball: Ball;
  p1Score: number;
  p2Score: number;
  speed: number;
}

export interface GameRoom {
  player1: Socket;
  player2: Socket;
  gameProps: GameProps;
  mode: number;
  finish: boolean;
}
