import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class DatosEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  dato!: string;
}
