import { HttpException, HttpStatus } from '@nestjs/common';
import mongoose from 'mongoose';

export const checkIdIsValid = (id: string) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new HttpException('Invalid ID', HttpStatus.NOT_FOUND);
};
