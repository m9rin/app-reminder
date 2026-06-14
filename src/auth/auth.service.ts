import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerDto: RegisterDto) {
    const userAlreadyExists = this.usersService.findByEmail(registerDto.email);

    if (userAlreadyExists) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.usersService.create({ ...registerDto, password: hashedPassword });

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}