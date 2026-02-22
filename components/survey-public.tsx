"use client";

import Image from "next/image";
import Link from "next/link";
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
import { getVisibleSections, isQuestionVisible, QUESTIONS, type Question, type SurveyAnswers } from "@/lib/survey";
import { cn } from "@/lib/utils";

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
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="space-y-2 pb-3">
        <CardTitle className="text-base leading-relaxed">
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
              <div key={option} className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50/50 p-3 transition hover:bg-slate-100/70">
                <RadioGroupItem id={`${question.id}-${option}`} value={option} />
                <Label htmlFor={`${question.id}-${option}`} className="cursor-pointer">
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
                <div key={option} className="flex items-start gap-2 rounded-md border border-slate-200 bg-slate-50/50 p-3 transition hover:bg-slate-100/70">
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

export function SurveyPublic() {
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [sectionIndex, setSectionIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visibleSections = useMemo(() => getVisibleSections(answers), [answers]);
  const section = visibleSections[sectionIndex];
  const questions = section ? QUESTIONS[section.id] ?? [] : [];
  const progress = visibleSections.length ? ((sectionIndex + 1) / visibleSections.length) * 100 : 0;

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
        const payload = await response.json();
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f8fafc,_#eef2ff_40%,_#f8fafc_80%)]">
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="SLINT Logo" width={44} height={44} className="rounded-md border border-slate-200 bg-white p-1 shadow-sm" />
            <div>
              <p className="text-xs tracking-wide text-muted-foreground uppercase">Sierra Leoneans in Technology</p>
              <h1 className="text-xl font-bold tracking-tight text-[#1B4F72]">Institutional Diagnostic Survey</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white text-slate-700">2026-2029</Badge>
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Admin Login</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
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
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="space-y-3">
                  <CardDescription className="text-xs font-semibold tracking-wider text-[#2E86C1] uppercase">
                    Current section
                  </CardDescription>
                  <CardTitle className="leading-tight">
                    {section?.id}: {section?.title}
                  </CardTitle>
                  <CardDescription>Progress {sectionIndex + 1} of {visibleSections.length}</CardDescription>
                  <Progress value={progress} className="mt-1 h-2" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 gap-2">
                    {visibleSections.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-md border text-xs font-semibold transition",
                          index === sectionIndex
                            ? "border-[#1B4F72] bg-[#1B4F72] text-white shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        )}
                        onClick={() => setSectionIndex(index)}
                      >
                        {item.id}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </aside>

            <div className="space-y-4">
              <Card className="border-slate-200 bg-white/95 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Complete this section</CardTitle>
                  <CardDescription>Provide clear responses for stronger SLINT planning insights.</CardDescription>
                </CardHeader>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className={cn(
                      question.type === "textarea" || question.type === "checkbox" || question.type === "radio"
                        ? "md:col-span-2"
                        : "md:col-span-1"
                    )}
                  >
                    <SurveyQuestion question={question} answers={answers} setAnswer={setAnswer} />
                  </div>
                ))}
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <Card className="border-slate-200 shadow-sm">
                <CardContent className="flex justify-between pt-6">
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
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
