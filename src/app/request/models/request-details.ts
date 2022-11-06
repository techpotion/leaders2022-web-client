import { I18nString } from './i18n-string';

export interface User {
  name: string;
  organizationRole: string;
}

export interface Deffect {
  name: string;
  shortName: string;
  id: string;
  code: string;
  category: DeffectCategory;
}

export interface DeffectCategory {
  name: I18nString;
  id: string;
}

export interface District {
  name: string;
  code: string;
}

export interface Hood {
  name: string;
  code: string;
}

export interface Address {
  district: District;
  hood: Hood;
  full: string;
  unom: number;
  porch: string;
  floor: string;
  flat: string;
}

export interface PerformingOrganization {
  name: string;
  inn: string;
}

export interface DeclineReason {
  name: string;
  id: string;
}

export interface Work {
  name: string;
  id: string;
  material: string;
}

export interface GuardingEvent {
  name: string;
  id: string;
}

export interface ReturnInfo {
  count: number;
  lastDate: Date | null;
  isReturned: string;
}

export interface Review {
  text: string;
  date: Date | null;
}

export interface Payment {
  type: I18nString;
  byCard: string;
}
