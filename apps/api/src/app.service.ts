import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      server: 'api.relearnapp.com',
      v: 'v1',
      case: 'feat/appscontrol',
      message: `Relearn's feature and main platform server.`,
    };
  }
}
