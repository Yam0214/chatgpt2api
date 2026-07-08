"use client";

import { Image, LoaderCircle, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useSettingsStore } from "../store";

const MODEL_OPTIONS = [
  { value: "gpt-5-5-thinking", label: "gpt-5-5-thinking（均衡/思考模式）" },
  { value: "gpt-5-3", label: "gpt-5-3" },
  { value: "gpt-5-5", label: "gpt-5-5" },
  { value: "auto", label: "auto（自动）" },
];

export function ImageModelCard() {
  const config = useSettingsStore((state) => state.config);
  const setImageModelField = useSettingsStore((state) => state.setImageModelField);
  const saveConfig = useSettingsStore((state) => state.saveConfig);
  const isSavingConfig = useSettingsStore((state) => state.isSavingConfig);
  const isLoadingConfig = useSettingsStore((state) => state.isLoadingConfig);

  const imageModel = (config?.image_model || {}) as Record<string, unknown>;
  const currentSlug = String(imageModel["gpt-image-2"] || "gpt-5-5-thinking");
  const fallbackEnabled = imageModel["fallback_enabled"] !== false;

  const handleSlugChange = (value: string) => {
    setImageModelField("gpt-image-2", value);
  };

  const handleFallbackToggle = (checked: boolean) => {
    setImageModelField("fallback_enabled", checked);
  };

  const handleSave = async () => {
    const saved = await saveConfig();
    if (saved) {
      toast.success("图片模型配置已保存");
    } else {
      toast.error("保存失败");
    }
  };

  if (isLoadingConfig) {
    return (
      <Card className="rounded-2xl border-white/80 bg-white/90 shadow-sm">
        <CardContent className="flex items-center justify-center p-10">
          <LoaderCircle className="size-5 animate-spin text-stone-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-white/80 bg-white/90 shadow-sm">
      <CardContent className="space-y-6 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-stone-100">
              <Image className="size-5 text-stone-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">图片生成模型</h2>
              <p className="text-sm text-stone-500">
                配置 gpt-image-2 底层使用的模型 slug，以及生图失败是否自动轮询备用模型。
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">模型 slug</label>
            <Select value={currentSlug} onValueChange={handleSlugChange}>
              <SelectTrigger className="h-11 rounded-xl border-stone-200 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODEL_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-stone-400">
              当前使用 <code className="font-mono">{currentSlug}</code>。
              生图时请求会以这个 slug 发送给 ChatGPT 后端。
            </p>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3">
            <Checkbox checked={fallbackEnabled} onCheckedChange={handleFallbackToggle} />
            <div className="space-y-0.5">
              <div className="text-sm font-medium text-stone-800">生图失败自动轮询备用模型</div>
              <div className="text-xs text-stone-500">
                开启后如果当前 slug 生图失败，自动尝试 <code className="font-mono">gpt-5-3</code>、<code className="font-mono">gpt-5-5</code> 等备用 slug。
              </div>
            </div>
          </label>
        </div>

        <div className="flex justify-end">
          <Button
            className="h-10 rounded-xl bg-stone-950 px-5 text-white hover:bg-stone-800"
            onClick={() => void handleSave()}
            disabled={isSavingConfig}
          >
            {isSavingConfig ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
            保存
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
