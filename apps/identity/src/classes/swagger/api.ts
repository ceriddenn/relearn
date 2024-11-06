import { ApiProperty } from '@nestjs/swagger';
export class UnauthorizedException {
    @ApiProperty()
    message: "Unauthorized";

    @ApiProperty()
    statusCode: "401";
}