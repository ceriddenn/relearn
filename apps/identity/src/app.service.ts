import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      server: 'id.relearnapp.com',
      v: 'v1',
      case: 'auth/author',
      message: `Relearn's auth and identity server.`,
    };
  }
}
