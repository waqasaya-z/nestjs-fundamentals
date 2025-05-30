import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';

@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeeService: CoffeesService) {}

    @Get()
    findAll(@Query() paginationQuery: PaginationQueryDto) {
       // const {limit, offset} = paginationQuery;
        return this.coffeeService.findAll(paginationQuery);
    }

    @Get(':id')
    findOne(@Param('id') id: number){
        return this.coffeeService.findOne('' + id)
    }

    @Post()
    create(@Body() createCoffeDto: CreateCoffeeDto) {
        return this.coffeeService.create(createCoffeDto)
    }

    @Patch(':id')
    update(@Param ('id') id: string, @Body() updateCoffeDto: UpdateCoffeeDto) {
        return this.coffeeService.update(id,updateCoffeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
          return this.coffeeService.remove(id)
    }
}
