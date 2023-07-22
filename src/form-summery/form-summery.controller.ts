import { Controller } from '@nestjs/common';
import { FormSummeryService } from './form-summery.service';

@Controller('form-summery')
export class FormSummeryController {
    constructor(private readonly companyService: FormSummeryService) {}
}
