/* eslint-disable prettier/prettier */
import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete,
    Query,
    ValidationPipe, HttpException,
    HttpStatus
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { checkIdIsValid } from 'src/helper';



@Controller('users')
export class UsersController {
    // Add user-related endpoints here
    constructor(private readonly usersService: UsersService) { };

    @Post()
    create(@Body(ValidationPipe) createUserDto: CreateUserDto,) {
        return this.usersService.create(createUserDto);
    }
    @Get()
    findAll(@Query('role') role?: string) {
        return this.usersService.findAll(role);
    }
    @Get(':id') // Get single user
    async findOne(@Param('id') id: string,) {
        checkIdIsValid(id)
        const findUser = await this.usersService.findOne(id);
        if (!findUser) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        return this.usersService.findOne(id);
    }

    // @Patch(':id')
    // updateSingleField(@Param('id') id: string) {
    //     return { id, name: 'John Doe' };
    // }
    @Put(':id')
    async update(@Param('id') id: string,
        @Body(ValidationPipe) updateUserDto: UpdateUserDto
    ) {
        checkIdIsValid(id)
        const updatedUser = await this.usersService.update(id, updateUserDto);
        if (!updatedUser) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        return updatedUser
    }
    @Delete(':id')
    async delete(@Param('id') id: string) {
        checkIdIsValid(id)
        const deletedUser = await this.usersService.delete(id)
        if (!deletedUser) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        return deletedUser
    }
}
