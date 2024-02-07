import { Module } from '@nestjs/common';

import { PagarmeService } from './pagarme.service';

@Module({
  imports: [],
  providers: [PagarmeService],
  exports: [PagarmeService],
})
export class PagarmeModule {}
