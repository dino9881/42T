// Member Status
export class statusConstants {
  public static readonly OFFLINE = 0;
  public static readonly ONLINE = 1;
  public static readonly IN_GAME = 2;
}

export class memberConstants {
  public static readonly RANK = 100;
  public static readonly ADMIN = 'admin';
}

// Game Mode
export class modeConstants {
  public static readonly EASY = 0;
  public static readonly NORMAL = 1;
  public static readonly HARD = 2;
}

// Game Initialize
export class gameConstants {
  public static readonly X1 = 10;
  public static readonly Y1 = 300;
  public static readonly X2 = 1270;
  public static readonly Y2 = 300;
  public static readonly BALL = { x: 640, y: 300, dx: 4, dy: -4 };
  public static readonly PADDLE_SIZE = 100;
  public static readonly PADDLE_WIDTH = 10;
  public static readonly PADDLE_SPEED = 40;
  public static readonly BALL_SPEED = 2;
  public static readonly BALL_SIZE = 15;
  public static readonly WINNER_RANK = 5;
  public static readonly LOSER_RANK = 3;
}

// Channel
export class channelConstants {
  public static readonly OPERATOR_CNT = 3;
  public static readonly USER_CNT = 5;
  public static readonly MUTE_TIME = 5 * 60 * 1000;
}
