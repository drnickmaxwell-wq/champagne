import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import {
collectCssFiles, materialOwnershipErrors, parseCssDeclarations as guardParser,
parseCssDefinitions, timeOfDayCanvasOwnerErrors,
} from "../packages/champagne-guards/scripts/guard-surface-semantics.mjs";
import { parseCssDeclarations as sharedParser } from "../packages/champagne-tokens/scripts/css-declarations.v1.mjs";
import {
GENERATED_CSS_RELATIVE_PATH as GC, GENERATED_TS_RELATIVE_PATH as GT,
PRIMITIVES_RELATIVE_PATH as PR, SOURCE_RELATIVE_PATH as SR,
checkGenerated, renderMaterial, stableStringify, writeGenerated,
} from "../packages/champagne-tokens/scripts/generate-critical-paint.v1.mjs";
const root=path.resolve(import.meta.dirname,"..");
const read=(file)=>readFile(path.join(root,file),"utf8");
const source=JSON.parse(await read(SR));
const primitive=await read(PR);
const generated=await read(GC);
const tokens=await read("packages/champagne-tokens/styles/champagne/tokens.css");
const timeCss=await read("packages/champagne-tokens/styles/champagne/time-of-day.css");
const rendered=renderMaterial(source,primitive);
const protectedTokens=["--ink","--brand-teal","--brand-magenta","--smh-white","--ink-100","--brand-gold","--brand-gold-keyline","--smh-ink-navy","--brand-ink","--surface-canvas","--bg-ink","--text-ink-high"];
const clone=(value)=>JSON.parse(JSON.stringify(value));
const escaped=(token)=>`--\\${token[2].codePointAt(0).toString(16)} ${token.slice(3)}`;
const split=(token)=>`${token.slice(0,3)}/**/${token.slice(3)}`;
const baseline=(extra=[])=>new Map([
["packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css",primitive],
["packages/champagne-tokens/styles/champagne/canvas-material.generated.css",generated],
["packages/champagne-tokens/styles/champagne/tokens.css",tokens],
["packages/champagne-tokens/styles/champagne/time-of-day.css",timeCss],...extra,
]);
const ownership=(css)=>materialOwnershipErrors({cssSources:baseline([["apps/web/app/adversarial.module.css",css]]),materialSource:source,renderedMaterial:rendered}).join("\n");
async function tempRepo(sourceValue=source,primitiveValue=primitive){
const dir=await mkdtemp(path.join(tmpdir(),"champagne-critical-paint-"));
for(const file of [SR,PR,GC,GT]) await mkdir(path.dirname(path.join(dir,file)),{recursive:true});
await writeFile(path.join(dir,SR),`${JSON.stringify(sourceValue,null,2)}\n`);
await writeFile(path.join(dir,PR),primitiveValue);
return dir;
}
test("current material renders byte-stable loaded and critical outputs",()=>{
const a=renderMaterial(source,primitive),b=renderMaterial(clone(source),primitive);
assert.equal(a.css,b.css); assert.equal(a.ts,b.ts);
assert.match(a.css,/--surface-canvas: var\(--brand-ink\)/);
assert.match(a.ts,/export const champagneCriticalPaintCss/);
assert.doesNotMatch(a.ts,/\bimport\s|\brequire\s*\(/);
assert.deepEqual(a.documentStyle,{background:"var(--surface-canvas)",color:"var(--text-ink-high)"});
assert.equal(Object.keys(a.documentStyle).some((key)=>key.startsWith("--")),false);
});
test("semantic source changes alter both generated outputs",()=>{
const changed=clone(source),canvas=changed.nodes.find((node)=>node.id==="canvas");
canvas.left.weight=91; canvas.right.weight=9;
const before=renderMaterial(source,primitive),after=renderMaterial(changed,primitive);
assert.notEqual(after.css,before.css); assert.notEqual(after.ts,before.ts);
});
test("unknown keys fail closed",()=>{ const changed=clone(source); changed.unexpected=true; assert.throws(()=>renderMaterial(changed,primitive),/unknown key/); });
test("material status and final-selection truth fail closed together",()=>{
const a=clone(source); a.status="FINAL_PERSIAN_MIDNIGHT_SELECTED"; assert.throws(()=>renderMaterial(a,primitive),/MATERIAL_STATUS/);
const b=clone(source); b.finalPersianMidnightSelection=true; assert.throws(()=>renderMaterial(b,primitive),/PERSIAN_MIDNIGHT_AUTHORITY/);
});
test("SHARED_CSS_PARSER_AUTHORITY: generator and guard expose one parser implementation",()=>assert.equal(guardParser,sharedParser));
test("CSS_DECLARATION_PARSER_BYPASS: encoded generated-token owners fail closed",()=>{
const cases=[":root{--surface-canvas/**/: var(--surface-1);}",".card{--surface/**/-canvas: var(--surface-1);}",String.raw`@media (min-width:1px){:root{--surface-\63 anvas:var(--surface-1)}}`,String.raw`.card{--\73 urface-canvas:var(--surface-1)}`,String.raw`.card{--surface\2d canvas:var(--surface-1)}`];
for(const css of cases) assert.deepEqual(parseCssDefinitions(css,"--surface-canvas"),["var(--surface-1)"]);
assert.deepEqual(parseCssDefinitions(':root{content:"--surface-canvas/**/: var(--surface-1);"}',"--surface-canvas"),[]);
});
test("CSS_BRACE_COMPONENT_RECOVERY: matched custom-property braces do not close the rule",()=>assert.deepEqual(parseCssDefinitions(":root{--decoy:{x:y};--surface-canvas:var(--surface-1)}","--surface-canvas"),["var(--surface-1)"]));
test("CSS_BAD_STRING_RECOVERY: newline recovery cannot swallow a following owner",()=>assert.deepEqual(parseCssDefinitions(`:root{--decoy:"bad\n;--surface-canvas:var(--surface-1);/* " */}`,"--surface-canvas"),["var(--surface-1)"]));
test("MATERIAL_OWNER_UNAPPROVED: every protected owner rejects a later competing declaration",()=>{
for(const token of protectedTokens){ const issues=ownership(`:root{${token}:var(--surface-1)}`); assert.match(issues,new RegExp(`MATERIAL_OWNER_UNAPPROVED.*${token}`)); assert.match(issues,/adversarial\.module\.css/); }
});
test("MATERIAL_OWNER_UNAPPROVED: escaped protected owner spellings are decoded",()=>{
for(const token of protectedTokens) assert.match(ownership(`:root{${escaped(token)}:var(--surface-1)}`),new RegExp(`MATERIAL_OWNER_UNAPPROVED.*${token}`));
});
test("MATERIAL_OWNER_UNAPPROVED: comment-separated protected owner spellings are decoded",()=>{
for(const token of protectedTokens) assert.match(ownership(`:root{${split(token)}:var(--surface-1)}`),new RegExp(`MATERIAL_OWNER_UNAPPROVED.*${token}`));
});
test("malformed or unsupported CSS fails closed instead of producing an empty owner set",()=>{
assert.throws(()=>sharedParser(":root{--decoy:calc((1px);}"),/unbalanced CSS component value|unbalanced CSS block/);
assert.match(ownership(":root{--surface-canvas:var(--surface-1);"),/CSS_DECLARATION_PARSE/);
});
test("PRIMITIVE_OWNER_ESCAPE_BYPASS: every literal primitive uses decoded CSS ownership",()=>{
const escapedOnly=primitive.replace("--ink:  #0B0D0F;",`${escaped("--ink")}: #0B0D0F;`);
assert.notEqual(escapedOnly,primitive); assert.doesNotThrow(()=>renderMaterial(source,escapedOnly));
for(const node of source.nodes.filter((item)=>item.type==="literal")){
const duplicate=`${primitive}\n:root{${escaped(node.token)}:${node.value}}`;
assert.throws(()=>renderMaterial(source,duplicate),(error)=>error instanceof Error&&error.message.includes(`[PRIMITIVE_OWNER_INVALID] ${node.token}`));
}
assert.throws(()=>renderMaterial(source,`${primitive}\n:root{--in/**/k:#0B0D0F}`),/PRIMITIVE_OWNER_INVALID/);
assert.throws(()=>renderMaterial(source,`${primitive}\n:root{--ink:#0B0D0F;`),/CSS parse failed/);
});
test("TIME_OF_DAY_OWNER_EXEMPTION: only the three exact theme owners are accepted",()=>{
assert.deepEqual(timeOfDayCanvasOwnerErrors(timeCss),[]);
assert.match(timeOfDayCanvasOwnerErrors(`${timeCss}\n:root{--surface-canvas:var(--surface-1)}`).join("\n"),/TIME_OF_DAY_CANVAS_OWNERS/);
assert.match(timeOfDayCanvasOwnerErrors(`${timeCss}\n:root[data-theme='night']{--surface-canvas:var(--ink-100)}`).join("\n"),/TIME_OF_DAY_CANVAS_OWNERS/);
});
test("CSS_SYMLINK_UNAPPROVED: protected CSS trees reject file and directory symlinks",async(t)=>{
const dir=await mkdtemp(path.join(tmpdir(),"champagne-css-symlink-")); t.after(()=>rm(dir,{recursive:true,force:true}));
const fileTree=path.join(dir,"file-tree"),nested=path.join(fileTree,"nested"); await mkdir(nested,{recursive:true});
await writeFile(path.join(fileTree,"owner.css"),":root{--surface-canvas:var(--surface-1)}\n");
await symlink("../owner.css",path.join(nested,"linked.module.css"),"file");
assert.throws(()=>collectCssFiles(fileTree,fileTree),/\[CSS_SYMLINK_UNAPPROVED\] nested[\\/]linked\.module\.css/);
const directoryTree=path.join(dir,"directory-tree"),real=path.join(directoryTree,"real"); await mkdir(real,{recursive:true});
await writeFile(path.join(real,"owner.css"),":root{--ink:#000000}\n"); await symlink("real",path.join(directoryTree,"linked"),"dir");
assert.throws(()=>collectCssFiles(directoryTree,directoryTree),/\[CSS_SYMLINK_UNAPPROVED\] linked/);
});
test("missing references and cycles fail deterministically",()=>{
const missing=clone(source); missing.outputs.canvas="missingNode"; assert.throws(()=>renderMaterial(missing,primitive),/REF_MISSING/);
const cyclic=clone(source); cyclic.nodes.find((node)=>node.id==="canvas").left.ref="canvas"; assert.throws(()=>renderMaterial(cyclic,primitive),/REF_CYCLE/);
});
test("transparent canvas and primitive drift fail closed",()=>{
const transparent=clone(source),node=transparent.nodes.find((item)=>item.id==="transparent"); node.id="clear"; transparent.outputs.canvas="clear";
assert.throws(()=>renderMaterial(transparent,primitive),/CANVAS_OPACITY/);
assert.throws(()=>renderMaterial(source,primitive.replace("#40C4B4","#40C4B5")),/PRIMITIVE_DRIFT/);
});
test("write mode is deterministic and check mode detects manual drift",async(t)=>{
const dir=await tempRepo(); t.after(()=>rm(dir,{recursive:true,force:true}));
const first=await writeGenerated(dir); await checkGenerated(dir);
const firstCss=await readFile(path.join(dir,GC),"utf8"),firstTs=await readFile(path.join(dir,GT),"utf8");
const second=await writeGenerated(dir); assert.equal(second.css,first.css); assert.equal(second.ts,first.ts);
assert.equal(await readFile(path.join(dir,GC),"utf8"),firstCss); assert.equal(await readFile(path.join(dir,GT),"utf8"),firstTs);
await writeFile(path.join(dir,GC),`${firstCss}/* manual drift */\n`); await assert.rejects(()=>checkGenerated(dir),/GENERATED_DRIFT/);
});
test("stable source serialization is independent of object key order",()=>assert.equal(stableStringify({b:2,a:1}),stableStringify({a:1,b:2})));
