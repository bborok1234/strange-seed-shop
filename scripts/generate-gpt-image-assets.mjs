import fs from "node:fs";
import path from "node:path";

const promptsPath = "assets/source/asset_prompts.json";
const styleBiblePath = "assets/source/asset_style_bible.json";
const provenancePath = "assets/source/gpt_image_asset_provenance.json";
const generatedRoot = "assets/source/generated/gpt-image";
const apiUrl = "https://api.openai.com/v1/images/generations";

const args = new Set(process.argv.slice(2));
const getArgValue = (name) => {
  const prefix = `${name}=`;
  return process.argv.slice(2).find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
};

const dryRun = args.has("--dry-run");
const codexFallback = args.has("--codex-fallback");
const force = args.has("--force");
const requestedAssetId = getArgValue("--asset-id");
loadDotEnv(".env");

const model = process.env.SEED_ASSET_IMAGE_MODEL || "gpt-image-2";
const size = process.env.SEED_ASSET_IMAGE_SIZE || "1024x1024";
const quality = process.env.SEED_ASSET_IMAGE_QUALITY || "high";
const background = process.env.SEED_ASSET_IMAGE_BACKGROUND || "transparent";
const apiKey = process.env.OPENAI_API_KEY;

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;
    if (process.env[key]) {
      continue;
    }

    process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(`${filePath}.tmp`, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(`${filePath}.tmp`, filePath);
}

function ensurePngOutput(prompt) {
  if (!/\.png$/i.test(prompt.output_path)) {
    throw new Error(`${prompt.asset_id} output_path must be PNG for game graphics: ${prompt.output_path}`);
  }
}

function buildPrompt(prompt, styleBible) {
  return [
    `Project style anchor: ${styleBible.style_anchor}`,
    `Family motifs: ${JSON.stringify(styleBible.family_motifs)}`,
    prompt.prompt,
    "Output requirement: game-ready raster PNG, transparent or alpha-ready background, no text, no watermark, no logo.",
    "Consistency requirement: match the existing 이상한 씨앗상회 reference assets, especially the listed style bible reference_asset_ids."
  ].join("\n\n");
}

async function generate(prompt, styleBible) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      prompt: buildPrompt(prompt, styleBible),
      size,
      quality,
      background,
      n: 1
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message ?? JSON.stringify(payload);
    throw new Error(`OpenAI image generation failed for ${prompt.asset_id}: ${message}`);
  }

  const b64 = payload?.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error(`OpenAI image generation response missing data[0].b64_json for ${prompt.asset_id}`);
  }

  return Buffer.from(b64, "base64");
}

if (!dryRun && !apiKey) {
  console.error(
    JSON.stringify(
      {
        ok: false,
        blocked: true,
        reason: "OPENAI_API_KEY is required for GPT Image asset generation",
        set: "export OPENAI_API_KEY=...",
        modelEnv: "SEED_ASSET_IMAGE_MODEL",
        currentModel: model
      },
      null,
      2
    )
  );
  process.exit(1);
}

const promptsDoc = readJson(promptsPath);
const styleBible = readJson(styleBiblePath);
const prompts = (promptsDoc.prompts ?? []).filter((prompt) => !requestedAssetId || prompt.asset_id === requestedAssetId);

if (requestedAssetId && prompts.length === 0) {
  throw new Error(`asset prompt not found: ${requestedAssetId}`);
}

const provenance = fs.existsSync(provenancePath)
  ? readJson(provenancePath)
  : {
      version: "phase0-v1",
      provider: "openai_images_api",
      model,
      source_prompts: promptsPath,
      style_bible: styleBiblePath,
      records: []
    };

const completed = [];
const skipped = [];

for (const prompt of prompts) {
  ensurePngOutput(prompt);
  if (!force && fs.existsSync(prompt.output_path) && fs.statSync(prompt.output_path).size > 0) {
    skipped.push(prompt.asset_id);
    continue;
  }

  const rawDir = path.join(generatedRoot, prompt.asset_id);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const rawPath = path.join(rawDir, `${timestamp}.png`);

  if (dryRun) {
    completed.push({ asset_id: prompt.asset_id, dry_run: true, output_path: prompt.output_path, raw_output_path: rawPath });
    continue;
  }

  let bytes;
  try {
    bytes = await generate(prompt, styleBible);
  } catch (error) {
    const fallbackAllowed = isRecoverableApiBlocker(error.message);
    const record = {
      asset_id: prompt.asset_id,
      provider: "openai_images_api",
      model,
      source_prompt_path: promptsPath,
      style_bible_path: styleBiblePath,
      accepted_output_path: prompt.output_path,
      generated_at: new Date().toISOString(),
      status: fallbackAllowed ? "blocked_codex_native_fallback_required" : "blocked",
      blocker: error.message,
      fallback: fallbackAllowed
        ? {
            provider: "codex_native_image_generation",
            required: true,
            output_path: prompt.output_path,
            rule: "Use Codex image generation to create raster PNG only; SVG/vector/code-native drawings remain rejected."
          }
        : undefined,
      style_reference_asset_ids: styleBible.reference_asset_ids
    };
    provenance.records = [...(provenance.records ?? []).filter((item) => item.asset_id !== prompt.asset_id), record];
    provenance.model = model;
    provenance.updated_at = new Date().toISOString();
    writeJson(provenancePath, provenance);
    console.error(
      JSON.stringify(
        {
          ok: false,
          blocked: true,
          fallbackRequired: fallbackAllowed,
          asset_id: prompt.asset_id,
          model,
          blocker: error.message,
          next:
            fallbackAllowed && !codexFallback
              ? "Use Codex native image generation fallback and save the raster PNG to output_path, then rerun provenance/style checks."
              : undefined
        },
        null,
        2
      )
    );
    process.exit(1);
  }

  fs.mkdirSync(rawDir, { recursive: true });
  fs.writeFileSync(rawPath, bytes);
  fs.mkdirSync(path.dirname(prompt.output_path), { recursive: true });
  fs.copyFileSync(rawPath, prompt.output_path);

  const record = {
    asset_id: prompt.asset_id,
    provider: "openai_images_api",
    model,
    source_prompt_path: promptsPath,
    style_bible_path: styleBiblePath,
    raw_output_path: rawPath,
    accepted_output_path: prompt.output_path,
    generated_at: new Date().toISOString(),
    review_required: true,
    style_reference_asset_ids: styleBible.reference_asset_ids
  };
  provenance.records = [...(provenance.records ?? []).filter((item) => item.asset_id !== prompt.asset_id), record];
  completed.push(record);
}

if (!dryRun) {
  provenance.model = model;
  provenance.updated_at = new Date().toISOString();
  writeJson(provenancePath, provenance);
}

console.log(JSON.stringify({ ok: true, dryRun, model, size, quality, background, completed, skipped }, null, 2));

function isRecoverableApiBlocker(message) {
  return /quota|credit|billing|rate limit|organization must be verified|verified to use the model|insufficient_quota|429|403/i.test(message);
}
