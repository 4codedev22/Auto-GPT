import { Injectable, HttpException, HttpStatus, Logger, NotFoundException, forwardRef, Inject, BadRequestException, CACHE_MANAGER } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { Cache } from 'cache-manager';

import { ConfigDTO } from '../service/dto/config.dto';
import { ConfigCreateOrUpdateDTO } from './dto/config-create-or-update.dto';

import { ConfigMapper } from '../service/mapper/config.mapper';
import { ConfigRepository } from '../repository/config.repository';
import { ContractService } from './contract.service';
import { Config } from '../domain/config.entity';
import { ContractDTO } from './dto/contract.dto';
import { UploadService } from '../module/shared/upload.service';
import { cacheConfigFunctions } from './decorators';

const relationshipNames = [];
const PREFIX_COMPANY_CACHE = 'getCompanyConfigs';
const PREFIX_CONTRACT_CACHE = 'getContractConfigs';

const DefaultConfig = () => ({
    'alerts.vehicle_devolution_with_unlocked_door': 'true',
    'alerts.vehicle_12v_battery_low': 'true',
    'alerts.vehicle_12v_battery_level_min': '11',
    'alerts.vehicle_available_fuel_low': 'true',
    'alerts.vehicle_fuel_level_min': '50',
    'alerts.vehicle_battery_level_min': '50',
    'alerts.vehicle_maintenance_with_reservation': 'true',
    'alerts.vehicle_maintenance_with_reservation_time_before_hours': '24',
    'alerts.vehicle_periodic_revision': 'true',
    'alerts.vehicle_moviment_without_reservation': 'true',

    'checklist.item_1_group': 'itens no carro',
    'checklist.item_1_title': 'possui documento?',
    'checklist.item_2_group': 'itens no carro',
    'checklist.item_2_title': 'possui triangulo?',
    'checklist.item_3_group': 'itens no carro',
    'checklist.item_3_title': 'painel resetado?',
    'checklist.item_4_group': 'situação de limpeza',
    'checklist.item_4_title': 'interior limpo?',
    'checklist.item_5_group': 'situação de limpeza',
    'checklist.item_5_title': 'exterior limpo?',
    'checklist.item_6_group': 'ações tomadas',
    'checklist.item_6_title': 'limpeza externa',
    'checklist.item_7_group': 'ações tomadas',
    'checklist.item_7_title': 'limpeza interna',
    'checklist.item_8_group': 'ações tomadas',
    'checklist.item_8_title': 'levado para lavar',
    'checklist.item_9_group': 'calibragem de pneus',
    'checklist.item_9_title': 'realizado?',
    'checklist.item_10_group': 'encontrou algum objeto?',
    'checklist.item_10_title': 'resposta',
    'checklist.item_11_group': '',
    'checklist.item_11_title': '',
    'checklist.item_12_group': '',
    'checklist.item_12_title': '',
    'checklist.item_13_group': '',
    'checklist.item_13_title': '',
    'checklist.item_14_group': '',
    'checklist.item_14_title': '',
    'checklist.item_15_group': '',
    'checklist.item_15_title': '',

    'documents.cnh.notify_expiration': 'false',
    'documents.cnh.expiration.periodic_validation_days': '7',
    'documents.cnh.expiration.time_before_expiration_days': '30',
    'documents.cnh.expiration.block_user_after_days': '30',
    'documents.bureau.active': 'true',
    'documents.bureau.automatic_approval_percent': '70',

    'email_notification.welcome': 'false',
    'email_notification.reservation_created_successfuly': 'false',
    'email_notification.reservation_cancelled': 'false',
    'email_notification.reservation_finished': 'false',

    'layout.logo': 'svg_link',
    'layout.primary_color': '#ffffff',
    'layout.secondary_color': '#ffffff',
    'layout.background_color': '#ffffff',
    'layout.background_image': 'img_link',
    'layout.location_images.0': 'svg_links',
    'layout.location_images.1': 'svg_links',

    'phone_notification.reservation_can_be_started': 'false',
    'phone_notification.reservation_start_delay': 'false',
    'phone_notification.reservation_start_delay_time_after': '0',
    'phone_notification.reservation_start_delay_time_between_next_notification': '0',
    'phone_notification.reservation_cancelled': 'false',
    'phone_notification.reservation_devolution_delay': 'false',
    'phone_notification.reservation_devolution_delay_time_after': '0',
    'phone_notification.reservation_devolution_delay_time_between_next_notification': '0',
    'phone_notification.reservation_near_devolution': 'false',
    'phone_notification.reservation_near_devolution_time_before': '0',
    'phone_notification.reservation_vehicle_change_or_cancellation': 'false',

    'phone_validation.sms_enabled': 'true',
    'phone_validation.sms_max_retries': '2',
    'phone_validation.whats_app_enabled': 'false',

    'registration.choose_contract_enabled': 'false',
    'registration.proof_of_residence_required': 'false',
    'registration.signature_required': 'true',

    'reservations.devolution.origin': 'true',
    'reservations.devolution.any_origin': 'false',
    'reservations.devolution.block_button_visible': 'true',
    'reservations.devolution.offline_enabled': 'true',
    'reservations.destination.hotspot': 'true',
    'reservations.destination.any_place': 'false',
    'reservations.enable_multiple_active': 'true',
    'reservations.max_duration_hours': '0',
    'reservations.antecipation_to_start_minutes': '30',
    'reservations.antecipation_to_new_minutes': '30',
    'reservations.automatic_cancelation_minutes': '0',
    'reservations.automatic_vehicle_change_or_cancellation_enabled': 'false',
    'reservations.automatic_vehicle_change_or_cancellation_first_attempt_minutes': '0',
    'reservations.automatic_vehicle_change_or_cancellation_second_attempt_minutes': '0',

    'rides.active': 'true',
    'rides.availiable_reservations_min_advance_minutes': '30',
    'rides.suggestions.origin_distance_max': '2000',
    'rides.suggestions.destination_distance_max': '2000',
    'rides.suggestions.difference_between_start_time_max_hours': '24',

    'vehicles.dynamic_hotspot_association_enabled': 'true',

    'vehicle_damages.ask_for_report_before_start': 'true',
    'vehicle_damages.ask_for_report_before_end': 'true',
    'vehicle_damages.change_status_to_mantainance': 'false',

    'vehicle_maintenance.battery_level_min': '0',
    'vehicle_maintenance.fuel_level_min': '0',
    'vehicle_maintenance.odometer_interval': '0',
    'vehicle_maintenance.odometer_tolerance': '0',
    'vehicle_maintenance.initial_odometer': '0',

    updated_at: null,
});

