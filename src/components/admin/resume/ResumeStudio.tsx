"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import {
  deleteStudioProject,
  deleteStudioSkill,
  deleteStudioTimelineEntry,
  saveStudioProfile,
  saveStudioProject,
  saveStudioSkill,
  saveStudioTimelineEntry,
  type StudioState,
} from "@/app/admin/resume/actions";
import { ResumePreview } from "@/components/admin/resume/ResumePreview";
import { nextTempId, type ResumeDraft, type ResumeTab } from "@/components/admin/resume/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { parseProfilePhotoShape } from "@/lib/profile-photo";
import { skillIconOptions } from "@/lib/skill-icons";
import { cn } from "@/lib/utils";

const initialStudio: StudioState = { error: "", message: "" };

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
  const [selected, setSelected] = useState<Record<TimelineKind | "skill" | "project", number | null>>({
    work: initial.experience[0]?.id ?? null,
    education: initial.education[0]?.id ?? null,
    certificate: initial.certificates[0]?.id ?? null,
    skill: initial.skills[0]?.id ?? null,
    project: initial.projects[0]?.id ?? null,
  });

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
      <div className="min-w-0">
        <Tabs defaultValue={initialTab}>
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
              selectedId={selected.project}
              onSelect={(id) => setSelected((prev) => ({ ...prev, project: id }))}
              onChangeItems={(items) => setDraft((prev) => ({ ...prev, projects: items }))}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex min-w-0 max-h-[min(85vh,calc(100dvh-8rem))] flex-col lg:sticky lg:top-20 lg:h-[calc(100dvh-5.5rem)] lg:max-h-[calc(100dvh-5.5rem)]">
        <p className="mb-3 shrink-0 text-sm text-muted-foreground">Live preview</p>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
          <ResumePreview draft={draft} />
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
          ["resume", "Resume path", "text"],
          ["githubUsername", "GitHub username", "text"],
        ] as const
      ).map(([key, label, type]) => (
        <div key={key} className="grid gap-2">
          <Label htmlFor={`resume-${key}`}>{label}</Label>
          <Input
            id={`resume-${key}`}
            name={key}
            type={type}
            required={key !== "github" && key !== "linkedin"}
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
  const selected = items.find((item) => item.id === selectedId) ?? null;

  useEffect(() => {
    if (state.id && selectedId !== null && selectedId < 1) {
      onChangeItems(items.map((item) => (item.id === selectedId ? { ...item, id: state.id! } : item)));
      onSelect(state.id);
    }
    // Only sync when save returns a new id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.id]);

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
    };
    onChangeItems([...items, entry]);
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
              {item.title || "Untitled"}
            </Button>
          ))}
        </div>
      )}

      {selected ? (
        <form action={action} className="grid gap-4">
          <input type="hidden" name="id" value={selected.id} />
          <input type="hidden" name="kind" value={kind} />
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
              name="period"
              required
              className="h-10"
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
  selectedId,
  onSelect,
  onChangeItems,
}: {
  items: StoredProject[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  onChangeItems: (items: StoredProject[]) => void;
}) {
  const [state, action, pending] = useActionState(saveStudioProject, initialStudio);
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
      mark: "",
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
            formData.set("mark", selected.mark);
            formData.set("href", selected.href);
            formData.set("repo", selected.repo);
            formData.set("showOnSite", selected.showOnSite ? "on" : "");
            formData.set("showOnResume", selected.showOnResume ? "on" : "");
            action(formData);
          }}
          className="grid gap-4"
        >
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
          <div className="grid gap-2">
            <Label htmlFor="project-stack">Stack</Label>
            <Input
              id="project-stack"
              className="h-10"
              placeholder="Laravel, MySQL"
              value={selected.stack.join(", ")}
              onChange={(event) =>
                patchSelected({
                  stack: event.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-image">Image path</Label>
            <Input
              id="project-image"
              className="h-10"
              placeholder="/projects/example.png"
              value={selected.image}
              onChange={(event) => patchSelected({ image: event.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-mark">Mark</Label>
            <Input
              id="project-mark"
              className="h-10"
              placeholder="ILMS"
              value={selected.mark}
              onChange={(event) => patchSelected({ mark: event.target.value })}
            />
          </div>
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
          <Button type="submit" disabled={pending} className="h-10 w-fit">
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
      <Alert variant="destructive">
        <AlertDescription>{state.error}</AlertDescription>
      </Alert>
    );
  }
  if (state?.message) {
    return (
      <Alert>
        <AlertDescription>{state.message}</AlertDescription>
      </Alert>
    );
  }
  return null;
}
