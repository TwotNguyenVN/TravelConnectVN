import { Module, Global, forwardRef } from '@nestjs/common';
import { MailService } from './mail.service';
import { BullModule } from '@nestjs/bullmq';
import { MailProcessor } from './mail.processor';
import { PaymentsModule } from '../payments/payments.module';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mailQueue',
    }),
    forwardRef(() => PaymentsModule),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService, BullModule],
})
export class MailModule {}
