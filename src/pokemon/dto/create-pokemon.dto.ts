import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {

    //Debe ser entero, positivo, valor minimo 1
    @IsInt()
    @IsPositive()
    @Min(1)
    no: number;

    //debe ser string, minlenght 1
    @IsString()
    @MinLength(1)
    name: string;
}
