import {
  FORM_IDS,
  FormType,
  Evidence,
  Checkin,
  Message,
  Sighting,
  PersonalNote,
  AnonymousTip,
  JotformResponse,
  JotformSubmission,
} from "./types";

const API_KEY = process.env.JOTFORM_API_KEY;
const BASE_URL = "https://api.jotform.com";

function extractAnswers(submission: JotformSubmission): Record<string, string> {
  const data: Record<string, string> = {};

  for (const key in submission.answers) {
    const answer = submission.answers[key];
    if (answer.answer && answer.name) {
      data[answer.name] = answer.answer;
    }
  }

  return data;
}

function normalizeCheckin(
  submission: JotformSubmission,
  data: Record<string, string>
): Checkin {
  return {
    id: submission.id,
    formType: "checkins",
    fullname: data.fullname || "",
    location: data.location || "",
    coordinates: data.coordinates || "",
    timestamp: data.timestamp || "",
    note: data.note || "",
    createdAt: submission.created_at,
  };
}

function normalizeMessage(
  submission: JotformSubmission,
  data: Record<string, string>
): Message {
  return {
    id: submission.id,
    formType: "messages",
    from: data.from || "",
    to: data.to || "",
    message: data.message || "",
    timestamp: data.timestamp || "",
    createdAt: submission.created_at,
  };
}

function normalizeSighting(
  submission: JotformSubmission,
  data: Record<string, string>
): Sighting {
  return {
    id: submission.id,
    formType: "sightings",
    personName: data.personname || "",
    seenWith: data.seenwith || "",
    location: data.location || "",
    coordinates: data.coordinates || "",
    timestamp: data.timestamp || "",
    note: data.note || "",
    createdAt: submission.created_at,
  };
}

function normalizePersonalNote(
  submission: JotformSubmission,
  data: Record<string, string>
): PersonalNote {
  return {
    id: submission.id,
    formType: "personalNotes",
    fullname: data.fullname || "",
    note: data.note || "",
    timestamp: data.timestamp || "",
    createdAt: submission.created_at,
  };
}

function normalizeAnonymousTip(
  submission: JotformSubmission,
  data: Record<string, string>
): AnonymousTip {
  return {
    id: submission.id,
    formType: "anonymousTips",
    suspectName: data.suspectname || "",
    location: data.location || "",
    coordinates: data.coordinates || "",
    timestamp: data.timestamp || "",
    tip: data.tip || "",
    confidence: data.confidence || "",
    createdAt: submission.created_at,
  };
}

function normalizeSubmission(
  submission: JotformSubmission,
  formType: FormType
): Evidence {
  const data = extractAnswers(submission);

  switch (formType) {
    case "checkins":
      return normalizeCheckin(submission, data);
    case "messages":
      return normalizeMessage(submission, data);
    case "sightings":
      return normalizeSighting(submission, data);
    case "personalNotes":
      return normalizePersonalNote(submission, data);
    case "anonymousTips":
      return normalizeAnonymousTip(submission, data);
  }
}

export async function getFormSubmissions(
  formType: FormType
): Promise<Evidence[]> {
  const formId = FORM_IDS[formType];

  const response = await fetch(
    `${BASE_URL}/form/${formId}/submissions?apiKey=${API_KEY}&limit=1000`,
    { next: { revalidate: 60 } }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ${formType}: ${response.statusText}`);
  }

  const json: JotformResponse = await response.json();

  return json.content.map((submission) =>
    normalizeSubmission(submission, formType)
  );
}

export async function getAllEvidence(): Promise<Evidence[]> {
  const formTypes = Object.keys(FORM_IDS) as FormType[];

  const results = await Promise.all(
    formTypes.map((formType) => getFormSubmissions(formType))
  );

  return results.flat().sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export async function getEvidenceByFormType(
  formType: FormType
): Promise<Evidence[]> {
  return getFormSubmissions(formType);
}
