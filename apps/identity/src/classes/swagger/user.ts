import { ApiProperty } from '@nestjs/swagger';
import { User as RelearnUser } from '@relearn/database';
export class User {
    @ApiProperty()
    user: RelearnUser;
}