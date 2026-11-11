"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { CheckCircle2Icon, CircleAlertIcon } from "lucide-react";
import {
  deleteStudioProject,
  deleteStudioSkill,
  deleteStudioTimelineEntry,
  reorderStudioProjects,
  reorderStudioTimelineEntries,
  saveStudioProfile,
  saveStudioProject,
  saveStudioSkill,
  saveStudioTimelineEntry,
  type StudioState,
} from "@/app/admin/resume/actions";
import { ResumePreview } from "@/components/admin/resume/ResumePreview";
import {
  nextTempId,
  resumePreviewSectionByTab,
  type ResumeDraft,
  type ResumeTab,
} from "@/components/admin/resume/types";
import { moveItem, moveVisibleItem } from "@/lib/reorder";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { StoredProject, StoredSkill, TimelineEntry } from "@/db";
import type { TimelineKind } from "@/db/schema";
import { ProfilePhotoField } from "@/components/admin/ProfilePhotoField";
import { ProjectImageField } from "@/components/admin/ProjectImageField";
import { ProjectStackField } from "@/components/admin/ProjectStackField";
import { geocodeLocation } from "@/lib/geocode";
import { parseProfilePhotoShape } from "@/lib/profile-photo";
import { skillIconOptions } from "@/lib/skill-icons";
import {
  employmentTypes,
  formatTimelinePeriod,
  locationTypes,
  timelineMonths,
  timelineYearOptions,
} from "@/lib/timeline-period";
import { cn } from "@/lib/utils";

const initialStudio: StudioState = { error: "", message: "" };

function MonthSelectValue() {
  return (
    <SelectValue placeholder="Month">
      {(value: string | null) => {
        if (!value || value === "__none__") return "Month";
        return timelineMonths.find((month) => month.value === value)?.label ?? value;
      }}
    </SelectValue>
  );
}

const tabs: { value: ResumeTab; label: string }[] = [
  { value: "profile", label: "Profile" },
  { value: "experience", label: "Experience" },
  { value: "education", label: "Education" },
  { value: "certificates", label: "Certificates" },
  { value: "skills", label: "Skills" },
  { value: "projects", label: "Projects" },
];

