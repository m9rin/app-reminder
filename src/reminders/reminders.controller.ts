import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { RemindersService } from './reminders.service';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Controller('reminders')
@UseGuards(JwtAuthGuard)
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  create(@Req() req: any, @Body() createReminderDto: CreateReminderDto) {
    return this.remindersService.create(req.user.userId, createReminderDto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.remindersService.findAllByUser(req.user.userId);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string, @Req() req: any) {
    return this.remindersService.complete(Number(id), req.user.userId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updateReminderDto: UpdateReminderDto,
  ) {
    return this.remindersService.update(
      Number(id),
      req.user.userId,
      updateReminderDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.remindersService.remove(Number(id), req.user.userId);
  }
}
