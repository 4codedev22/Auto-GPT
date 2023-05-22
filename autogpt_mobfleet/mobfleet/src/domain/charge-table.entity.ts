/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';


import { VehicleGroup } from './vehicle-group.entity';
import { Contract } from './contract.entity';
import { ChargeUnit } from './enumeration/charge-unit';
import { ChargeCondition } from './charge-condition.entity';


/**
 * A ChargeTable.
 */
@Entity('charges_tables')
export class ChargeTable extends BaseEntity {


    @Column({ name: "name", length: 255 })
    name: string;


    @Column({ name: "currency", length: 10 })
    currency: string;


    @Column({ type: 'integer', name: "initial_charge_cents", default: 0 })
    initialChargeCents: number;


    @Column({ type: 'integer', name: "deposit_cents", default: 0 })
    depositCents: number;


    @Column({ type: 'integer', name: "fuel_price_cents", default: 0 })
    fuelPriceCents: number;


    @Column({ type: 'integer', name: "fuel_tolerance", default: 0  })
    fuelTolerance: number;


    @Column({ type: 'integer', name: "odometer_price_cents", default: 0  })
    odometerPriceCents: number;


    @Column({ type: 'timestamp', name: "start_at" })
    startAt: any;


    @Column({ type: 'datetime', name: "end_at" })
    endAt: any;

    @Column({ type: 'simple-enum', name: 'charge_unit', enum: ChargeUnit })
    chargeUnit: ChargeUnit;

    @ManyToOne(type => VehicleGroup)
    @JoinColumn({ name: 'vehicle_group_id' })
    vehicleGroup: VehicleGroup;

    @ManyToOne(type => Contract)
    @JoinColumn({ name: 'contract_id' })
    contract: Contract;

    @OneToMany(
        type => ChargeCondition,
        other => other.chargeTable,
        { cascade: true }
    )
    chargeConditions: ChargeCondition[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
