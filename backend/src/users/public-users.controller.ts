import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class PublicUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/public')
  async getPublicProfile(@Param('id') id: string) {
    const profile = await this.usersService.getPublicProfile(id);
    return {
      success: true,
      data: profile,
    };
  }
}
