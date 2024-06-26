import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'class-validator';


@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon;
      
    } catch (error) {
    
      this.handleExceptions(error)
    }
  }

  async findAll() {
    const pokemons: Pokemon[] = await this.pokemonModel.find();

    if ( isEmpty(pokemons)) throw new NotFoundException(`No hay Pokemones guardados`)
    
    return pokemons
  }

  async findOne(num: string) {

    let pokemon: Pokemon;

    //Verificación por num de pokemón
    if (!isNaN(+num)){
      pokemon = await this.pokemonModel.findOne({no: num})
    }

    //Verificación por mongo ID
    if (!pokemon && isValidObjectId(num)){
      pokemon = await this.pokemonModel.findById(num)
    }

    //Verificación por name
    if (!pokemon){
      pokemon = await this.pokemonModel.findOne({ name: num.toLowerCase().trim()})
    }

    //Pokemón NO existe
    if (!pokemon) throw new NotFoundException(`Pokemon con id, nombre o num ${num} not found`)

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term)

    if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase()

    try {
      await pokemon.updateOne(updatePokemonDto, {new: true})

      //return `El pokemón ${term} ha sido actualizado`;
      return { ...pokemon.toJSON(), ...updatePokemonDto}
      
    } catch (error) {
      this.handleExceptions(error)
    }

  }

  async remove(id: string) {
    // const pokemon = await  this.findOne(id)
    // await pokemon.deleteOne()
    //const pokemonDeleted = await this.pokemonModel.findByIdAndDelete(id)

    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id})

    if (deletedCount === 0 ) throw new BadRequestException(`El Pokemón no encontrado en BBDD`)

    return 
  }

  private handleExceptions(error: any){
    if (error.code === 11000){
      throw new BadRequestException(`El Pokemón ya existe en la base de datos ${JSON.stringify(error.keyValue) }`)
     }

     console.log(error);
     throw new InternalServerErrorException(`No se puede crear el Pokemón - Check server log`)
  }



}
