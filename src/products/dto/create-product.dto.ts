import { Type } from "class-transformer";
import { IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateProductDto {

  @IsString({ message: "El nombre debe de ser un string" })
  @MinLength(2, { message: "El nombre debe tener al menos 2 caracteres." })
  @MaxLength(200, { message: "El nombre no puede tener más de 200 caracteres" })
  public name: string;

  @IsNumber({
    maxDecimalPlaces: 4,
  }, { message: "El precio debe ser numerico" })
  @Min(0, { message: "El precio debe ser mayor a 0" })
  @Type(() => Number)
  public price: number;

}