export function ResumeStudio({
  initial,
  initialTab = "profile",
}: {
  initial: ResumeDraft;
  initialTab?: ResumeTab;
}) {
  const [draft, setDraft] = useState(initial);
  const [activeTab, setActiveTab] = useState<ResumeTab>(initialTab);
  const [selected, setSelected] = useState<Record<TimelineKind | "skill" | "project", number | null>>({
    work: initial.experience[0]?.id ?? null,
    education: initial.education[0]?.id ?? null,
    certificate: initial.certificates[0]?.id ?? null,
    skill: initial.skills[0]?.id ?? null,
    project: initial.projects[0]?.id ?? null,
  });

  function persistTimelineOrder(kind: TimelineKind, items: { id: number }[]) {
    const ids = items.map((item) => item.id).filter((id) => id > 0);
    if (!ids.length) return;
    const formData = new FormData();
    formData.set("kind", kind);
    formData.set("ids", ids.join(","));
    void reorderStudioTimelineEntries(formData);
  }

  function persistProjectOrder(items: { id: number }[]) {
    const ids = items.map((item) => item.id).filter((id) => id > 0);
    if (!ids.length) return;
    const formData = new FormData();
    formData.set("ids", ids.join(","));
    void reorderStudioProjects(formData);
  }

  function reorderExperience(fromIndex: number, toIndex: number) {
    const visible = draft.experience.filter((item) => item.showOnResume);
    const next = moveVisibleItem(draft.experience, visible, fromIndex, toIndex);
    setDraft((prev) => ({ ...prev, experience: next }));
    persistTimelineOrder("work", next);
  }

  function reorderEducation(fromIndex: number, toIndex: number) {
    const visible = draft.education.filter((item) => item.showOnResume);
    const next = moveVisibleItem(draft.education, visible, fromIndex, toIndex);
    setDraft((prev) => ({ ...prev, education: next }));
    persistTimelineOrder("education", next);
  }

  function reorderCertificates(fromIndex: number, toIndex: number) {
    const next = moveItem(draft.certificates, fromIndex, toIndex);
    setDraft((prev) => ({ ...prev, certificates: next }));
    persistTimelineOrder("certificate", next);
  }

  function reorderProjects(fromIndex: number, toIndex: number) {
    const visible = draft.projects.filter((item) => item.showOnResume);
    const next = moveVisibleItem(draft.projects, visible, fromIndex, toIndex);
    setDraft((prev) => ({ ...prev, projects: next }));
    persistProjectOrder(next);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
      <div className="min-w-0">
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            if (typeof value === "string" && value in resumePreviewSectionByTab) {
              setActiveTab(value as ResumeTab);
            }
          }}
        >
          <TabsList variant="line" className="mb-4 flex h-auto w-full flex-wrap justify-start gap-1">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex-none px-2.5">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="profile" className="outline-none">
            <ProfileEditor draft={draft} setDraft={setDraft} />
          </TabsContent>

          <TabsContent value="experience" className="outline-none">
            <TimelineEditor
              kind="work"
              title="Experience"
              placeLabel="Company / place"
              showHref={false}
              items={draft.experience}
              selectedId={selected.work}
              onSelect={(id) => setSelected((prev) => ({ ...prev, work: id }))}
              onChangeItems={(items) => setDraft((prev) => ({ ...prev, experience: items }))}
            />
          </TabsContent>

          <TabsContent value="education" className="outline-none">
            <TimelineEditor
              kind="education"
              title="Education"
              placeLabel="School / institution"
              showHref={false}
              items={draft.education}
              selectedId={selected.education}
              onSelect={(id) => setSelected((prev) => ({ ...prev, education: id }))}
              onChangeItems={(items) => setDraft((prev) => ({ ...prev, education: items }))}
            />
          </TabsContent>

          <TabsContent value="certificates" className="outline-none">
            <TimelineEditor
              kind="certificate"
              title="Certificates"
              placeLabel="Issuer"
              showHref
              items={draft.certificates}
              selectedId={selected.certificate}
              onSelect={(id) => setSelected((prev) => ({ ...prev, certificate: id }))}
              onChangeItems={(items) => setDraft((prev) => ({ ...prev, certificates: items }))}
            />
          </TabsContent>

          <TabsContent value="skills" className="outline-none">
            <SkillsEditor
              items={draft.skills}
              selectedId={selected.skill}
              onSelect={(id) => setSelected((prev) => ({ ...prev, skill: id }))}
              onChangeItems={(items) => setDraft((prev) => ({ ...prev, skills: items }))}
            />
          </TabsContent>

          <TabsContent value="projects" className="outline-none">
            <ProjectsEditor
              items={draft.projects}
              skills={draft.skills}
              selectedId={selected.project}
              onSelect={(id) => setSelected((prev) => ({ ...prev, project: id }))}
              onChangeItems={(items) => setDraft((prev) => ({ ...prev, projects: items }))}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex min-w-0 max-h-[min(85vh,calc(100dvh-8rem))] flex-col lg:sticky lg:top-20 lg:h-[calc(100dvh-5.5rem)] lg:max-h-[calc(100dvh-5.5rem)]">
        <p className="mb-3 shrink-0 text-sm text-muted-foreground">Live preview</p>
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain pr-1">
          <ResumePreview
            draft={draft}
            focusSection={resumePreviewSectionByTab[activeTab]}
            reorder={{
              experience: reorderExperience,
              education: reorderEducation,
              certificates: reorderCertificates,
              projects: reorderProjects,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ProfileEditor({
  draft,
  setDraft,
}: {
  draft: ResumeDraft;
  setDraft: React.Dispatch<React.SetStateAction<ResumeDraft>>;
}) {
  const [state, action, pending] = useActionState(saveStudioProfile, initialStudio);
  const [photoError, setPhotoError] = useState("");
  const [photoBusy, setPhotoBusy] = useState(false);
  const profile = draft.profile;
  const photoShape = parseProfilePhotoShape(profile.photoShape);

  function patch<K extends keyof ResumeDraft["profile"]>(key: K, value: ResumeDraft["profile"][K]) {
    setDraft((prev) => ({ ...prev, profile: { ...prev.profile, [key]: value } }));
  }

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="photo" value={profile.photo} />
      <input type="hidden" name="photoShape" value={photoShape} />
      <div className="grid gap-2">
        <ProfilePhotoField
          photo={profile.photo}
          photoShape={photoShape}
          disabled={photoBusy || pending}
          onPhotoChange={(photo) => patch("photo", photo)}
          onPhotoClear={() => patch("photo", "")}
          onShapeChange={(shape) => patch("photoShape", shape)}
          onError={setPhotoError}
          onBusyChange={setPhotoBusy}
        />
        {photoBusy ? <p className="text-sm text-muted-foreground">Compressing photo…</p> : null}
        {photoError ? (
          <Alert variant="destructive">
            <AlertDescription>{photoError}</AlertDescription>
          </Alert>
        ) : null}
      </div>
      {(
        [
          ["name", "Name", "text"],
          ["role", "Role", "text"],
          ["location", "Location", "text"],
          ["email", "Email", "email"],
          ["github", "GitHub URL", "url"],
          ["linkedin", "LinkedIn URL", "url"],
        ] as const
      ).map(([key, label, type]) => (
        <div key={key} className="grid gap-2">
          <Label htmlFor={`resume-${key}`}>{label}</Label>
          <Input
            id={`resume-${key}`}
            name={key}
            type={type}
            className="h-10"
            value={profile[key]}
            onChange={(event) => patch(key, event.target.value)}
          />
        </div>
      ))}
      <div className="grid gap-2">
        <Label htmlFor="resume-summary">Summary</Label>
        <Textarea
          id="resume-summary"
          name="summary"
          required
          rows={4}
          value={profile.summary}
          onChange={(event) => patch("summary", event.target.value)}
        />
      </div>
      <Status state={state} />
      <Button type="submit" disabled={pending || photoBusy} className="h-10 w-fit">
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}

function TimelineEditor({
  kind,
  title,
  placeLabel,
  showHref,
  items,
  selectedId,
  onSelect,
  onChangeItems,
}: {
  kind: TimelineKind;
  title: string;
  placeLabel: string;
  showHref: boolean;
  items: TimelineEntry[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  onChangeItems: (items: TimelineEntry[]) => void;
}) {
  const [state, action, pending] = useActionState(saveStudioTimelineEntry, initialStudio);
  const [pendingDelete, startDelete] = useTransition();
  const [deleteError, setDeleteError] = useState("");
  const [geocodeStatus, setGeocodeStatus] = useState<
    "idle" | "loading" | "found" | "missing" | "error"
  >("idle");
  const selected = items.find((item) => item.id === selectedId) ?? null;
  const itemsRef = useRef(items);
  const geocodeEntryId = useRef<number | null>(null);
  const lastGeocodedLocation = useRef("");
  itemsRef.current = items;

  useEffect(() => {
    if (state.id && selectedId !== null && selectedId < 1) {
      onChangeItems(items.map((item) => (item.id === selectedId ? { ...item, id: state.id! } : item)));
      onSelect(state.id);
    }
    // Only sync when save returns a new id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.id]);

  useEffect(() => {
    if (kind !== "work" || !selected) {
      setGeocodeStatus("idle");
      return;
    }

    const entryId = selected.id;
    const query = selected.location.trim();

    // Switching entries: keep saved coords, don't re-fetch until location changes.
    if (geocodeEntryId.current !== entryId) {
      geocodeEntryId.current = entryId;
      lastGeocodedLocation.current = query;
      setGeocodeStatus(query && selected.mapLat && selected.mapLng ? "found" : "idle");
      return;
    }

    if (query === lastGeocodedLocation.current) return;

    if (!query) {
      lastGeocodedLocation.current = "";
      setGeocodeStatus("idle");
      onChangeItems(
        itemsRef.current.map((item) =>
          item.id === entryId ? { ...item, mapLat: "", mapLng: "" } : item,
        ),
      );
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setGeocodeStatus("loading");
      void geocodeLocation(query, controller.signal)
        .then((result) => {
          if (controller.signal.aborted) return;
          lastGeocodedLocation.current = query;
          if (!result) {
            setGeocodeStatus("missing");
            return;
          }
          onChangeItems(
            itemsRef.current.map((item) =>
              item.id === entryId ? { ...item, mapLat: result.lat, mapLng: result.lng } : item,
            ),
          );
          setGeocodeStatus("found");
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setGeocodeStatus("error");
        });
    }, 700);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
    // Geocode when the selected work location text changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, selected?.id, selected?.location]);

  function patchSelected(patch: Partial<TimelineEntry>) {
    if (!selected) return;
    onChangeItems(items.map((item) => (item.id === selected.id ? { ...item, ...patch } : item)));
  }

  function addEntry() {
    const id = nextTempId(items);
    const entry: TimelineEntry = {
      id,
      kind,
      title: "",
      place: "",
      period: "",
      detail: "",
      href: "",
      position: items.length,
      location: "",
      locationType: kind === "work" ? "On-site" : "",
      mapLat: "",
      mapLng: "",
      employmentType: kind === "work" ? "Full-time" : "",
      isCurrent: false,
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      fieldOfStudy: "",
      grade: "",
      activities: "",
      showOnSite: true,
      showOnResume: true,
    };
    onChangeItems([...items, entry]);
    onSelect(id);
  }

  function patchStructuredDates(
    patch: Partial<Pick<TimelineEntry, "startMonth" | "startYear" | "endMonth" | "endYear" | "isCurrent">>,
  ) {
    if (!selected) return;
    const next = { ...selected, ...patch };
    if (kind === "work" && next.isCurrent) {
      next.endMonth = "";
      next.endYear = "";
    }
    next.period = formatTimelinePeriod({
      startMonth: next.startMonth,
      startYear: next.startYear,
      endMonth: next.endMonth,
      endYear: next.endYear,
      isCurrent: kind === "work" ? next.isCurrent : false,
      fallback: next.period,
    });
    patchSelected(next);
  }

  const yearOptions = timelineYearOptions();
  const isWork = kind === "work";
  const isEducation = kind === "education";

  function removeSelected() {
    if (!selected) return;
    setDeleteError("");
    if (selected.id < 1) {
      const next = items.filter((item) => item.id !== selected.id);
      onChangeItems(next);
      onSelect(next[0]?.id ?? null);
      return;
    }
    const formData = new FormData();
    formData.set("id", String(selected.id));
    formData.set("kind", kind);
    startDelete(async () => {
      const result = await deleteStudioTimelineEntry(formData);
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      const next = items.filter((item) => item.id !== selected.id);
      onChangeItems(next);
      onSelect(next[0]?.id ?? null);
    });
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">{title}</p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={addEntry}>
            Add
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={!selected || pendingDelete}
            onClick={removeSelected}
          >
            Delete
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No entries yet. Add one to start editing.</p>
      ) : (
        <div className="flex flex-wrap gap-1">
          {items.map((item) => (
            <Button
              key={item.id}
              type="button"
              size="sm"
              variant={item.id === selectedId ? "secondary" : "ghost"}
              className={cn("max-w-full truncate")}
              onClick={() => onSelect(item.id)}
            >
              {kind === "education"
                ? item.place || item.title || item.fieldOfStudy || "Untitled"
                : item.title || "Untitled"}
            </Button>
          ))}
        </div>
      )}

      {selected ? (
        <form action={action} className="grid gap-4">
          <input type="hidden" name="id" value={selected.id} />
          <input type="hidden" name="kind" value={kind} />
          <input type="hidden" name="period" value={selected.period} />
          <input type="hidden" name="location" value={selected.location} />
          <input type="hidden" name="locationType" value={selected.locationType} />
          <input type="hidden" name="mapLat" value={selected.mapLat} />
          <input type="hidden" name="mapLng" value={selected.mapLng} />
          <input type="hidden" name="employmentType" value={selected.employmentType} />
          <input type="hidden" name="fieldOfStudy" value={selected.fieldOfStudy} />
          <input type="hidden" name="grade" value={selected.grade} />
          <input type="hidden" name="activities" value={selected.activities} />
          <input type="hidden" name="startMonth" value={selected.startMonth} />
          <input type="hidden" name="startYear" value={selected.startYear} />
          <input type="hidden" name="endMonth" value={selected.endMonth} />
          <input type="hidden" name="endYear" value={selected.endYear} />
          {selected.isCurrent ? <input type="hidden" name="isCurrent" value="on" /> : null}
          {selected.showOnSite ? <input type="hidden" name="showOnSite" value="on" /> : null}
          {selected.showOnResume ? <input type="hidden" name="showOnResume" value="on" /> : null}

          {isWork ? (
            <>
              <p className="text-sm font-medium">Role details</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor={`${kind}-title`}>Job title</Label>
                  <Input
                    id={`${kind}-title`}
                    name="title"
                    required
                    className="h-10"
                    value={selected.title}
                    onChange={(event) => patchSelected({ title: event.target.value })}
                  />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor={`${kind}-place`}>Organization</Label>
                  <Input
                    id={`${kind}-place`}
                    name="place"
                    required
                    className="h-10"
                    value={selected.place}
                    onChange={(event) => patchSelected({ place: event.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`${kind}-location`}>Location</Label>
                  <Input
                    id={`${kind}-location`}
                    className="h-10"
                    placeholder="Kuala Lumpur, Malaysia"
                    value={selected.location}
                    onChange={(event) => patchSelected({ location: event.target.value })}
                  />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label>Map marker</Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor={`${kind}-mapLat`}>Latitude</Label>
                      <Input
                        id={`${kind}-mapLat`}
                        className="h-10"
                        placeholder="Auto from location"
                        value={selected.mapLat}
                        readOnly
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`${kind}-mapLng`}>Longitude</Label>
                      <Input
                        id={`${kind}-mapLng`}
                        className="h-10"
                        placeholder="Auto from location"
                        value={selected.mapLng}
                        readOnly
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {geocodeStatus === "loading"
                      ? "Looking up coordinates…"
                      : geocodeStatus === "found"
                        ? "Coordinates filled automatically from the location address."
                        : geocodeStatus === "missing"
                          ? "No coordinates found for that address. Try a clearer place name."
                          : geocodeStatus === "error"
                            ? "Could not look up that address. Check your connection and try again."
                            : "Latitude and longitude update automatically when you enter a location."}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`${kind}-locationType`}>Location type</Label>
                  <Select
                    value={selected.locationType || "__none__"}
                    onValueChange={(value) =>
                      patchSelected({
                        locationType: !value || value === "__none__" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger id={`${kind}-locationType`} className="h-10 w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Select type</SelectItem>
                      {locationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`${kind}-employmentType`}>Employment type</Label>
                  <Select
                    value={selected.employmentType || "__none__"}
                    onValueChange={(value) =>
                      patchSelected({
                        employmentType: !value || value === "__none__" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger id={`${kind}-employmentType`} className="h-10 w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Select type</SelectItem>
                      {employmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Label className="font-normal">
                <Checkbox
                  checked={selected.isCurrent}
                  onCheckedChange={(checked) =>
                    patchStructuredDates({ isCurrent: checked === true })
                  }
                />
                I am currently working in this role
              </Label>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor={`${kind}-startMonth`}>Start month</Label>
                  <Select
                    value={selected.startMonth || "__none__"}
                    onValueChange={(value) =>
                      patchStructuredDates({
                        startMonth: !value || value === "__none__" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger id={`${kind}-startMonth`} className="h-10 w-full">
                      <MonthSelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Month</SelectItem>
                      {timelineMonths.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`${kind}-startYear`}>Start year</Label>
                  <Select
                    value={selected.startYear || "__none__"}
                    onValueChange={(value) =>
                      patchStructuredDates({
                        startYear: !value || value === "__none__" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger id={`${kind}-startYear`} className="h-10 w-full">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Year</SelectItem>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {!selected.isCurrent ? (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor={`${kind}-endMonth`}>End month</Label>
                      <Select
                        value={selected.endMonth || "__none__"}
                        onValueChange={(value) =>
                          patchStructuredDates({
                            endMonth: !value || value === "__none__" ? "" : value,
                          })
                        }
                      >
                        <SelectTrigger id={`${kind}-endMonth`} className="h-10 w-full">
                          <MonthSelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">Month</SelectItem>
                          {timelineMonths.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`${kind}-endYear`}>End year</Label>
                      <Select
                        value={selected.endYear || "__none__"}
                        onValueChange={(value) =>
                          patchStructuredDates({
                            endYear: !value || value === "__none__" ? "" : value,
                          })
                        }
                      >
                        <SelectTrigger id={`${kind}-endYear`} className="h-10 w-full">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">Year</SelectItem>
                          {yearOptions.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : null}
              </div>

              {selected.period ? (
                <p className="text-xs text-muted-foreground">Shows as: {selected.period}</p>
              ) : null}

              <div className="grid gap-2">
                <Label htmlFor={`${kind}-detail`}>Description</Label>
                <Textarea
                  id={`${kind}-detail`}
                  name="detail"
                  rows={5}
                  placeholder="List responsibilities, impact, and highlights…"
                  value={selected.detail}
                  onChange={(event) => patchSelected({ detail: event.target.value })}
                />
              </div>
              <input type="hidden" name="href" value="" />
              <div className="grid gap-2">
                <Label className="font-normal">
                  <Checkbox
                    checked={selected.showOnSite}
                    onCheckedChange={(checked) =>
                      patchSelected({ showOnSite: checked === true })
                    }
                  />
                  Show on homepage
                </Label>
                <Label className="font-normal">
                  <Checkbox
                    checked={selected.showOnResume}
                    onCheckedChange={(checked) =>
                      patchSelected({ showOnResume: checked === true })
                    }
                  />
                  Show on resume
                </Label>
                <p className="text-xs text-muted-foreground">
                  Uncheck homepage to hide from the public site. Check resume to include it in the
                  live preview.
                </p>
              </div>
            </>
          ) : isEducation ? (
            <>
              <p className="text-sm font-medium">Education details</p>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`${kind}-place`}>School</Label>
                  <Input
                    id={`${kind}-place`}
                    name="place"
                    required
                    className="h-10"
                    placeholder="Ex: Universiti Kuala Lumpur"
                    value={selected.place}
                    onChange={(event) => patchSelected({ place: event.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`${kind}-title`}>Degree</Label>
                  <Input
                    id={`${kind}-title`}
                    name="title"
                    className="h-10"
                    placeholder="Ex: Bachelor of Science"
                    value={selected.title}
                    onChange={(event) => patchSelected({ title: event.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`${kind}-fieldOfStudy`}>Field of study</Label>
                  <Input
                    id={`${kind}-fieldOfStudy`}
                    className="h-10"
                    placeholder="Ex: Business"
                    value={selected.fieldOfStudy}
                    onChange={(event) => patchSelected({ fieldOfStudy: event.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor={`${kind}-startMonth`}>Start month</Label>
                  <Select
                    value={selected.startMonth || "__none__"}
                    onValueChange={(value) =>
                      patchStructuredDates({
                        startMonth: !value || value === "__none__" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger id={`${kind}-startMonth`} className="h-10 w-full">
                      <MonthSelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Month</SelectItem>
                      {timelineMonths.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`${kind}-startYear`}>Start year</Label>
                  <Select
                    value={selected.startYear || "__none__"}
                    onValueChange={(value) =>
                      patchStructuredDates({
                        startYear: !value || value === "__none__" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger id={`${kind}-startYear`} className="h-10 w-full">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Year</SelectItem>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`${kind}-endMonth`}>End month (or expected)</Label>
                  <Select
                    value={selected.endMonth || "__none__"}
                    onValueChange={(value) =>
                      patchStructuredDates({
                        endMonth: !value || value === "__none__" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger id={`${kind}-endMonth`} className="h-10 w-full">
                      <MonthSelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Month</SelectItem>
                      {timelineMonths.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`${kind}-endYear`}>End year (or expected)</Label>
                  <Select
                    value={selected.endYear || "__none__"}
                    onValueChange={(value) =>
                      patchStructuredDates({
                        endYear: !value || value === "__none__" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger id={`${kind}-endYear`} className="h-10 w-full">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Year</SelectItem>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selected.period ? (
                <p className="text-xs text-muted-foreground">Shows as: {selected.period}</p>
              ) : null}

              <div className="grid gap-2">
                <Label htmlFor={`${kind}-grade`}>Grade</Label>
                <Input
                  id={`${kind}-grade`}
                  className="h-10"
                  maxLength={80}
                  placeholder="Ex: 3.53"
                  value={selected.grade}
                  onChange={(event) => patchSelected({ grade: event.target.value.slice(0, 80) })}
                />
                <p className="text-xs text-muted-foreground">{selected.grade.length}/80</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${kind}-activities`}>Activities and societies</Label>
                <Textarea
                  id={`${kind}-activities`}
                  rows={3}
                  placeholder="Ex: Coding club, debate team"
                  value={selected.activities}
                  onChange={(event) => patchSelected({ activities: event.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${kind}-detail`}>Description</Label>
                <Textarea
                  id={`${kind}-detail`}
                  name="detail"
                  rows={4}
                  placeholder="Describe coursework, projects, or achievements…"
                  value={selected.detail}
                  onChange={(event) => patchSelected({ detail: event.target.value })}
                />
              </div>
              <input type="hidden" name="href" value="" />
              <div className="grid gap-2">
                <Label className="font-normal">
                  <Checkbox
                    checked={selected.showOnSite}
                    onCheckedChange={(checked) =>
                      patchSelected({ showOnSite: checked === true })
                    }
                  />
                  Show on homepage
                </Label>
                <Label className="font-normal">
                  <Checkbox
                    checked={selected.showOnResume}
                    onCheckedChange={(checked) =>
                      patchSelected({ showOnResume: checked === true })
                    }
                  />
                  Show on resume
                </Label>
                <p className="text-xs text-muted-foreground">
                  Uncheck homepage to hide from the public site. Check resume to include it in the
                  live preview.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor={`${kind}-title`}>Title</Label>
                <Input
                  id={`${kind}-title`}
                  name="title"
                  required
                  className="h-10"
                  value={selected.title}
                  onChange={(event) => patchSelected({ title: event.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${kind}-place`}>{placeLabel}</Label>
                <Input
                  id={`${kind}-place`}
                  name="place"
                  required
                  className="h-10"
                  value={selected.place}
                  onChange={(event) => patchSelected({ place: event.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${kind}-period`}>Period</Label>
                <Input
                  id={`${kind}-period`}
                  className="h-10"
                  required
                  value={selected.period}
                  onChange={(event) => patchSelected({ period: event.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${kind}-detail`}>Detail</Label>
                <Textarea
                  id={`${kind}-detail`}
                  name="detail"
                  required
                  rows={4}
                  value={selected.detail}
                  onChange={(event) => patchSelected({ detail: event.target.value })}
                />
              </div>
              {showHref ? (
                <div className="grid gap-2">
                  <Label htmlFor={`${kind}-href`}>Credential URL</Label>
                  <Input
                    id={`${kind}-href`}
                    name="href"
                    type="url"
                    className="h-10"
                    value={selected.href}
                    onChange={(event) => patchSelected({ href: event.target.value })}
                  />
                </div>
              ) : (
                <input type="hidden" name="href" value="" />
              )}
            </>
          )}

          <Status state={state} />
          {deleteError ? (
            <Alert variant="destructive">
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          ) : null}
          <Button type="submit" disabled={pending} className="h-10 w-fit">
            {pending ? "Saving…" : selected.id < 1 ? "Add entry" : "Save entry"}
          </Button>
        </form>
      ) : null}
    </div>
  );
}

function SkillsEditor({
  items,
  selectedId,
  onSelect,
  onChangeItems,
}: {
  items: StoredSkill[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  onChangeItems: (items: StoredSkill[]) => void;
}) {
  const [state, action, pending] = useActionState(saveStudioSkill, initialStudio);
  const [pendingDelete, startDelete] = useTransition();
  const [deleteError, setDeleteError] = useState("");
  const selected = items.find((item) => item.id === selectedId) ?? null;

  useEffect(() => {
    if (state.id && selectedId !== null && selectedId < 1) {
      onChangeItems(items.map((item) => (item.id === selectedId ? { ...item, id: state.id! } : item)));
      onSelect(state.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.id]);

  function patchSelected(patch: Partial<StoredSkill>) {
    if (!selected) return;
    onChangeItems(items.map((item) => (item.id === selected.id ? { ...item, ...patch } : item)));
  }

  function addSkill() {
    const id = nextTempId(items);
    const skill: StoredSkill = { id, name: "", iconSlug: "", color: "", position: items.length };
    onChangeItems([...items, skill]);
    onSelect(id);
  }

  function removeSelected() {
    if (!selected) return;
    setDeleteError("");
    if (selected.id < 1) {
      const next = items.filter((item) => item.id !== selected.id);
      onChangeItems(next);
      onSelect(next[0]?.id ?? null);
      return;
    }
    const formData = new FormData();
    formData.set("id", String(selected.id));
    startDelete(async () => {
      const result = await deleteStudioSkill(formData);
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      const next = items.filter((item) => item.id !== selected.id);
      onChangeItems(next);
      onSelect(next[0]?.id ?? null);
    });
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">Skills</p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={addSkill}>
            Add
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={!selected || pendingDelete}
            onClick={removeSelected}
          >
            Delete
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No skills yet. Add one to start editing.</p>
      ) : (
        <div className="flex flex-wrap gap-1">
          {items.map((item) => (
            <Button
              key={item.id}
              type="button"
              size="sm"
              variant={item.id === selectedId ? "secondary" : "ghost"}
              onClick={() => onSelect(item.id)}
            >
              {item.name || "Untitled"}
            </Button>
          ))}
        </div>
      )}

      {selected ? (
        <form action={action} className="grid gap-4">
          <input type="hidden" name="id" value={selected.id} />
          <div className="grid gap-2">
            <Label htmlFor="skill-name">Name</Label>
            <Input
              id="skill-name"
              name="name"
              required
              className="h-10"
              value={selected.name}
              onChange={(event) => patchSelected({ name: event.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="skill-icon">Icon</Label>
            <Select
              name="iconSlug"
              value={selected.iconSlug || "__none__"}
              onValueChange={(value) =>
                patchSelected({ iconSlug: !value || value === "__none__" ? "" : value })
              }
            >
              <SelectTrigger id="skill-icon" className="h-10 w-full">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
                {skillIconOptions.map((slug) => (
                  <SelectItem key={slug} value={slug}>
                    {slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="skill-color">Color</Label>
            <Input
              id="skill-color"
              name="color"
              className="h-10"
              placeholder="#61DAFB"
              value={selected.color}
              onChange={(event) => patchSelected({ color: event.target.value })}
            />
          </div>
          <Status state={state} />
          {deleteError ? (
            <Alert variant="destructive">
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          ) : null}
          <Button type="submit" disabled={pending} className="h-10 w-fit">
            {pending ? "Saving…" : selected.id < 1 ? "Add skill" : "Save skill"}
          </Button>
        </form>
      ) : null}
    </div>
  );
}

function ProjectsEditor({
  items,
  skills,
  selectedId,
  onSelect,
  onChangeItems,
}: {
  items: StoredProject[];
  skills: StoredSkill[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  onChangeItems: (items: StoredProject[]) => void;
}) {
  const [state, action, pending] = useActionState(saveStudioProject, initialStudio);
  const [pendingDelete, startDelete] = useTransition();
  const [deleteError, setDeleteError] = useState("");
  const [imageError, setImageError] = useState("");
  const [imageBusy, setImageBusy] = useState(false);
  const selected = items.find((item) => item.id === selectedId) ?? null;

  useEffect(() => {
    if (state.id && selectedId !== null && selectedId < 1) {
      onChangeItems(items.map((item) => (item.id === selectedId ? { ...item, id: state.id! } : item)));
      onSelect(state.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.id]);

  useEffect(() => {
    setImageError("");
    setImageBusy(false);
  }, [selectedId]);

  function patchSelected(patch: Partial<StoredProject>) {
    if (!selected) return;
    onChangeItems(items.map((item) => (item.id === selected.id ? { ...item, ...patch } : item)));
  }

  function addProject() {
    const id = nextTempId(items);
    const project: StoredProject = {
      id,
      title: "",
      description: "",
      stack: [],
      href: "",
      repo: "",
      image: "",
      position: items.length,
      showOnSite: true,
      showOnResume: true,
    };
    onChangeItems([...items, project]);
    onSelect(id);
  }

  function removeSelected() {
    if (!selected) return;
    setDeleteError("");
    if (selected.id < 1) {
      const next = items.filter((item) => item.id !== selected.id);
      onChangeItems(next);
      onSelect(next[0]?.id ?? null);
      return;
    }
    const formData = new FormData();
    formData.set("id", String(selected.id));
    startDelete(async () => {
      const result = await deleteStudioProject(formData);
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      const next = items.filter((item) => item.id !== selected.id);
      onChangeItems(next);
      onSelect(next[0]?.id ?? null);
    });
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">Projects</p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={addProject}>
            Add
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={!selected || pendingDelete}
            onClick={removeSelected}
          >
            Delete
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No projects yet. Add one to start editing.</p>
      ) : (
        <div className="flex flex-wrap gap-1">
          {items.map((item) => (
            <Button
              key={item.id}
              type="button"
              size="sm"
              variant={item.id === selectedId ? "secondary" : "ghost"}
              className="max-w-full truncate"
              onClick={() => onSelect(item.id)}
            >
              {item.title || "Untitled"}
            </Button>
          ))}
        </div>
      )}

      {selected ? (
        <form
          action={(formData) => {
            formData.set("id", String(selected.id));
            formData.set("title", selected.title);
            formData.set("description", selected.description);
            formData.set("stack", selected.stack.join(", "));
            formData.set("image", selected.image);
            formData.set("href", selected.href);
            formData.set("repo", selected.repo);
            formData.set("showOnSite", selected.showOnSite ? "on" : "");
            formData.set("showOnResume", selected.showOnResume ? "on" : "");
            action(formData);
          }}
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <ProjectImageField
              image={selected.image}
              disabled={imageBusy || pending}
              onImageChange={(image) => patchSelected({ image })}
              onImageClear={() => patchSelected({ image: "" })}
              onError={setImageError}
              onBusyChange={setImageBusy}
            />
            {imageBusy ? (
              <p className="text-sm text-muted-foreground">Compressing image…</p>
            ) : null}
            {imageError ? (
              <Alert variant="destructive">
                <AlertDescription>{imageError}</AlertDescription>
              </Alert>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-title">Title</Label>
            <Input
              id="project-title"
              required
              className="h-10"
              value={selected.title}
              onChange={(event) => patchSelected({ title: event.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              required
              rows={4}
              value={selected.description}
              onChange={(event) => patchSelected({ description: event.target.value })}
            />
          </div>
          <ProjectStackField
            skills={skills}
            value={selected.stack}
            onChange={(stack) => patchSelected({ stack })}
          />
          <div className="grid gap-2">
            <Label htmlFor="project-href">Live URL</Label>
            <Input
              id="project-href"
              className="h-10"
              placeholder="https://"
              value={selected.href}
              onChange={(event) => patchSelected({ href: event.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-repo">Repo URL</Label>
            <Input
              id="project-repo"
              className="h-10"
              placeholder="https://"
              value={selected.repo}
              onChange={(event) => patchSelected({ repo: event.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label className="font-normal">
              <Checkbox
                checked={selected.showOnSite}
                onCheckedChange={(checked) => patchSelected({ showOnSite: checked === true })}
              />
              Show on homepage
            </Label>
            <Label className="font-normal">
              <Checkbox
                checked={selected.showOnResume}
                onCheckedChange={(checked) => patchSelected({ showOnResume: checked === true })}
              />
              Show on resume
            </Label>
            <p className="text-xs text-muted-foreground">
              Uncheck homepage to hide from the public site. Check resume to include it in the live
              preview.
            </p>
          </div>
          <Status state={state} />
          {deleteError ? (
            <Alert variant="destructive">
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          ) : null}
          <Button type="submit" disabled={pending || imageBusy} className="h-10 w-fit">
            {pending ? "Saving…" : selected.id < 1 ? "Add project" : "Save project"}
          </Button>
        </form>
      ) : null}
    </div>
  );
}

function Status({ state }: { state: StudioState | null | undefined }) {
  if (state?.error) {
    return (
      <Alert
        variant="destructive"
        className="border-destructive/25 bg-destructive/8 px-3 py-2.5 shadow-sm"
      >
        <CircleAlertIcon className="size-4" />
        <AlertTitle className="text-destructive">Couldn’t save</AlertTitle>
        <AlertDescription>{state.error}</AlertDescription>
      </Alert>
    );
  }
  if (state?.message) {
    return (
      <Alert className="border-emerald-500/25 bg-emerald-500/8 px-3 py-2.5 text-emerald-950 shadow-sm dark:text-emerald-50">
        <CheckCircle2Icon className="size-4 text-emerald-600 dark:text-emerald-400" />
        <AlertTitle className="text-emerald-800 dark:text-emerald-200">Saved</AlertTitle>
        <AlertDescription className="text-emerald-800/80 dark:text-emerald-100/80">
          {state.message}
        </AlertDescription>
      </Alert>
    );
  }
  return null;
}
