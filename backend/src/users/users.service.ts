import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  findAll() {
    return this.users;
  }

  create(user: CreateUserDto): User {

    if (!user.name || user.name.length < 3) {
        throw new Error('Nome inválido');
    }

    const exists = this.users.find(u => u.name === user.name);
    if (exists) {
    throw new Error('Usuário já existe');
    }

    const newUser: User = {
        id: Date.now(),
        name: user.name,
        createdAt: new Date()
    };
  
  this.users.push(newUser);
    return newUser;
  }

  update(id: number, data: UpdateUserDto) {
    const user = this.users.find(u => u.id === id);
    if (!user) return null;
  
    user.name = data.name ?? user.name;
    return user;
  }

  remove(id: number) {
    this.users = this.users.filter(u => u.id !== id);
    return { deleted: true };
  }

}