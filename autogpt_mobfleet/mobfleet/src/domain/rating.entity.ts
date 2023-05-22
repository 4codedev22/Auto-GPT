/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Reservation } from './reservation.entity';
import { Vehicle } from './vehicle.entity';

/**
 * A Rating.
 */
@Entity('ratings')
export class Rating extends BaseEntity {
    @Column({ type: 'float', name: 'value', nullable: true })
    value: number;

    @Column({ name: 'message', type: 'text', nullable: true })
    message: string;

    @ManyToOne(type => Reservation)
    @JoinColumn({ name: 'reservation_id' })
    reservation: Reservation;

    @ManyToOne(type => Vehicle)
    @JoinColumn({ name: 'vehicle_id' })
    vehicle: Vehicle;
}
