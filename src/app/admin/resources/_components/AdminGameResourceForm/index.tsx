"use client";

import { RESOURCE_CATEGORIES, RESOURCE_VISIBILITY, ResourceCategory, ResourceVisibility } from "@/lib/types/custom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Markdown } from "@/components/Markdown";

const schema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  body: z.string().optional(),
  category: z.enum([...RESOURCE_CATEGORIES]),
  visibility: z.enum([...RESOURCE_VISIBILITY]),
  pinned: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<FormValues>;
  onSaved?: () => void;
}

export default function AdminGameResourceForm({ defaultValues, onSaved }: Props) {
  const [previewing, setPreviewing] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      category: "misc",
      visibility: "members",
      pinned: false,
      ...defaultValues,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    const res = await fetch(values.id ? `/api/admin/resources/${values.id}` : "/api/admin/resources", {
      method: values.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      toast.error("Failed to save resource");
      return;
    }

    toast.success("Resource saved");
    form.reset();
    onSaved?.();
  });

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">
          {form.watch("id") ? "Edit" : "Create"} Resource
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input {...form.register("title")} />
          </div>
          <div>
            <Label>Body (Markdown)</Label>
            <Textarea rows={6} {...form.register("body")} />
            <Button type="button" variant="link" onClick={() => setPreviewing((p) => !p)}>
              {previewing ? "Hide Preview" : "Show Preview"}
            </Button>
            {previewing && (
              <div className="prose border rounded p-2 mt-2">
                <Markdown>{form.watch("body") || ""}</Markdown>
              </div>
            )}
          </div>
          <div>
            <Label>Category</Label>
            <Select value={form.watch("category")} onValueChange={(val) => form.setValue("category", val as ResourceCategory)}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                {[...RESOURCE_CATEGORIES].map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Visibility</Label>
            <Select value={form.watch("visibility")} onValueChange={(val) => form.setValue("visibility", val as ResourceVisibility)}>
              <SelectTrigger><SelectValue placeholder="Visibility" /></SelectTrigger>
              <SelectContent>
                {["public", "members", "gamemasters", "admins"].map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label>Pinned</Label>
            <Switch checked={form.watch("pinned")} onCheckedChange={(v) => form.setValue("pinned", v)} />
          </div>
          <Button type="submit">Save</Button>
        </form>
      </CardContent>
    </Card>
  );
}
