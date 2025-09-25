import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from 'generated/prisma';
import { PaginationDto } from 'src/common/dto';
import { date } from 'joi';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log("Database connected");
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({ data: createProductDto });
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 1 } = paginationDto;
    const [products, total] = await Promise.all([
      this.product.findMany({
        where: { avaliable: true },
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.product.count({ where: { avaliable: true } })
    ])
    return {
      products,
      pagination: {
        total,
        limit,
        page,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({ where: { id, avaliable: true } });
    if( !product ) throw new NotFoundException('El producto que buscas no existe');
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id: _, ...data } = updateProductDto;

    try {
      const product = await this.product.update({ where: { id }, data: data })
      return product;
    } catch (error) {
      if( error.code = 'P2025' ) throw new NotFoundException('El producto que quieres actualizar no existe');
      console.log(error);
    }
  }

  async remove(id: number) {
    try {
      const product = await this.product.update({ where: { id, avaliable: true }, data: { avaliable: false } })
      return product;
    } catch (error) {
      if( error.code = 'P2025' ) throw new NotFoundException('El producto que quieres eliminar no existe');
      console.log(error);
    }
  }
}
