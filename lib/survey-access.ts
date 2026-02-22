export const SURVEY_ACCESS_COOKIE_NAME = "slint_survey_access";

export function getSurveyAccessCode(): string {
  return process.env.SURVEY_ACCESS_CODE ?? "SLINT-9Kx#2026@Survey$Secure";
}

export function getSurveyAccessCookieValue(): string {
  return process.env.SURVEY_ACCESS_COOKIE_VALUE ?? "slint-survey-verified";
}
