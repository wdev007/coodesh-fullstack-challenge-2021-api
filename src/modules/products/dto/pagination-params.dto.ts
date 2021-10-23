import { Min, IsOptional, IsNumberString, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationParams {
  @IsOptional()
  @IsMongoId()
  startId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumberString()
  @Min(0)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumberString()
  @Min(1)
  limit?: number;
}
