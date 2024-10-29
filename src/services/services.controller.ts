import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  ValidationPipe,
  Req,
  Query,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { PaginationDTO } from 'src/dto/pagination.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }
  @UseGuards(AuthGuard)
  @Post()
  create(@Body(ValidationPipe) createServiceDto: CreateServiceDto, @Req() req) {
    return this.servicesService.create(createServiceDto, req.userId);
  }

  @Get()
  findAll(@Query() paginationDTO?: PaginationDTO) {
    return this.servicesService.findAll(paginationDTO);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
