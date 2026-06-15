import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { Reminder } from './reminder.entity';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder)
    private readonly remindersRepository: Repository<Reminder>,
  ) {}

  create(userId: number, createReminderDto: CreateReminderDto) {
    const reminder = this.remindersRepository.create({
      ...createReminderDto,
      dueDate: new Date(createReminderDto.dueDate),
      user: {
        id: userId,
      },
    });

    return this.remindersRepository.save(reminder);
  }

  findAllByUser(userId: number) {
    return this.remindersRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        dueDate: 'ASC',
      },
    });
  }

  async findOneByUser(id: number, userId: number) {
    const reminder = await this.remindersRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });

    if (!reminder) {
      throw new NotFoundException('Reminder not found');
    }

    return reminder;
  }

  async complete(id: number, userId: number) {
    const reminder = await this.findOneByUser(id, userId);

    reminder.completed = true;

    return this.remindersRepository.save(reminder);
  }

  async update(
    id: number,
    userId: number,
    updateReminderDto: UpdateReminderDto,
  ) {
    const reminder = await this.findOneByUser(id, userId);

    if (updateReminderDto.title !== undefined) {
      reminder.title = updateReminderDto.title;
    }

    if (updateReminderDto.description !== undefined) {
      reminder.description = updateReminderDto.description;
    }

    if (updateReminderDto.dueDate !== undefined) {
      reminder.dueDate = new Date(updateReminderDto.dueDate);
    }

    return this.remindersRepository.save(reminder);
  }

  async remove(id: number, userId: number) {
    const reminder = await this.findOneByUser(id, userId);

    await this.remindersRepository.remove(reminder);

    return {
      message: 'Reminder deleted successfully',
    };
  }
}
