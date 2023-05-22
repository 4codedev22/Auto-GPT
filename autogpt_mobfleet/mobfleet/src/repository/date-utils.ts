import { set } from "date-fns";




export const removeTz = (date) => {
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - userTimezoneOffset);
};

export const firstHour = date => set(date, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
export const lastHour = date => set(date, { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 });

export const DB_DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss.SSS';
