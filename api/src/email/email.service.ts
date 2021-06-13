import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { AccountConfirmationDataEntity } from './entity/account-confirmation-data.entity';
import { OrderConfirmationDataEntity } from './entity/order-confirmation-data.entity';
import { OrderCompletedDataEntity } from './entity/order-completed-data.entity';


@Injectable()
export class EmailService {

    constructor() {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    }

    sendAccountConfirmationEmail(to: string, data: AccountConfirmationDataEntity) {
        return this.sendEmail(
            'd-f5397bf204f040a9a408694bbd348595',
            to,
            data,
            'Cannot send the account confirmation email',
        );
    }

    sentOrderConfirmationEmail(to: string, data: OrderConfirmationDataEntity) {
        return this.sendEmail(
            'd-7247863d60e0403d983cba7fff9d8fa4',
            to,
            data,
            `Cannot send the order confirmation email`,
        );
    }

    sentOrderCompletedEmail(to: string, data: OrderCompletedDataEntity) {
        return this.sendEmail(
            'd-c671d986b5df40a3bf833f70b4d8467f',
            to,
            data,
            `Cannot send the order completed email`,
        );
    }


    private sendEmail(templateId: string, to: string, data: any, errorMsg?: string) {
        if (process.env.NODE_ENV === 'production')
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
        else
            return { success: true, error: null };
    }
}
