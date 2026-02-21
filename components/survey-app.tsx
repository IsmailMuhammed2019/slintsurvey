"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getVisibleSections, isQuestionVisible, QUESTIONS, type Question, type SurveyAnswers } from "@/lib/survey";

type ApiSurveyResponse = {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  phone: string | null;
  location: string | null;
  profile: string[];
  cluster: string[];
  fundingNeed: string | null;
  fundingRange: string | null;
  cardInterest: string | null;
  timeCommitment: string | null;
  answers: SurveyAnswers;
};

const CHART_COLORS = ["#1B4F72", "#2E86C1", "#1ABC9C", "#27AE60", "#F39C12", "#E74C3C", "#8E44AD", "#D35400"];

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

  if (!isQuestionVisible(question, answers)) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          {question.text}
          {question.required ? <span className="ml-1 text-red-600">*</span> : null}
        </CardTitle>
        {question.helperText ? <CardDescription>{question.helperText}</CardDescription> : null}
        {question.limit ? <Badge variant="secondary">Select up to {question.limit}</Badge> : null}
      </CardHeader>
      <CardContent>
        {question.type === "text" ? (
          <Input value={typeof value === "string" ? value : ""} onChange={(e) => setAnswer(question.id, e.target.value)} />
        ) : null}

        {question.type === "email" ? (
          <Input
            type="email"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => setAnswer(question.id, e.target.value)}
          />
        ) : null}

        {question.type === "textarea" ? (
          <Textarea value={typeof value === "string" ? value : ""} onChange={(e) => setAnswer(question.id, e.target.value)} rows={4} />
        ) : null}

        {question.type === "radio" && question.options ? (
          <RadioGroup value={typeof value === "string" ? value : ""} onValueChange={(v) => setAnswer(question.id, v)} className="gap-3">
            {question.options.map((option) => (
              <div key={option} className="flex items-center gap-2 rounded-md border p-3">
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
                <div key={option} className="flex items-start gap-2 rounded-md border p-3">
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

function toCountData(responses: ApiSurveyResponse[], field: string) {
  const counts = new Map<string, number>();
  for (const response of responses) {
    const value = (response.answers as SurveyAnswers)[field];
    if (!value) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        counts.set(item, (counts.get(item) ?? 0) + 1);
      }
    } else {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function SurveyApp() {
  const [view, setView] = useState("survey");
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [responses, setResponses] = useState<ApiSurveyResponse[]>([]);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visibleSections = useMemo(() => getVisibleSections(answers), [answers]);
  const section = visibleSections[sectionIndex];
  const questions = section ? QUESTIONS[section.id] ?? [] : [];
  const progress = visibleSections.length ? ((sectionIndex + 1) / visibleSections.length) * 100 : 0;

  const fetchResponses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/responses");
      const payload = await response.json();
      setResponses(payload.responses ?? []);
    } catch {
      setError("Could not load responses from the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchResponses();
  }, [fetchResponses]);

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
      await fetchResponses();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteResponse(id: string) {
    await fetch(`/api/responses/${id}`, { method: "DELETE" });
    await fetchResponses();
  }

  const profileData = toCountData(responses, "B1").slice(0, 8);
  const priorityData = toCountData(responses, "D1").slice(0, 8);
  const constraintsData = toCountData(responses, "Q1").slice(0, 8);

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="SLINT Logo" width={44} height={44} className="rounded-md" />
            <div>
              <p className="text-sm text-muted-foreground">Sierra Leoneans in Technology</p>
              <h1 className="text-xl font-bold text-[#1B4F72]">Institutional Diagnostic Survey</h1>
            </div>
          </div>
          <Badge variant="outline">2026-2029</Badge>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="survey">Survey</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="responses">Responses</TabsTrigger>
          </TabsList>

          <TabsContent value="survey" className="mt-6">
            {done ? (
              <Card>
                <CardHeader>
                  <CardTitle>Thank you for your submission</CardTitle>
                  <CardDescription>Your response was saved to the local PostgreSQL database.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button onClick={() => setDone(false)}>Submit Another</Button>
                  <Button variant="outline" onClick={() => setView("dashboard")}>
                    View Dashboard
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Section {section?.id}: {section?.title}
                    </CardTitle>
                    <CardDescription>Progress {sectionIndex + 1} of {visibleSections.length}</CardDescription>
                    <Progress value={progress} className="mt-2" />
                  </CardHeader>
                </Card>

                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                  {visibleSections.map((item, index) => (
                    <Button
                      key={item.id}
                      size="sm"
                      variant={index === sectionIndex ? "default" : "outline"}
                      className="h-7 min-w-7 px-2 text-xs font-semibold"
                      onClick={() => setSectionIndex(index)}
                    >
                      {item.id}
                    </Button>
                  ))}
                </div>

                <div className="space-y-4">
                  {questions.map((question) => (
                    <SurveyQuestion key={question.id} question={question} answers={answers} setAnswer={setAnswer} />
                  ))}
                </div>

                {error ? <p className="text-sm text-red-600">{error}</p> : null}

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setSectionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={sectionIndex === 0}
                  >
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
          </TabsContent>

          <TabsContent value="dashboard" className="mt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Responses</CardDescription>
                  <CardTitle>{responses.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Funding Need</CardDescription>
                  <CardTitle>{responses.filter((r) => r.fundingNeed === "Yes" || r.fundingNeed === "Possibly within 12 months").length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Government Respondents</CardDescription>
                  <CardTitle>{responses.filter((r) => r.profile.includes("Government / Public Sector Official")).length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Unique Clusters</CardDescription>
                  <CardTitle>{new Set(responses.flatMap((response) => response.cluster)).size}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Member Profile</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={profileData} dataKey="value" nameKey="name" outerRadius={110} label>
                        {profileData.map((item, index) => (
                          <Cell key={item.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Priority Areas</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priorityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={false} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#2E86C1" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Ecosystem Constraints</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={constraintsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={false} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#E74C3C" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responses" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Manager</CardTitle>
                <CardDescription>Inspect and export submitted participant responses.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? <p>Loading responses...</p> : null}
                {!loading && responses.length === 0 ? <p>No responses yet.</p> : null}
                {!loading && responses.length > 0 ? (
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Cluster</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {responses.map((response) => (
                          <TableRow key={response.id}>
                            <TableCell>{response.fullName}</TableCell>
                            <TableCell>{response.email}</TableCell>
                            <TableCell>{response.location ?? "-"}</TableCell>
                            <TableCell>{response.cluster.join(", ")}</TableCell>
                            <TableCell>{new Date(response.createdAt).toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="destructive" size="sm" onClick={() => deleteResponse(response.id)}>
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <Button
                      variant="outline"
                      onClick={() => {
                        const csvRows = [
                          ["Name", "Email", "Location", "Profile", "Cluster", "Funding Need", "Funding Range", "Card Interest", "Time Commitment"],
                          ...responses.map((response) => [
                            response.fullName,
                            response.email,
                            response.location ?? "",
                            response.profile.join("; "),
                            response.cluster.join("; "),
                            response.fundingNeed ?? "",
                            response.fundingRange ?? "",
                            response.cardInterest ?? "",
                            response.timeCommitment ?? "",
                          ]),
                        ];
                        const csvText = csvRows
                          .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","))
                          .join("\n");
                        const blob = new Blob([csvText], { type: "text/csv" });
                        const href = URL.createObjectURL(blob);
                        const anchor = document.createElement("a");
                        anchor.href = href;
                        anchor.download = "slint_responses.csv";
                        anchor.click();
                        URL.revokeObjectURL(href);
                      }}
                    >
                      Export CSV
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
