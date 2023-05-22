/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';


import { ChargeTable } from './charge-table.entity';


/**
 * A ChargeCondition.
 */
@Entity('charges_conditions')
export class ChargeCondition extends BaseEntity {


    @Column({ type: 'integer', name: "execute_charge_from" })
    executeChargeFrom: number;


    @Column({ type: 'integer', name: "execute_charge_to" })
    executeChargeTo: number;


    @Column({ type: 'integer', name: "charge_value_cents" })
    chargeValueCents: number;


    @Column({ type: 'integer', name: "min_charge_unit" })
    minChargeUnit: number;


    @Column({ type: 'integer', name: "additional_charge_unit" })
    additionalChargeUnit: number;


    @ManyToOne(type => ChargeTable)
    @JoinColumn({ name: 'charge_table_id' })
    chargeTable: ChargeTable;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
