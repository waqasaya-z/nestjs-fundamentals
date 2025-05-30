import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from "./flavor.entity/flavor.entity";

@Entity()
export class Coffee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: true})
    description: string

    @Column()
    brand: string;

    @Column({ default: 0 })
    recommendations: number
    
    @JoinTable()
    @ManyToMany(type => Flavor, (flavor) => flavor.coffees, { 
        cascade: true
    })
    flavors: Flavor[]
}