/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Alert.
 */
@Entity('alerts')
export class Alert extends BaseEntity {
    @Column({ type: 'datetime', name: 'hw_timestamp', nullable: true })
    hwTimestamp: any;

    @Column({ type: 'datetime', name: 'wb_timestamp', nullable: true })
    wbTimestamp: any;

    @Column({ type: 'text', name: 'extra_info_value', nullable: true })
    extraInfoValue: string;

    @Column({ type: 'text', name: 'lat', nullable: true })
    lat: string;
    
    @Column({ type: 'text', name: 'lng', nullable: true })
    lng: string;

    @Index('alerts_status_index')
    @Column({ type: 'tinyint', width: 1, name: 'status', nullable: true })
    status: number;

    @Column({ type: 'boolean', name: 'retry', nullable: true })
    retry: Boolean;
    
    @Column({ type: 'datetime', name: 'received_at', nullable: true })
    receivedAt: any;

    @Index('alerts_vehicle_identifier_index')
    @Column({ length: 17, name: 'vehicle_identifier', nullable: true })
    vehicleIdentifier: string;

    @Column({ type: 'text', name: 'group_id', nullable: true })
    groupId: string;

    @Column({ type: 'text', name: 'imei', nullable: true })
    imei: string;

    @Column({ type: 'text', name: 'type_id', nullable: true })
    typeId: string;

    @Column({ type: 'text', name: 'uuid', nullable: true })
    uuid: string;
}
