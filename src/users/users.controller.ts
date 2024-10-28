/* eslint-disable prettier/prettier */
import {
    Controller,
    Get,
    Param, Body,
    Put,
    Delete,
    Query,
    ValidationPipe, HttpException,
    HttpStatus
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { checkIdIsValid } from 'src/helper';
import { PaginationDTO } from 'src/dto/pagination.dto';



@Controller('users')
export class UsersController {
    // Add user-related endpoints here
    constructor(private readonly usersService: UsersService) { };
    @Get()
    findAll(@Query() paginationDTO?: PaginationDTO) {
        return this.usersService.findAll(paginationDTO);
    }
    @Get(':id') // Get single user
    async findOne(@Param('id') id: string,) {
        checkIdIsValid(id)
        const findUser = await this.usersService.findOne(id);
        if (!findUser) throw new HttpException('User not found', HttpStatus.UNAUTHORIZED)
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
        return this.usersService.update(id, updateUserDto);
    }
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.usersService.delete(id);
    }
}
