/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Body,
    Param,
    Post,
    UseGuards,
    Controller,
    Get,
    Logger,
    Req,
    UseInterceptors,
    ClassSerializerInterceptor,
    BadRequestException,
    UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AuthGuard, SameUserGuard } from '../../security';
import { PasswordChangeDTO } from '../../service/dto/password-change.dto';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { HeaderUtil } from '../../client/header-util';
import { ApiBearerAuth, ApiConsumes, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AccountService } from '../../service/account.service';
import { AuthService } from '../../service/auth.service';
import { CompanyService } from '../../service/company.service';
import { SmsService } from '../../service/sms.service';
import { AccountDTO } from '../../service/dto/account.dto';
import { AccountCreateDTO } from '../../service/dto/account-create.dto';
import { PasswordChangeWithTokenDTO } from '../../service/dto/password-change-with-token.dto';
import { EmailValidationDTO } from '../../service/dto/email-validation.dto';
import { PhoneValidationDTO } from '../../service/dto/phone-validation.dto';

@Controller('v2')
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiUseTags('account-resource')
export class AccountController {
    logger = new Logger('AccountController');

    constructor(
        private readonly accountService: AccountService, 
        private readonly authService: AuthService, 
        private readonly smsService: SmsService,
        private readonly companyService: CompanyService
    ) { }

    @Post('/register')
    @ApiOperation({ title: 'Create account' })
    @ApiResponse({
      status: 201,
      description: 'The record has been successfully created.',
      type: AccountDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
      FileFieldsInterceptor([
        { name: 'profileImage', maxCount: 1 },
        { name: 'cnhImage', maxCount: 1 },
        { name: 'proofOfResidenceImage', maxCount: 1 },
      ]),
    )
    async registerAccount(
        @UploadedFiles() files: { 
            profileImage?: Express.Multer.File[]; 
            cnhImage?: Express.Multer.File[]; 
            proofOfResidenceImage?: Express.Multer.File[]; 
        },
        @Req() req: Request,
        @Body() accountDTO: AccountCreateDTO,
    ): Promise<AccountDTO> {
        const created = await this.accountService.appCreate(
            { 
                profileImage: files?.profileImage?.[0], 
                cnhImage: files?.cnhImage?.[0],
                proofOfResidenceImage: files?.proofOfResidenceImage?.[0],
            },
            accountDTO,
            +req.query.companyID,
            +req.query.contractID,
        );
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Account', created.id);
        return created;
    }

    @Get('/authenticate')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ title: 'Check if the user is authenticated' })
    @ApiResponse({ status: 200, description: 'login authenticated', })
    isAuthenticated(@Req() req: Request): any {
        const user: any = req.user;
        return user.email;
    }

    @Post('/isSameAccount')
    @UseGuards(AuthGuard, SameUserGuard)
    @ApiOperation({ title: 'Get the current user based on body data.' })
    @ApiResponse({ status: 200, description: 'user retrieved', })
    async getIsSameAccount(@Req() req: Request): Promise<AccountDTO> {
        const user: any = req.user;
        const userProfileFound = await this.authService.getAccount(user.id);
        return userProfileFound;
    }

    @Get('/account')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ title: 'Get the current user.' })
    @ApiResponse({
        status: 200,
        description: 'user retrieved',
    })
    async getAccount(@Req() req: Request): Promise<any> {
        const user: any = req.user;
        const userProfileFound = await this.authService.getAccount(user.id);
        return userProfileFound;
    }

    @Post('/account')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ title: 'Update the current user information' })
    @ApiResponse({ status: 201, description: 'user info updated', type: AccountDTO, })
    async saveAccount(@Req() req: Request, @Body() newUserInfo: AccountDTO): Promise<any> {
        const user: any = req.user;
        return await this.authService.updateUserSettings(user.login, newUserInfo);
    }

    @Post('/account/changePassword')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ title: 'Change current password' })
    @ApiResponse({ status: 201, description: 'user password changed', type: PasswordChangeDTO, })
    async changePassword(@Req() req: Request, @Body() passwordChange: PasswordChangeDTO): Promise<any> {
        return await this.authService.changePassword(passwordChange, this.getToken(req));
    }

    @Post('/account/forgotPassword/:email')
    @ApiOperation({ title: 'Send a sms to reset the password of the user' })
    @ApiResponse({ status: 200, description: 'forgot password started', })
    async forgotPassword(@Req() req: Request, @Param('email') email: string): Promise<any> {
        await this.authService.forgotPassword(email);
    }

    @Post('/account/changePasswordWithToken')
    @ApiOperation({ title: 'Send an email or sms to reset the password of the user' })
    @ApiResponse({ status: 200, description: 'forgot password started', })
    async changePasswordWithToken(
        @Req() req: Request,
        @Body() passwordChange: PasswordChangeWithTokenDTO,
    ): Promise<any> {
        await this.authService.changePasswordWithToken(passwordChange);
    }

    @Post('/accounts/phoneValidation')
    @ApiOperation({ title: 'Send an SMS to validate the user phone number' })
    @ApiResponse({ status: 200, description: 'SMS sent' })
    async validateUserPhone(@Req() req: Request, @Body() body: PhoneValidationDTO): Promise<any> {
        const { phoneNumber } = body;
        const sanitizedPhoneNumber = phoneNumber.replace(/[^0-9]/g, '')
        const userWithSentPhoneNumber = await this.authService.findUserByPhoneNumber(sanitizedPhoneNumber);

        if (userWithSentPhoneNumber?.id) throw new BadRequestException(`User with this phone number already exists`);

        const company = await this.companyService.findById(+req.query.companyID);

        return this.smsService.sendPhoneValidationSms(sanitizedPhoneNumber, company);
    }

    @Post('/accounts/emailValidation')
    @ApiOperation({ title: 'Validate if the sent email already exists' })
    @ApiResponse({ status: 400, description: 'Email already exists' })
    async validateUserEmail(@Req() req: Request, @Body() body: EmailValidationDTO): Promise<any> {
        const { email } = body;
        const userWithSentEmail = await this.authService.findUserByEmail(email);

        if (userWithSentEmail?.id) throw new BadRequestException(`User with this email already exists`);
    }

    private getToken(req: Request): string {
        return this.authService.getTokenFromRequest(req);
    }
}
