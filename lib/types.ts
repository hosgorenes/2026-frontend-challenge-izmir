export const FORM_IDS = {
  checkins: "261134527667966",
  messages: "261133651963962",
  sightings: "261133720555956",
  personalNotes: "261134449238963",
  anonymousTips: "261134430330946",
} as const;

export type FormType = keyof typeof FORM_IDS;

export interface BaseEvidence {
  id: string;
  formType: FormType;
  timestamp: string;
  createdAt: string;
}

export interface Checkin extends BaseEvidence {
  formType: "checkins";
  fullname: string;
  location: string;
  coordinates: string;
  note: string;
}

export interface Message extends BaseEvidence {
  formType: "messages";
  from: string;
  to: string;
  message: string;
}

export interface Sighting extends BaseEvidence {
  formType: "sightings";
  personName: string;
  seenWith: string;
  location: string;
  coordinates: string;
  note: string;
}

export interface PersonalNote extends BaseEvidence {
  formType: "personalNotes";
  fullname: string;
  note: string;
}

export interface AnonymousTip extends BaseEvidence {
  formType: "anonymousTips";
  suspectName: string;
  location: string;
  coordinates: string;
  tip: string;
  confidence: string;
}

export type Evidence =
  | Checkin
  | Message
  | Sighting
  | PersonalNote
  | AnonymousTip;

export interface JotformAnswer {
  name: string;
  order: string;
  text: string;
  type: string;
  answer?: string;
}

export interface JotformSubmission {
  id: string;
  form_id: string;
  created_at: string;
  status: string;
  answers: Record<string, JotformAnswer>;
}

export interface JotformResponse {
  responseCode: number;
  message: string;
  content: JotformSubmission[];
  resultSet: {
    offset: number;
    limit: number;
    count: number;
  };
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  name: string;
  location: string;
  timestamp: string;
  isPodo: boolean;
}
