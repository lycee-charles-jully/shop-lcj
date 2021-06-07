import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { OrderConfirmationDataEntity } from './entity/order-confirmation-data.entity';


@Injectable()
export class EmailService {

    constructor() {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    }

    sentOrderConfirmationEmail(to: string, data: OrderConfirmationDataEntity) {
        return sgMail.send({
            to,
            from: 'noreply@shop-lcj.fr', // Change to your verified sender
            templateId: 'd-7247863d60e0403d983cba7fff9d8fa4',
            dynamicTemplateData: data,
        })
            .then(() => ({ success: true, error: null }))
            .catch(err => {
                console.error(err);
                throw new InternalServerErrorException('Cannot send the confirmation email');
            });
    }
}
