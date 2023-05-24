import { Injectable, HttpException, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, OrderByCondition } from 'typeorm';
import { VehicleModelDTO } from './dto/vehicle-model.dto';
import { VehicleModelMapper } from './mapper/vehicle-model.mapper';
import { VehicleModelRepository } from '../repository/vehicle-model.repository';
import { AccountDTO } from './dto/account.dto';
import { VehicleManufacturerService } from './vehicle-manufacturer.service';
import { VehicleModelCreateDTO } from './dto/vehicle-model-create.dto';
import { UploadService } from '../module/shared/upload.service';
import { VehicleModelUpdateDTO } from './dto/vehicle-model-update.dto';

const relationshipNames = [];
relationshipNames.push('vehicleManufacturer');

@Injectable()
export class VehicleModelService {
  logger = new Logger('VehicleModelService');

  constructor(
    @InjectRepository(VehicleModelRepository) private vehicleModelRepository: VehicleModelRepository,
    private vehicleManufacturerService: VehicleManufacturerService,
    private uploadService: UploadService
  ) { }

  async findById(id: number): Promise<VehicleModelDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.vehicleModelRepository.findOne(id, options);
    return VehicleModelMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<VehicleModelDTO>): Promise<VehicleModelDTO | undefined> {
    const result = await this.vehicleModelRepository.findOne(options);
    return VehicleModelMapper.fromEntityToDTO(result);
  }

  async findAndCount(
    options: FindManyOptions<VehicleModelDTO>,
    search?: string,
    filter?: any,
  ): Promise<[VehicleModelDTO[], number]> {
    let qb = this.vehicleModelRepository.createQueryBuilder('vehicleModel');

    if (search) {
      qb = qb.andWhere('vehicleModel.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    qb = qb
      .leftJoinAndSelect('vehicleModel.vehicleManufacturer', 'vehicleManufacturer')
      .skip(options.skip)
      .take(options.take)
      .orderBy(options.order as OrderByCondition);

    const resultList = await qb.getManyAndCount();
    const vehicleModelDTO: VehicleModelDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(vehicleModel =>
        vehicleModelDTO.push(VehicleModelMapper.fromEntityToDTO(vehicleModel)),
      );
      resultList[0] = vehicleModelDTO;
    }
    return [vehicleModelDTO, resultList[1]];
  }



  async findAll(): Promise<VehicleModelDTO[]> {
    let qb = this.vehicleModelRepository.createQueryBuilder('vehicleModel');

    qb = qb
      .leftJoinAndSelect('vehicleModel.vehicleManufacturer', 'vehicleManufacturer')
      .orderBy('vehicleModel.name', 'ASC');
    const resultList = await qb.getMany();
    return resultList?.map(vehicleModel => VehicleModelMapper.fromEntityToDTO(vehicleModel));
  }






  async save(vehicleModelDTO: VehicleModelDTO, creator?: string): Promise<VehicleModelDTO | undefined> {
    const entity = VehicleModelMapper.fromDTOtoEntity(vehicleModelDTO);
    if (creator) {
      entity.lastModifiedBy = creator;
    }
    const result = await this.vehicleModelRepository.save(entity);
    return VehicleModelMapper.fromEntityToDTO(result);
  }


  async createWithFiles(
    files: { photos?: Express.Multer.File[] },
    vehicleModelDTO: VehicleModelCreateDTO,
    contractID: number,
    creator: AccountDTO
  ): Promise<VehicleModelDTO | undefined> {
    const vehicleModel = VehicleModelMapper.fromCreateDTOtoEntity(vehicleModelDTO);
    if (files?.photos?.length) {
      try {
        const data = await Promise.all(
          await files.photos.map(
            async f => await this.uploadService.uploadFile(f.buffer, f.originalname),
          ),
        );
        vehicleModel.photos = data.map(d => d.Location);
      } catch (error) {
        this.logger.debug(error, 'create-vehicle-model');
      }
    }
    if (vehicleModelDTO.vehicleManufacturer) {
      vehicleModel.vehicleManufacturer = await this.vehicleManufacturerService.findById(+vehicleModelDTO.vehicleManufacturer);
    }
    if (creator) {
      vehicleModel.lastModifiedBy = creator.email;
    }
    const result = await this.vehicleModelRepository.save(vehicleModel);
    return VehicleModelMapper.fromEntityToDTO(result);
  }



  async updateWithFiles(
    id: number,
    files: { photos?: Express.Multer.File[] },
    vehicleModel: VehicleModelUpdateDTO,
    contractID: number,
    creator: AccountDTO
  ): Promise<VehicleModelDTO | undefined> {
    const entity = await this.vehicleModelRepository.findOne(id);
    if (!entity?.id) {
      throw new NotFoundException('cannot find vehicle model');
    }
    if (files?.photos?.length) {
      try {
        const data = await Promise.all(
          await files.photos.map(
            async f => await this.uploadService.uploadFile(f.buffer, f.originalname),
          ),
        );
        entity.photos = data.map(d => d.Location);
      } catch (error) {
        this.logger.debug(error, 'create-vehicle-model');
      }
    }
    if (+vehicleModel.vehicleManufacturer) {
      entity.vehicleManufacturer = await this.vehicleManufacturerService.findById(+vehicleModel.vehicleManufacturer);
    }
    if (creator) {
      entity.lastModifiedBy = creator.email;
    }

    entity.name = vehicleModel.name ?? entity.name;
    entity.type = vehicleModel.type ?? entity.type;
    entity.maintenanceKm = vehicleModel.maintenanceKm ?? entity.maintenanceKm;
    entity.maintenanceMonths = vehicleModel.maintenanceMonths ?? entity.maintenanceMonths;

    await this.vehicleModelRepository.update(id, entity);
    return VehicleModelMapper.fromEntityToDTO(await this.findById(id));
  }

  async create(
    vehicleModelDTO: VehicleModelCreateDTO,
    creator: AccountDTO,
    contractID: number,
  ): Promise<VehicleModelDTO | undefined> {
    const vehicle = VehicleModelMapper.fromCreateDTOtoEntity(vehicleModelDTO);
    vehicle.vehicleManufacturer = await this.vehicleManufacturerService.findById(
      vehicleModelDTO.vehicleManufacturer,
    );
    if (creator) {
      vehicle.lastModifiedBy = creator.email;
    }
    const result = await this.vehicleModelRepository.save(vehicle);
    return VehicleModelMapper.fromEntityToDTO(result);
  }

  async update(vehicleModelDTO: VehicleModelDTO, updater?: string): Promise<VehicleModelDTO | undefined> {
    const entity = VehicleModelMapper.fromDTOtoEntity(vehicleModelDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.vehicleModelRepository.save(entity);
    return VehicleModelMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.vehicleModelRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