@Injectable()
export class ConfigService {
    logger = new Logger('ConfigService');

    constructor(
        @InjectRepository(ConfigRepository) private configRepository: ConfigRepository,
        @Inject(forwardRef(() => ContractService))
        private readonly contractService: ContractService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @Inject(forwardRef(() => UploadService))
        private readonly uploadService: UploadService,
    ) { }

    @cacheConfigFunctions(PREFIX_COMPANY_CACHE)
    async findByCompany(id: number): Promise<any> {
        const config = DefaultConfig();
        const options = { where: { companyId: id, contractId: null }, limit: 99999 };
        const result = await this.configRepository.find(options);
        let latestUpdatedAt = result?.[0]?.updatedAt;

        result.forEach((item) => { 
            config[item.name] = item.value;

            if (item?.updatedAt > latestUpdatedAt) {
              latestUpdatedAt = item.updatedAt;
            }
        });

        config.updated_at = latestUpdatedAt;

        return config;
    }

    @cacheConfigFunctions(PREFIX_CONTRACT_CACHE)
    async findByContract(id: number): Promise<any> {
        const contract = await this.contractService.findByFields({ where: { id, }, relations: ['company'] });
        if(!contract) throw new NotFoundException('Contrato não encontrado');
        const config = await this.findByCompany(+contract.company?.id);

        const options = { where: { contractId: id }, limit: 99999 };
        const result = await this.configRepository.find(options);
        let latestUpdatedAt = result?.[0]?.updatedAt;

        result.forEach((item) => { 
            config[item.name] = item.value;

            if (item?.updatedAt > latestUpdatedAt) {
              latestUpdatedAt = item.updatedAt;
            }
        });

        config.payment_enabled = contract.company.paymentEnabled;
        config.updated_at = latestUpdatedAt;

        return config;
    }

    async createOrUpdateMultiple(createOrUpdateDTO: ConfigCreateOrUpdateDTO, creator?: string): Promise<any> {
        const contract = await this.contractService.findByFields({ where: { id: createOrUpdateDTO.contractId, }, relations: ['company'] });
        if(!contract) throw new NotFoundException('Contrato não encontrado');

        const configKeys = Object.keys(createOrUpdateDTO.configs);
        const promises = [];
        for(const configName of configKeys) {
            promises.push(this.createOrUpdate(configName, createOrUpdateDTO.configs[configName], contract, creator));
        }

        return Promise.all(promises);
    }

