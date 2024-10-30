/* eslint-disable prettier/prettier */
import {
    Controller,
    Get,
    Param, Body,
    Put,
    Delete,
    Query,
    ValidationPipe,
    UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateBusinessInformationSettingsDto, UpdateBusinessVerificationSettingsDto, UpdateNotificationSettingsDto, } from './dto/update-user.dto';
import { PaginationDTO } from 'src/dto/pagination.dto';
import { AuthGuard } from 'src/guards/auth.guard';



@Controller('users')
export class UsersController {
    // Add user-related endpoints here
    constructor(private readonly usersService: UsersService) { };
    @UseGuards(AuthGuard)

    @Get()
    findAll(@Query() paginationDTO?: PaginationDTO) {
        return this.usersService.findAll(paginationDTO);
    }
    @Get(':id') // Get single user
    async findOne(@Param('id') id: string,) {
        return this.usersService.findOne(id);
    }
    @Put(':id')
    @UseGuards(AuthGuard)
    async update(@Param('id') id: string,
        @Body(ValidationPipe) updateUserDto: any
    ) {
        return this.usersService.update(id, updateUserDto);
    }
    @Delete(':id')
    @UseGuards(AuthGuard)
    async delete(@Param('id') id: string) {
        return this.usersService.delete(id);
    }

    @Put('notification-settings/:id')
    @UseGuards(AuthGuard)
    async updateSettings(@Param('id') id: string,
        @Body(ValidationPipe) updateSettingsDto: UpdateNotificationSettingsDto
    ) {
        return this.usersService.updateUserNotificationSettings(id, updateSettingsDto);
    }
    @Put('business-information-settings/:id')
    @UseGuards(AuthGuard)
    async updateBusinessInformationSettings(@Param('id') id: string,
        @Body(ValidationPipe) updateSettingsDto: UpdateBusinessInformationSettingsDto
    ) {
        return this.usersService.updateUserBusinessInformationSettings(id, updateSettingsDto);
    }
    @Put('business-verification-settings/:id')
    @UseGuards(AuthGuard)
    async updateBusinessVerificationSettings(@Param('id') id: string,
        @Body(ValidationPipe) updateSettingsDto: UpdateBusinessVerificationSettingsDto
    ) {
        return this.usersService.updateUserBusinessVerificationSettings(id, updateSettingsDto);
    }

}
