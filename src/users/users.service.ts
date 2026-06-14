import { Injectable } from '@nestjs/common';

type User = {
    id: number;
    name: string;
    email: string;
    password: string;
}

@Injectable()
export class UsersService {
    private users: User[] = [];
    private nextId: number = 1;

    create(data: Omit<User, 'id'>) {
        const user: User = {
            id: this.nextId,
            ...data
        };
        this.users.push(user);
        this.nextId++;
        return user;
    }

    findByEmail(email: string) {
        return this.users.find(user => user.email === email);
    }
}
