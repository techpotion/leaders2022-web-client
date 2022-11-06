import { I18nString } from './i18n-string';
import { ValueRange } from './range';
import { Address, DeclineReason, Deffect, GuardingEvent, Payment, PerformingOrganization, ReturnInfo, Review, User, Work } from './request-details';

export interface BackendRequest {
  root_id: string;
  version_id: string;
  request_number: string;
  mos_ru_request_number: string;
  date_of_creation: string;
  date_of_start: string;
  name_of_source: string;
  name_of_source_eng: string;
  name_of_creator: string;
  incident_feature: string;
  root_identificator_of_material: string;
  number_of_material: string;
  last_name_redacted: string;
  role_of_user: string;
  commentaries: string;
  deffect_category_name: string;
  defect_category_id: string;
  deffect_category_name_eng: string;
  deffect_name: string;
  short_deffect_name: string;
  deffect_id: string;
  code_of_deffect: string;
  need_for_revision: string;
  description: string;
  presence_of_question: string;
  urgency_category: string;
  urgency_category_eng: string;
  district: string;
  district_code: string;
  hood: string;
  hood_code: string;
  adress_of_problem: string;
  adress_unom: number;
  porch: string;
  floor: string;
  flat_number: string;
  dispetchers_number: string;
  owner_company: string;
  serving_company: string;
  performing_company: string;
  inn_of_performing_company: string;
  request_status: string;
  request_status_eng: string;
  reason_for_decline: string;
  id_of_reason_for_decline: string;
  reason_for_decline_of_org: string;
  id_of_reason_for_decline_of_org: string;
  work_type_done: string;
  id_work_type_done: string;
  used_material: string;
  guarding_events: string;
  id_guarding_events: string;
  efficiency: string;
  efficiency_eng: string;
  times_returned: number;
  date_of_last_return_for_revision: string;
  being_on_revision: string;
  alerted_feature: string;
  closure_date: string;
  wanted_time_from: string;
  wanted_time_to: string;
  date_of_review: string;
  review: string;
  grade_for_service: string;
  grade_for_service_eng: string;
  payment_category: string;
  payment_category_eng: string;
  payed_by_card: string;
  date_of_previous_request_close: string;
}

export interface Request {
  id: string;
  versionId: string;
  number: string;
  mosRuNumber: string;
  creationDate: Date | null;
  startDate: Date | null;
  source: I18nString;
  creator: string;
  isIncident: boolean;
  parentId: string;
  parentNumber: string;
  lastChangeUser: User;
  comment: string;
  deffect: Deffect;
  needsRevision: string;
  description: string;
  hasQuestion: string;
  urgency: I18nString;
  address: Address;
  dispatcher: string;
  owner: string;
  service: string;
  performingOrganization: PerformingOrganization;
  status: I18nString;
  declineReason: DeclineReason;
  performingOrganizationDeclineReason: DeclineReason;
  work: Work;
  guardingEvent: GuardingEvent;
  efficiency: I18nString;
  returnInfo: ReturnInfo;
  isAlerted: string;
  closeDate: Date | null;
  wantedTime: ValueRange<Date | null>;
  review: Review;
  grade: I18nString;
  payment: Payment;
  previousCloseDate: Date | null;
}

export function fromBackendRequest(
  request: BackendRequest,
): Request {
  return {
    id: request.root_id,
    versionId: request.version_id,
    number: request.request_number,
    mosRuNumber: request.mos_ru_request_number,
    creationDate: request.date_of_creation
      ? new Date(request.date_of_creation)
      : null,
    startDate: request.date_of_start
      ? new Date(request.date_of_start)
      : null,
    source: {
      ru: request.name_of_source,
      en: request.name_of_source_eng,
    },
    creator: request.name_of_creator,
    isIncident: request.incident_feature === 'Да',
    parentId: request.root_identificator_of_material,
    parentNumber: request.number_of_material,
    lastChangeUser: {
      name: request.last_name_redacted,
      organizationRole: request.role_of_user,
    },
    comment: request.commentaries,
    deffect: {
      name: request.deffect_name,
      shortName: request.short_deffect_name,
      id: request.deffect_id,
      code: request.code_of_deffect,
      category: {
        name: {
          ru: request.deffect_category_name,
          en: request.deffect_category_name_eng,
        },
        id: request.defect_category_id,
      },
    },
    needsRevision: request.need_for_revision,
    description: request.description,
    hasQuestion: request.presence_of_question,
    urgency: {
      ru: request.urgency_category,
      en: request.urgency_category_eng,
    },
    address: {
      district: {
        name: request.district,
        code: request.district_code,
      },
      hood: {
        name: request.hood,
        code: request.hood_code,
      },
      full: request.adress_of_problem,
      unom: request.adress_unom,
      porch: request.porch,
      floor: request.floor,
      flat: request.flat_number,
    },
    dispatcher: request.dispetchers_number,
    owner: request.owner_company,
    service: request.serving_company,
    performingOrganization: {
      name: request.performing_company,
      inn: request.inn_of_performing_company,
    },
    status: {
      ru: request.request_status,
      en: request.request_status_eng,
    },
    declineReason: {
      name: request.reason_for_decline,
      id: request.id_of_reason_for_decline,
    },
    performingOrganizationDeclineReason: {
      name: request.reason_for_decline_of_org,
      id: request.id_of_reason_for_decline,
    },
    work: {
      name: request.work_type_done,
      id: request.id_work_type_done,
      material: request.used_material,
    },
    guardingEvent: {
      name: request.guarding_events,
      id: request.id_guarding_events,
    },
    efficiency: {
      ru: request.efficiency,
      en: request.efficiency_eng,
    },
    returnInfo: {
      count: request.times_returned,
      lastDate: request.date_of_last_return_for_revision
        ? new Date(request.date_of_last_return_for_revision)
        : null,
      isReturned: request.being_on_revision,
    },
    isAlerted: request.alerted_feature,
    closeDate: request.closure_date
      ? new Date(request.closure_date)
      : null,
    wantedTime: {
      from: request.wanted_time_from
        ? new Date(request.wanted_time_from)
        : null,
      to: request.wanted_time_to
        ? new Date(request.wanted_time_to)
        : null,
    },
    review: {
      text: request.review,
      date: request.date_of_review
        ? new Date(request.date_of_review)
        : null,
    },
    grade: {
      ru: request.grade_for_service,
      en: request.grade_for_service_eng,
    },
    payment: {
      type: {
        ru: request.payment_category,
        en: request.payment_category_eng,
      },
      byCard: request.payed_by_card,
    },
    previousCloseDate: request.date_of_previous_request_close
      ? new Date(request.date_of_previous_request_close)
      : null,
  };
}
