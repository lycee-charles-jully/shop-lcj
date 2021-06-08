import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { OrderConfirmationDataEntity } from './entity/order-confirmation-data.entity';


@Injectable()
export class EmailService {

    constructor() {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    }

    sentOrderConfirmationEmail(to: string, data: OrderConfirmationDataEntity) {
        return this.sendEmail(
            'd-7247863d60e0403d983cba7fff9d8fa4',
            to,
            data,
            `Cannot send the order confirmation email`,
        );
    }


    private sendEmail(templateId: string, to: string, data: any, errorMsg?: string) {
        return sgMail.send({
            to,
            from: 'noreply@shop-lcj.fr',
            templateId,
            dynamicTemplateData: data,
        })
            .then(() => ({ success: true, error: null }))
            .catch(err => {
                console.error(`Cannot send the email with the template ${templateId} to ${to}`, err);
                throw new InternalServerErrorException(errorMsg || 'Cannot send the email');
            });
    }
}
