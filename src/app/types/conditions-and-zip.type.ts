import {CurrentConditions} from './current-conditions.type';

export interface ConditionsExtended {
    zip: string;
    data: CurrentConditions;
    label: string;
}
