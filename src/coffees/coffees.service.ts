import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity/flavor.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity/event.entity';

@Injectable()
export class CoffeesService {
 
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
       private readonly flavorRepository: Repository<Flavor>,
       private readonly connection: Connection, 
    //    private readonly configService: ConfigService
    //    @Inject(COFFEE_BRANDS) coffeeBrands: string[]
    ){
   
    }

    findAll(paginationQuery: PaginationQueryDto) {
        const {limit, offset} = paginationQuery;
        return this.coffeeRepository.find({
            relations: ['flavors'],
            skip: offset,
            take: limit
        });
    }

    async findOne(id: string) {
        const coffee = await this.coffeeRepository.findOne({  where: { id: parseInt(id, 10) }, relations: ['flavors'] });

        if (!coffee) {
            throw new NotFoundException(`Coffe #${id} not found`)
        }

        return coffee;
    }

    async create(createCoffeeDto: CreateCoffeeDto) {
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
        )


      const coffee =  this.coffeeRepository.create({...createCoffeeDto, flavors})
    return this.coffeeRepository.save(coffee)
    }

   async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
       const flavors =  updateCoffeeDto.flavors &&  await Promise.all(
         updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
        )

     const coffee = await this.coffeeRepository.preload({
        id: +id,
        ...updateCoffeeDto,
        flavors
     })

     if (!coffee) {
        throw new NotFoundException(`Coffee #${id} not found`)
     }
     return this.coffeeRepository.save(coffee)
    }

    async remove(id: string){
        const coffee = await this.findOne(id);
        return this.coffeeRepository.remove(coffee)
    }

    async recommendCoffeee(coffee: Coffee) {
        const queryRunner = this.connection.createQueryRunner()

        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            coffee.recommendations++

            const recommendEvent = new Event()
            recommendEvent.name = 'recommend_coffee'
            recommendEvent.type = 'coffee'
            recommendEvent.payload = { coffeeId: coffee.id }

        } catch (err) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    private async preloadFlavorByName(name: string): Promise<Flavor> {
        const existingFlavor = await this.flavorRepository.findOne({ where: {name: name } });

        if (existingFlavor) {
            return existingFlavor
        }

        return this.flavorRepository.create({name})
    }
}
