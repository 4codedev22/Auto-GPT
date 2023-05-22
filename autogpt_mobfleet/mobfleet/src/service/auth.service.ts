import { Injectable, HttpException, HttpStatus, Logger, forwardRef, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDTO } from '../service/dto/user-login.dto';
import { Payload } from '../security/payload.interface';
import * as bcrypt from 'bcryptjs';
import { AccountService } from './account.service';
import { ReservationService } from './reservation.service';
import { FindManyOptions } from 'typeorm';
import { AccountDTO } from './dto/account.dto';
import { PasswordChangeWithTokenDTO } from './dto/password-change-with-token.dto';
import { PasswordChangeDTO } from './dto/password-change.dto';
import { RegisterSituation } from '../domain/enumeration/register-situation';
import { ReservationStatus } from '../domain/enumeration/reservation-status';
import { Request } from 'express';
import { UserIsSameDTO } from './dto/user-is-same.dto';

@Injectable()
export class AuthService {

  logger = new Logger('AuthService');
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => AccountService))
    private accountService: AccountService,
    private reservationService: ReservationService,
    ) {  }

  getTokenFromRequest(req: Request): string {
    return req.headers?.authorization?.replace('Bearer ', '');
  }


  async isSameUser(user: AccountDTO, { username, password, currentContract }: UserIsSameDTO): Promise<boolean> {
    const userLoaded = await this.accountService.findByUsernameAndContractWithPassword(username, currentContract);
    await this.checkPassword(password, userLoaded);
    return !!(userLoaded && userLoaded.id === user.id);
  }

  async login(userLogin: UserLoginDTO): Promise<any> {
    const loginUserName = userLogin.username;
    const loginPassword = userLogin.password;

    const userFind = await this.accountService.findByFields({ where: { email: loginUserName }, select: ['id', 'registerSituation', 'passwordDigest', 'active', 'blocked'] });

    if (!userFind) {
      throw new HttpException({ msg: 'account.error.invalid_credentials' }, HttpStatus.BAD_REQUEST);
    }

    await this.checkPassword(loginPassword, userFind);

    if (userFind) {
      if (!userFind.active) {
        throw new HttpException({ msg: 'account.error.not_activated' }, HttpStatus.BAD_REQUEST);
      }

      if (userFind.blocked) {
        throw new HttpException({ msg: 'account.error.blocked' }, HttpStatus.BAD_REQUEST);
      }

      if (userFind.registerSituation !== RegisterSituation.APPROVED) {
        throw new HttpException({ msg: 'account.error.not_approved' }, HttpStatus.BAD_REQUEST);
      }
    }

    const user = await this.findUserWithAuthById(userFind.id);
    const payload: Payload = {
      data: {
        account_id: user.id,
        username: user.email,
        authorities: user.roles?.map(r => r.name),
        contracts: user.contracts?.map(c => c.id),
      },
    };
    /* eslint-disable */
    return {
      id_token: this.jwtService.sign(payload),
    };
  }

  private async checkPassword(loginPassword: string, userFind: AccountDTO) {
    const validPassword = !!(await bcrypt.compare(loginPassword, userFind?.passwordDigest));
    if (!userFind || !validPassword) {
      throw new HttpException({ msg: 'account.error.invalid_credentials' }, HttpStatus.BAD_REQUEST);
    }
  }

  /* eslint-enable */
  async validateUser(payload: Payload): Promise<AccountDTO | undefined> {
    return await this.findUserWithAuthById(payload.data?.account_id);
  }

  async findUserWithAuthById(userId: number): Promise<AccountDTO | undefined> {
    const accountDTO: AccountDTO = await this.accountService.findByFields({
      where: { id: userId },
      relations: ['roles', 'contracts', 'contracts.company', 'vehicleGroups']
    });

    if (accountDTO) {
      accountDTO.qtyTravels =  await this.reservationService.countByUserAndStatus(userId, ReservationStatus.FINISHED);
    }
    return accountDTO;
  }

  async getAccount(userId: number): Promise<AccountDTO | undefined> {
    const accountDTO: AccountDTO = await this.findUserWithAuthById(userId);
    if (!accountDTO) {
      return;
    }
    return accountDTO;
  }

  async changePassword(passwordChange: PasswordChangeDTO, loginToken: string): Promise<void> {
    await this.accountService.changePassword(passwordChange, loginToken);
  }

  async registerNewUser(newUser: AccountDTO): Promise<AccountDTO> {
    let userFind: AccountDTO = await this.accountService.findByFields({ where: { email: newUser.email } });
    if (userFind) {
      throw new HttpException('Login name already used!', HttpStatus.BAD_REQUEST);
    }
    userFind = await this.accountService.findByFields({ where: { email: newUser.email } });
    if (userFind) {
      throw new HttpException('Email is already in use!', HttpStatus.BAD_REQUEST);
    }
    const user: AccountDTO = await this.accountService.save(newUser, newUser.email, true);
    return user;
  }

  async updateUserSettings(userEmail: string, newUserInfo: AccountDTO): Promise<AccountDTO> {
    const userFind: AccountDTO = await this.accountService.findByFields({ where: { email: userEmail } });
    if (!userFind) {
      throw new HttpException('Invalid login name!', HttpStatus.BAD_REQUEST);
    }
    const userFindEmail: AccountDTO = await this.accountService.findByFields({
      where: { email: newUserInfo.email },
    });
    if (userFindEmail && newUserInfo.email !== userFind.email) {
      throw new HttpException('Email is already in use!', HttpStatus.BAD_REQUEST);
    }

    userFind.name = newUserInfo.name;
    userFind.email = newUserInfo.email;
    userFind.displayLanguage = newUserInfo.displayLanguage;
    await this.accountService.save(userFind, userEmail);
    return;
  }

  async getAllUsers(options: FindManyOptions<AccountDTO>, contractID: number): Promise<[AccountDTO[], number]> {
    return await this.accountService.findAndCount(options, contractID);
  }

  async forgotPassword(email: string): Promise<void> {
    return await this.accountService.forgotPassword(email);
  }

  async changePasswordWithToken(passwordChange: PasswordChangeWithTokenDTO): Promise<void> {
    return await this.accountService.changePasswordWithToken(passwordChange);
  }

  async findUserByPhoneNumber(phoneNumber:string): Promise<AccountDTO> {
    return this.accountService.findByFields({ where: { cellPhone: phoneNumber } });
  }

  async findUserByEmail(email:string): Promise<AccountDTO> {
    return this.accountService.findByFields({ where: { email } });
  }
}
