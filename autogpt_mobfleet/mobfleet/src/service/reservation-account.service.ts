import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ReservationAccountDTO } from './dto/reservation-account.dto';
import { ReservationAccountMapper } from './mapper/reservation-account.mapper';
import { ReservationAccountRepository } from '../repository/reservation-account.repository';

const relationshipNames = [];
relationshipNames.push('account');
relationshipNames.push('reservation');

@Injectable()
export class ReservationAccountService {
    logger = new Logger('ReservationAccountService');

    constructor(
        @InjectRepository(ReservationAccountRepository)
        private reservationAccountRepository: ReservationAccountRepository,
    ) {}

    async findById(id: number): Promise<ReservationAccountDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.reservationAccountRepository.findOne(id, options);
        return ReservationAccountMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<ReservationAccountDTO>): Promise<ReservationAccountDTO | undefined> {
        const result = await this.reservationAccountRepository.findOne(options);
        return ReservationAccountMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<ReservationAccountDTO>): Promise<[ReservationAccountDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.reservationAccountRepository.findAndCount(options);
        const reservationAccountDTO: ReservationAccountDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(reservationAccount =>
                reservationAccountDTO.push(ReservationAccountMapper.fromEntityToDTO(reservationAccount)),
            );
        }
        return [reservationAccountDTO, resultList[1]];
    }

    async save(
        reservationAccountDTO: ReservationAccountDTO,
        creator?: string,
    ): Promise<ReservationAccountDTO | undefined> {
        const entity = ReservationAccountMapper.fromDTOtoEntity(reservationAccountDTO);
        if (creator) {
            entity.lastModifiedBy = creator;
        }
        const result = await this.reservationAccountRepository.save(entity);
        return ReservationAccountMapper.fromEntityToDTO(result);
    }

    async update(
        reservationAccountDTO: ReservationAccountDTO,
        updater?: string,
    ): Promise<ReservationAccountDTO | undefined> {
        const entity = ReservationAccountMapper.fromDTOtoEntity(reservationAccountDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.reservationAccountRepository.save(entity);
        return ReservationAccountMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.reservationAccountRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
