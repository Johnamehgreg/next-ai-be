import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

@Injectable()
export class ValidateNonEmptyBodyPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata.metatype || this.isPrimitive(metadata.metatype)) {
      return value;
    }

    // Check for an empty body
    if (Object.keys(value).length === 0) {
      throw new BadRequestException('Request body cannot be empty');
    }

    // Convert to the DTO class and validate using class-validator
    const dtoInstance = plainToInstance(metadata.metatype, value);
    const errors = validateSync(dtoInstance);

    // Get the properties of the DTO class directly from the prototype

    const obj: any = { ...metadata.metatype };

    const allowedFields = obj.allowedFields;

    // const allowedFields = Object.keys(new metadata.metatype());
    const extraFields = Object.keys(value).filter(
      (field) => !allowedFields.includes(field),
    );

    if (extraFields.length > 0) {
      throw new BadRequestException(
        `Unexpected fields: ${extraFields.join(', ')}. Allowed fields are: ${allowedFields.join(', ')}`,
      );
    }

    if (errors.length > 0) {
      throw new BadRequestException(
        errors
          .map((error) => Object.values(error.constraints || {}).join(', '))
          .join('; '),
      );
    }

    return value;
  }

  private isPrimitive(metatype: any): boolean {
    const primitiveTypes: any[] = [String, Boolean, Number, Array, Object];
    return primitiveTypes.includes(metatype);
  }
}
