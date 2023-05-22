/* eslint-disable @typescript-eslint/no-unused-vars */
import { Type } from 'class-transformer';
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Contract } from './contract.entity';
import { LocationType } from './enumeration/location-type';
import { OpenningHours } from './openning-hours.entity';

/**
 * A Location.
 */
@Entity('locations')
export class Location extends BaseEntity {
    @Column({ name: 'description', length: 512, nullable: true })
    @Index('location_description_index')
    description: string;

    @Column({ name: 'address', type: 'text', nullable: false })
    address: string;

    @Column({ type: 'double', name: 'latitude', nullable: true })
    latitude: number;

    @Column({ type: 'double', name: 'longitude', nullable: true })
    longitude: number;

    @Column({ type: 'integer', name: 'radius_m', nullable: true })
    radiusM: number;

    @Column({ type: 'enum', name: 'type', nullable: true, enum: LocationType })
    @Index('location_type_index')
    type: LocationType;

    @Column({ name: 'icon', type: 'text', nullable: true })
    icon: string;

    @Column({ name: 'timezone', type: 'text', nullable: true })
    timezone: string;

    @ManyToOne(type => Contract)
    @JoinColumn({ name: 'contract_id' })
    contract: Contract;

    @Column({ type: 'json', name: 'openingHoursMonday', nullable: true })
    @Type(()=> OpenningHours)
    openingHoursMonday: OpenningHours;
    @Column({ type: 'json', name: 'openingHoursTuesday', nullable: true })
    @Type(()=> OpenningHours)
    openingHoursTuesday: OpenningHours;
    @Column({ type: 'json', name: 'openingHoursWednesday', nullable: true })
    @Type(()=> OpenningHours)
    openingHoursWednesday: OpenningHours;
    @Column({ type: 'json', name: 'openingHoursThursday', nullable: true })
    @Type(()=> OpenningHours)
    openingHoursThursday: OpenningHours;
    @Column({ type: 'json', name: 'openingHoursFriday', nullable: true })
    @Type(()=> OpenningHours)
    openingHoursFriday: OpenningHours;
    @Column({ type: 'json', name: 'openingHoursSaturday', nullable: true })
    @Type(()=> OpenningHours)
    openingHoursSaturday: OpenningHours;
    @Column({ type: 'json', name: 'openingHoursSunday', nullable: true })
    @Type(()=> OpenningHours)
    openingHoursSunday: OpenningHours;

    vehiclesCount: number;
}
