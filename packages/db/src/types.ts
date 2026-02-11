import type { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface Database {
  districts: DistrictTable;
  constituencies: ConstituencyTable;
  parties: PartyTable;
  candidates: CandidateTable;
  centers: CenterTable;
  center_results: CenterResultTable;
  referendum_center_results: ReferendumCenterResultTable;
  scrape_log: ScrapeLogTable;
}

export interface DistrictTable {
  id: Generated<number>;
  ec_zilla_id: number;
  name_bn: string;
  name_en: string;
  slug: string;
  created_at: Generated<Date>;
}

export interface ConstituencyTable {
  id: Generated<number>;
  ec_constituency_id: number;
  district_id: number;
  name_bn: string;
  name_en: string;
  slug: string;
  total_voters: number | null;
  total_votes_cast: number | null;
  total_valid_votes: number | null;
  total_rejected_votes: number | null;
  ref_yes_votes: number | null;
  ref_no_votes: number | null;
  ref_valid_votes: number | null;
  ref_rejected_votes: number | null;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface PartyTable {
  id: Generated<number>;
  name_bn: string;
  name_en: string | null;
  short_name: string | null;
  slug: string;
  logo_url: string | null;
  ec_registration_no: string | null;
  registration_date: string | null;
  symbol_bn: string | null;
  symbol_url: string | null;
  created_at: Generated<Date>;
}

export interface CandidateTable {
  id: Generated<number>;
  constituency_id: number;
  party_id: number | null;
  name_bn: string;
  name_en: string | null;
  photo_url: string | null;
  symbol: string | null;
  symbol_url: string | null;
  total_votes: number | null;
  is_winner: Generated<boolean>;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface CenterTable {
  id: Generated<number>;
  ec_center_id: number | null;
  constituency_id: number;
  center_number: number;
  name_bn: string;
  total_voters: number | null;
  total_votes_cast: number | null;
  valid_votes: number | null;
  rejected_votes: number | null;
  absent_voters: number | null;
  result_sheet_url: string | null;
  created_at: Generated<Date>;
}

export interface CenterResultTable {
  id: Generated<number>;
  center_id: number;
  candidate_id: number;
  votes: number;
}

export interface ReferendumCenterResultTable {
  id: Generated<number>;
  center_id: number;
  yes_votes: number | null;
  no_votes: number | null;
  valid_votes: number | null;
  rejected_votes: number | null;
}

export interface ScrapeLogTable {
  id: Generated<number>;
  entity_type: string;
  entity_id: string;
  status: string;
  error: string | null;
  created_at: Generated<Date>;
}

export type District = Selectable<DistrictTable>;
export type NewDistrict = Insertable<DistrictTable>;
export type DistrictUpdate = Updateable<DistrictTable>;

export type Constituency = Selectable<ConstituencyTable>;
export type NewConstituency = Insertable<ConstituencyTable>;
export type ConstituencyUpdate = Updateable<ConstituencyTable>;

export type Party = Selectable<PartyTable>;
export type NewParty = Insertable<PartyTable>;

export type Candidate = Selectable<CandidateTable>;
export type NewCandidate = Insertable<CandidateTable>;
export type CandidateUpdate = Updateable<CandidateTable>;

export type Center = Selectable<CenterTable>;
export type NewCenter = Insertable<CenterTable>;

export type CenterResult = Selectable<CenterResultTable>;
export type NewCenterResult = Insertable<CenterResultTable>;

export type ReferendumCenterResult = Selectable<ReferendumCenterResultTable>;
export type NewReferendumCenterResult = Insertable<ReferendumCenterResultTable>;

export type ScrapeLog = Selectable<ScrapeLogTable>;
export type NewScrapeLog = Insertable<ScrapeLogTable>;