    async createOrUpdate(key:string, value:string, contract:ContractDTO, creator?: string): Promise<ConfigDTO> {
        const config = await this.configRepository.findOne({ where: { contractId: contract.id, name: key } });
        let result;
        if(config) {
            config.value = value;
            config.lastModifiedBy = creator;
            result = await this.configRepository.save(config);
        }else{
            const newConfig = new Config();
            newConfig.name = key;
            newConfig.value = value;
            newConfig.contractId = contract.id;
            newConfig.companyId = contract.company.id;
            newConfig.lastModifiedBy = creator;
            result = await this.configRepository.save(newConfig);
        }

        this.cacheManager.del(`${PREFIX_CONTRACT_CACHE}_${contract.id}`);
        this.cacheManager.del(`${PREFIX_COMPANY_CACHE}_${contract?.company?.id}`);

        return ConfigMapper.fromDTOtoEntity(result);
    }



    async findById(id: number): Promise<ConfigDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.configRepository.findOne(id, options);
        return ConfigMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<ConfigDTO>): Promise<ConfigDTO | undefined> {
        const result = await this.configRepository.findOne(options);
        return ConfigMapper.fromEntityToDTO(result);
    }

    async findByNameAndContract(name: string, contractId: number, returnDefault = true): Promise<string | undefined> {
        const options = { where: { name, contractId } };
        const result = await this.configRepository.findOne(options);
        const defaultValue = DefaultConfig()[name];
    
        if (result?.value) return result.value;
        if (returnDefault) return defaultValue;

        return;
    }

    async findByNameAndCompany(name: string, companyId: number, returnDefault = true): Promise<string | undefined> {
        const options = { where: { name, companyId } };
        const result = await this.configRepository.findOne(options);
        const defaultValue = DefaultConfig()[name];
    
        if (result?.value) return result.value;
        if (returnDefault) return defaultValue;

        return;
    }

    async findAndCount(options: FindManyOptions<ConfigDTO>): Promise<[ConfigDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.configRepository.findAndCount(options);
        const configDTO: ConfigDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(config => configDTO.push(ConfigMapper.fromEntityToDTO(config)));
            resultList[0] = configDTO;
        }
        return resultList;
    }

    async save(configDTO: ConfigDTO, creator?: string): Promise<ConfigDTO | undefined> {
        const entity = ConfigMapper.fromDTOtoEntity(configDTO);
        if (creator) {
            entity.lastModifiedBy = creator;
        }
        const result = await this.configRepository.save(entity);
        return ConfigMapper.fromEntityToDTO(result);
    }

    async update(configDTO: ConfigDTO, updater?: string): Promise<ConfigDTO | undefined> {
        const entity = ConfigMapper.fromDTOtoEntity(configDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.configRepository.save(entity);
        return ConfigMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.configRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }

    async updateConfigFiles (contractId: string, files: any, creator?: string): Promise<any> {
        const contract = await this.contractService.findByFields({ where: { id: contractId }, relations: ['company'] });
        if(!contract) throw new NotFoundException('Contrato não encontrado');

        const configKeys = Object.keys(files);

        const uploadPromises = configKeys.map(key =>
            files[key]?.map?.(async file => {
                const { originalname, buffer } = file || {};
                let updatedFile = null;
    
                if (!buffer) {
                    return {
                        key,
                        value: null,
                    }
                }
    
                try {
                    updatedFile = await this.uploadService.uploadFile(buffer, originalname);
                } catch (error) {
                    this.logger.debug(error, key);
                }
    
                return {
                    key: key.replace('[]', ''),
                    value: updatedFile?.Location,
                }
            })
        );

        const uploadResults = await Promise.all(uploadPromises.map(files => Promise.all(files)));

        const promises = uploadResults.map(async (results) => {
            if (results?.length === 1) {
                const { key, value } = results[0];
                if (value) {
                    return await this.createOrUpdate(key, value, contract, creator);
                }
                return;
            }

            return results?.map(async (result, index) => {
                const { key, value } = result;
                if (value) {
                    return await this.createOrUpdate(`${key}.${index}`, value, contract, creator);
                }
            })
        });

        return Promise.all(promises);
      };
  
}
