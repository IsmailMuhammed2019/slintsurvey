"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SurveyAnswers } from "@/lib/survey";

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

function toCountData(responses: ApiSurveyResponse[], field: string) {
  const counts = new Map<string, number>();
  for (const response of responses) {
    const value = (response.answers as SurveyAnswers)[field];
    if (!value) continue;
    if (Array.isArray(value)) {
      for (const item of value) counts.set(item, (counts.get(item) ?? 0) + 1);
    } else {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export function AdminPanel({ initialView = "dashboard" }: { initialView?: "dashboard" | "responses" }) {
  const [view, setView] = useState<"dashboard" | "responses">(initialView);
  const [responses, setResponses] = useState<ApiSurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResponses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/responses");
      if (!response.ok) throw new Error("Not authorized to load responses.");
      const payload = await response.json();
      setResponses(payload.responses ?? []);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Could not load responses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchResponses();
  }, [fetchResponses]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  async function deleteResponse(id: string) {
    const response = await fetch(`/api/responses/${id}`, { method: "DELETE" });
    if (response.ok) await fetchResponses();
  }

  const profileData = toCountData(responses, "B1").slice(0, 8);
  const priorityData = toCountData(responses, "D1").slice(0, 8);
  const constraintsData = toCountData(responses, "Q1").slice(0, 8);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f8fafc,_#eef2ff_40%,_#f8fafc_80%)]">
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="SLINT Logo" width={44} height={44} className="rounded-md border border-slate-200 bg-white p-1 shadow-sm" />
            <div>
              <p className="text-xs tracking-wide text-muted-foreground uppercase">Admin Console</p>
              <h1 className="text-xl font-bold tracking-tight text-[#1B4F72]">Survey Analytics & Responses</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white text-slate-700">Protected</Badge>
            <Button asChild variant="outline" size="sm">
              <Link href="/">Public Survey</Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <Tabs value={view} onValueChange={(value) => setView(value as "dashboard" | "responses")}>
          <TabsList className="bg-white/90 shadow-sm">
            <TabsTrigger value="dashboard" className="px-6">Dashboard</TabsTrigger>
            <TabsTrigger value="responses" className="px-6">Responses</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="border-slate-200 shadow-sm"><CardHeader className="pb-2"><CardDescription>Total Responses</CardDescription><CardTitle>{responses.length}</CardTitle></CardHeader></Card>
              <Card className="border-slate-200 shadow-sm"><CardHeader className="pb-2"><CardDescription>Funding Need</CardDescription><CardTitle>{responses.filter((r) => r.fundingNeed === "Yes" || r.fundingNeed === "Possibly within 12 months").length}</CardTitle></CardHeader></Card>
              <Card className="border-slate-200 shadow-sm"><CardHeader className="pb-2"><CardDescription>Government Respondents</CardDescription><CardTitle>{responses.filter((r) => r.profile.includes("Government / Public Sector Official")).length}</CardTitle></CardHeader></Card>
              <Card className="border-slate-200 shadow-sm"><CardHeader className="pb-2"><CardDescription>Unique Clusters</CardDescription><CardTitle>{new Set(responses.flatMap((response) => response.cluster)).size}</CardTitle></CardHeader></Card>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader><CardTitle>Member Profile</CardTitle></CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={profileData} dataKey="value" nameKey="name" outerRadius={110} label>
                        {profileData.map((item, index) => <Cell key={item.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader><CardTitle>Priority Areas</CardTitle></CardHeader>
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

            <Card className="mt-4 border-slate-200 shadow-sm">
              <CardHeader><CardTitle>Ecosystem Constraints</CardTitle></CardHeader>
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
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Response Manager</CardTitle>
                <CardDescription>Inspect and export submitted participant responses.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? <p>Loading responses...</p> : null}
                {!loading && responses.length === 0 ? <p>No responses yet.</p> : null}
                {error ? <p className="text-sm text-red-600">{error}</p> : null}
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
                        const csvText = csvRows.map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(",")).join("\n");
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
