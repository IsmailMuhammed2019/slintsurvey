"use client";

import { useCallback, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getVisibleSections, isQuestionVisible, QUESTIONS, type Question, type SurveyAnswers } from "@/lib/survey";

function SurveyQuestion({
  question,
  answers,
  setAnswer,
}: {
  question: Question;
  answers: SurveyAnswers;
  setAnswer: (id: string, value: string | string[]) => void;
}) {
  const value = answers[question.id];

  if (!isQuestionVisible(question, answers)) return null;

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="space-y-2 pb-3">
        <CardTitle className="text-base leading-relaxed text-slate-900">
          {question.text}
          {question.required ? <span className="ml-1 text-red-600">*</span> : null}
        </CardTitle>
        {question.helperText ? <CardDescription>{question.helperText}</CardDescription> : null}
        {question.limit ? <Badge variant="secondary">Select up to {question.limit}</Badge> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {question.type === "text" ? (
          <Input value={typeof value === "string" ? value : ""} onChange={(e) => setAnswer(question.id, e.target.value)} />
        ) : null}

        {question.type === "email" ? (
          <Input type="email" value={typeof value === "string" ? value : ""} onChange={(e) => setAnswer(question.id, e.target.value)} />
        ) : null}

        {question.type === "textarea" ? (
          <Textarea value={typeof value === "string" ? value : ""} onChange={(e) => setAnswer(question.id, e.target.value)} rows={4} />
        ) : null}

        {question.type === "radio" && question.options ? (
          <RadioGroup value={typeof value === "string" ? value : ""} onValueChange={(v) => setAnswer(question.id, v)} className="gap-3">
            {question.options.map((option) => (
              <div key={option} className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5">
                <RadioGroupItem id={`${question.id}-${option}`} value={option} />
                <Label htmlFor={`${question.id}-${option}`} className="cursor-pointer text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : null}

        {question.type === "checkbox" && question.options ? (
          <div className="grid gap-3 md:grid-cols-2">
            {question.options.map((option) => {
              const selected = Array.isArray(value) ? value.includes(option) : false;
              const isLimited = Boolean(question.limit && Array.isArray(value) && value.length >= question.limit && !selected);

              return (
                <div key={option} className="flex items-start gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <Checkbox
                    id={`${question.id}-${option}`}
                    checked={selected}
                    disabled={isLimited}
                    onCheckedChange={(checked) => {
                      const current = Array.isArray(value) ? value : [];
                      if (checked) {
                        if (!question.limit || current.length < question.limit) {
                          setAnswer(question.id, [...current, option]);
                        }
                      } else {
                        setAnswer(
                          question.id,
                          current.filter((item) => item !== option)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`${question.id}-${option}`} className="cursor-pointer text-sm leading-6">
                    {option}
                  </Label>
                </div>
              );
            })}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function RemixedSurvey() {
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [sectionIndex, setSectionIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visibleSections = useMemo(() => getVisibleSections(answers), [answers]);
  const section = visibleSections[sectionIndex];
  const questions = section ? QUESTIONS[section.id] ?? [] : [];
  const progress = visibleSections.length ? ((sectionIndex + 1) / visibleSections.length) * 100 : 0;
  const groupedBasicIds = useMemo(() => new Set(["A1", "A2", "A3", "A4"]), []);
  const showBasicInfoCard = section?.id === "A" && ["A1", "A2", "A3", "A4"].every((id) => questions.some((q) => q.id === id));
  const visibleQuestions = showBasicInfoCard ? questions.filter((question) => !groupedBasicIds.has(question.id)) : questions;

  const setAnswer = useCallback((id: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  async function submitSurvey() {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: "Could not submit survey." }));
        throw new Error(payload.error ?? "Could not submit survey.");
      }
      setDone(true);
      setAnswers({});
      setSectionIndex(0);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f5f7]">
      <div className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-9 text-center">
          <h1 className="text-3xl font-bold tracking-[0.25em] text-[#184968]">SLINT</h1>
          <p className="mt-2 text-[10px] tracking-[0.35em] text-slate-500 uppercase">Sierra Leoneans in Technology</p>
          <div className="mx-auto mt-3 h-px w-12 bg-[#1c8f94]" />
          <p className="mt-4 text-lg font-semibold text-slate-800">Institutional Diagnostic Survey</p>
          <p className="mt-1 text-xs text-slate-500">2026-2029 Strategic Term · Members Only</p>
        </div>
      </div>

      <div className="border-y border-slate-200 bg-white/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-xs">
          <span className="font-semibold tracking-wide text-slate-600 uppercase">SLINT Diagnostic</span>
          <div className="rounded-md bg-slate-50 p-1">
            <Button size="sm" className="h-7 bg-white text-slate-800 shadow-sm hover:bg-white">
              Survey
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-7">
        {done ? (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Thank you for your submission</CardTitle>
              <CardDescription>Your response was submitted successfully.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setDone(false)}>Submit Another Response</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mx-auto max-w-4xl space-y-4">
            <Card className="border-l-4 border-l-[#1b6c8a] border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Welcome to the SLINT Institutional Diagnostic</CardTitle>
                <CardDescription>
                  As SLINT enters its next phase of institutional development, we are conducting a forward-looking diagnostic to
                  strengthen professional standards, capital access, government collaboration, and industry participation.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="flex items-center gap-4">
              <Progress value={progress} className="h-1.5 flex-1" />
              <span className="text-xs text-slate-600">
                {sectionIndex + 1} / {visibleSections.length}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {visibleSections.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={cn(
                    "flex h-6 min-w-6 items-center justify-center rounded-full border px-2 text-[10px] transition",
                    index === sectionIndex ? "border-[#1B4F72] bg-[#eaf3f8] text-[#1B4F72]" : "border-slate-200 bg-white text-slate-500"
                  )}
                  onClick={() => setSectionIndex(index)}
                >
                  {item.id}
                </button>
              ))}
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-widest text-[#1B4F72] uppercase">Section {section?.id}</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">{section?.title}</h2>
              {section?.required ? <p className="mt-1 text-xs text-amber-700">Required - all fields must be completed</p> : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {showBasicInfoCard ? (
                <div className="md:col-span-2">
                  <Card className="border border-slate-200 bg-white shadow-sm">
                    <CardHeader className="space-y-1 pb-3">
                      <CardTitle className="text-base text-slate-900">Basic contact details</CardTitle>
                      <CardDescription>Please provide your core contact information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="A1">Full Name *</Label>
                          <Input id="A1" value={typeof answers.A1 === "string" ? answers.A1 : ""} onChange={(e) => setAnswer("A1", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="A2">Email Address *</Label>
                          <Input
                            id="A2"
                            type="email"
                            value={typeof answers.A2 === "string" ? answers.A2 : ""}
                            onChange={(e) => setAnswer("A2", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="A3">Phone Number</Label>
                          <Input id="A3" value={typeof answers.A3 === "string" ? answers.A3 : ""} onChange={(e) => setAnswer("A3", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="A4">Location (City & Country)</Label>
                          <Input id="A4" value={typeof answers.A4 === "string" ? answers.A4 : ""} onChange={(e) => setAnswer("A4", e.target.value)} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : null}

              {visibleQuestions.map((question) => {
                const isFullWidth = question.type === "checkbox" || question.type === "radio" || question.type === "textarea";
                return (
                  <div key={question.id} className={isFullWidth ? "md:col-span-2" : "md:col-span-1"}>
                    <SurveyQuestion question={question} answers={answers} setAnswer={setAnswer} />
                  </div>
                );
              })}
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setSectionIndex((prev) => Math.max(0, prev - 1))} disabled={sectionIndex === 0}>
                Previous
              </Button>
              {sectionIndex < visibleSections.length - 1 ? (
                <Button onClick={() => setSectionIndex((prev) => prev + 1)}>Next Section</Button>
              ) : (
                <Button disabled={submitting || !answers.A1 || !answers.A2} onClick={submitSurvey}>
                  {submitting ? "Saving..." : "Submit Response"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
