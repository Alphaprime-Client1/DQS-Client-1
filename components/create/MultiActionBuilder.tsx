"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Link2, FileText, Image, X } from "lucide-react";

export interface Action {
  label: string;
  type: "link" | "text" | "image";
  value: string;
}

interface MultiActionBuilderProps {
  title: string;
  actions: Action[];
  onTitleChange: (title: string) => void;
  onActionsChange: (actions: Action[]) => void;
}

const actionTypeIcons = { link: Link2, text: FileText, image: Image };

export function MultiActionBuilder({
  title,
  actions,
  onTitleChange,
  onActionsChange,
}: MultiActionBuilderProps) {
  const addAction = () => {
    onActionsChange([...actions, { label: "", type: "link", value: "" }]);
  };

  const removeAction = (index: number) => {
    onActionsChange(actions.filter((_, i) => i !== index));
  };

  const updateAction = (index: number, key: keyof Action, value: string) => {
    const updated = [...actions];
    updated[index] = { ...updated[index], [key]: value };
    onActionsChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Page Title</Label>
        <div className="relative group/input">
          <Input
            placeholder="Choose an option"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="pr-10 rounded-xl"
          />
          {title && (
            <button
              type="button"
              onClick={() => onTitleChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
              aria-label="Clear Title"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Buttons ({actions.length})</Label>
        {actions.map((action, index) => {
          const Icon = actionTypeIcons[action.type] || Link2;
          return (
            <div
              key={index}
              className="flex gap-2 items-start p-3 border border-border rounded-xl bg-muted/30 hover:border-primary/30 transition-colors"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground mt-2 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="relative group/input">
                  <Input
                    placeholder="Button label"
                    value={action.label}
                    onChange={(e) => updateAction(index, "label", e.target.value)}
                    className="h-8 text-sm pr-8 rounded-lg"
                  />
                  {action.label && (
                    <button
                      type="button"
                      onClick={() => updateAction(index, "label", "")}
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                      aria-label="Clear Label"
                    >
                      <X className="w-3" />
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Select
                    value={action.type}
                    onValueChange={(v) => updateAction(index, "type", v)}
                  >
                    <SelectTrigger className="h-8 text-sm w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="link">Link</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative flex-1 group/input">
                    <Input
                      placeholder={
                        action.type === "link"
                          ? "https://..."
                          : action.type === "image"
                          ? "Image URL..."
                          : "Your message..."
                      }
                      value={action.value}
                      onChange={(e) => updateAction(index, "value", e.target.value)}
                      className="h-8 text-sm flex-1 pr-8 rounded-lg"
                    />
                    {action.value && (
                      <button
                        type="button"
                        onClick={() => updateAction(index, "value", "")}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                        aria-label="Clear Value"
                      >
                        <X className="w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => removeAction(index)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          );
        })}

        <Button
          variant="outline"
          className="w-full gap-2 border-dashed hover:border-primary hover:text-primary"
          onClick={addAction}
          type="button"
        >
          <Plus className="w-4 h-4" />
          Add Button
        </Button>
      </div>
    </div>
  );
}
