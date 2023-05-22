/**
 * The ChargeUnit enumeration.
 */
export enum ChargeUnit {
      MINUTES = 'MINUTES',
      HOURS = 'HOURS',
      DAYS = 'DAYS',
}

const Units = {
      [ChargeUnit.MINUTES]: 60,
      [ChargeUnit.HOURS]: 3600,
      [ChargeUnit.DAYS]: 86400,
};

export const SecondsToUnit = (seconds: number, unit: ChargeUnit) => {
      return Math.ceil(seconds / Units[unit]);
}
