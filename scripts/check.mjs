import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
import {config,locales} from '../content/site.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),dist=path.join(root,'dist'),m=JSON.parse(fs.readFileSync(path.join(dist,'build-manifest.json'),'utf8'));
const html=[];function walk(p){for(const e of fs.readdirSync(p,{withFileTypes:true})){const q=path.join(p,e.name);if(e.isDirectory())walk(q);else if(q.endsWith('.html'))html.push(q);}}walk(dist);
assert.equal(m.routes.length,10);assert.equal(html.length,12);assert.equal(m.activeStoreDownloadLinks,0);assert.equal(m.publicDeploymentPerformed,false);assert.equal(m.indexingEnabled,false);
const decode=v=>v.replaceAll('&amp;','&');let localRefs=0;
for(const f of html){const s=fs.readFileSync(f,'utf8');assert.match(s,/<html lang="(?:ko|en)">/);assert.match(s,/<meta name="viewport"/);assert.match(s,/<title>[^<]+<\/title>/);assert.match(s,/<meta name="robots" content="noindex/);assert.doesNotMatch(s,/https?:\/\/(?:apps\.apple\.com|play\.google\.com)/);assert.doesNotMatch(s,/<form\b|<iframe\b/);assert.doesNotMatch(s,/<script[^>]+src=/);assert.doesNotMatch(s,/google-analytics|googletagmanager|fonts\.google/);assert.doesNotMatch(s,/kor0225|kor-0225|6810864793|직업상담사|Career Counselor|kor0252|kor-0252|일반경비지도사|General Security Instructor|kor0253|kor-0253|기계경비지도사|Mechanical Security Instructor|glb0686|Tukes|Sähköturvallisuus/);
 for(const match of s.matchAll(/(?:href|src)="([^"]+)"/g)){let u=decode(match[1]);if(u.startsWith('#')||u.startsWith('mailto:')||u.startsWith(config.examUrl)||u===config.hostingPrivacyUrl)continue;if(u.startsWith(m.canonicalOrigin+m.basePath+'/'))u=u.slice(m.canonicalOrigin.length);else if(/^https?:/.test(u))throw Error('Unexpected external link '+u);assert.ok(u.startsWith(m.basePath+'/'),`Base path failed ${u}`);let rel=u.slice(m.basePath.length+1);if(rel.endsWith('/'))rel+='index.html';assert.ok(fs.existsSync(path.join(dist,rel)),`${f}: missing ${rel}`);localRefs++;}
 if(!f.endsWith('/404.html')&&!f.endsWith('/dist/index.html')){assert.match(s,/<link rel="canonical" href="http/);assert.match(s,/hreflang="ko"/);assert.match(s,/hreflang="en"/);assert.match(s,/hreflang="x-default"/);assert.match(s,/<a class="skip" href="#main">/);assert.match(s,/<main id="main"/);const json=s.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);assert.ok(json);const j=JSON.parse(json[1]);assert.equal(j['@type'],'WebPage');assert.equal(j.publisher.name,'RushLabs');assert.equal(j.offers,undefined);assert.equal(j.aggregateRating,undefined);}
}
for(const l of locales){const s=fs.readFileSync(path.join(dist,l,'index.html'),'utf8');assert.match(s,/disabled aria-describedby="launch-note"/);assert.ok(l==='ko'?s.includes('실제 앱 화면이 아닙니다'):s.includes('not a screenshot'));assert.ok(l==='ko'?s.includes('한국어로 제공됩니다'):s.includes('are in Korean'));assert.ok(!s.includes('Lock50'));}
const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');assert.match(css,/word-break:keep-all/);assert.match(css,/:focus-visible/);assert.match(css,/prefers-reduced-motion/);assert.match(css,/@media\(max-width:370px\)/);
const xml=fs.readFileSync(path.join(dist,'sitemap.xml'),'utf8');assert.equal([...xml.matchAll(/<loc>/g)].length,10);assert.ok(!xml.includes('/404'));assert.match(fs.readFileSync(path.join(dist,'robots.txt'),'utf8'),/Disallow: \//);
console.log(JSON.stringify({status:'PASS_LOCAL_STATIC_SCOPE_LINK_SEO_BASEPATH',htmlFiles:12,localizedRoutes:10,localReferenceChecks:localRefs,storeDownloadLinks:0,trackingScripts:0,publicUrlConfigured:m.publicSiteUrl}));

// Exact K254 prelaunch content guards, in addition to inherited static checks.
const koGuide=fs.readFileSync(path.join(dist,'ko/study-guide/index.html'),'utf8');
const enGuide=fs.readFileSync(path.join(dist,'en/study-guide/index.html'),'utf8');
assert.equal(config.serviceId,'kor-0254');
assert.equal(config.repoName,'agricultural-quality-manager-study-web');
assert.equal(config.examUrl,'https://www.q-net.or.kr/site/nongsanmul');
assert.ok(koGuide.includes('총 100문항·120분'));
assert.ok(koGuide.includes('80분'));
assert.ok(koGuide.includes('단답형·서술형'));
assert.ok(koGuide.includes('2026'));
assert.ok(enGuide.includes('100 questions in total, 120 minutes'));
for(const f of html){const s=fs.readFileSync(f,'utf8');assert.doesNotMatch(s,/44,000|44000|₩|KRW|500개|500문항|500 questions|Lock50/);}
for(const l of locales){const s=fs.readFileSync(path.join(dist,l,'support/index.html'),'utf8');assert.ok(s.includes('kor-0254'));assert.ok(s.includes('app.mcyj.examprep.kor0254'));}
console.log(JSON.stringify({exactK254:true,examCycle:2026,firstStage100in120:true,secondStageWritten80:true,unverifiedMarketingClaims:0}));
