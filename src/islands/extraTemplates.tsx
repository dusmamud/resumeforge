/* ================= 15 additional resume templates =================
   Each is a (data, t) => ReactElement renderer following the same contract
   as the built-in templates in BuilderApp.tsx. Explicit light colors so the
   dark page theme never leaks into the printed resume. */

import type { ReactElement } from 'react';
import type { ResumeData, Experience, Education } from './BuilderApp';
import type { Dict } from '../i18n/locales/en';

/* ---------- local helpers (mirrors BuilderApp.tsx) ---------- */

const fontFamilyFor = (f: ResumeData['font']): string =>
  f === 'poppins'
    ? "'Poppins','Inter',system-ui,sans-serif"
    : f === 'serif'
      ? "Georgia,'Times New Roman',serif"
      : "'Inter',system-ui,sans-serif";

const contactParts = (p: ResumeData['personal']): string[] =>
  [p.email, p.phone, p.location].filter(Boolean);

const descLines = (d: string): string[] =>
  d
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

const dateRange = (e: Experience, presentLabel: string): string => {
  const end = e.current ? presentLabel : e.end;
  if (e.start && end) return `${e.start} – ${end}`;
  return e.start || end;
};

function ExpBlock({ exp, presentLabel, dark }: { exp: Experience; presentLabel: string; dark?: boolean }) {
  return (
    <div className="mb-4 break-inside-avoid">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[14px] font-bold" style={{ color: '#111827' }}>
          {exp.jobTitle}
        </h3>
        <span className="shrink-0 text-[11px]" style={{ color: dark ? '#e5e7eb' : '#6b7280' }}>
          {dateRange(exp, presentLabel)}
        </span>
      </div>
      {exp.company && (
        <p className="text-[12px] font-medium" style={{ color: dark ? '#d1d5db' : '#4b5563' }}>
          {exp.company}
        </p>
      )}
      {descLines(exp.description).length > 0 && (
        <ul className="mt-1 list-disc pl-5 text-[13px] leading-relaxed" style={{ color: dark ? '#f3f4f6' : '#1f2937' }}>
          {descLines(exp.description).map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EduBlock({ edu, dark }: { edu: Education; dark?: boolean }) {
  return (
    <div className="mb-3 break-inside-avoid">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[13px] font-bold" style={{ color: dark ? '#ffffff' : '#111827' }}>
          {edu.degree}
        </h3>
        {edu.year && (
          <span className="shrink-0 text-[11px]" style={{ color: dark ? '#e5e7eb' : '#6b7280' }}>
            {edu.year}
          </span>
        )}
      </div>
      {edu.school && (
        <p className="text-[12px]" style={{ color: dark ? '#d1d5db' : '#4b5563' }}>
          {edu.school}
        </p>
      )}
    </div>
  );
}

const customSections = (data: ResumeData, heading: (s: string) => ReactElement) => (
  <>
    {data.customSections.map((s) => (
      <section key={s.id}>
        {s.title && heading(s.title)}
        {s.type === 'text' ? (
          <p style={{ color: '#1f2937' }}>{s.content}</p>
        ) : (
          <ul className="list-disc pl-5" style={{ color: '#1f2937' }}>
            {s.bullets.filter(Boolean).map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </section>
    ))}
  </>
);

/* ================= 1. EXECUTIVE ================= */

export function ResumeExecutive(data: ResumeData, t: Dict): ReactElement {
  const a = data.accent;
  const p = data.personal;
  const presentLabel = t.builder.experience.present;
  const heading = (text: string) => (
    <h2
      className="mb-3 mt-7 text-[13px] font-bold uppercase tracking-[0.2em]"
      style={{ color: '#111827' }}
    >
      {text}
    </h2>
  );
  return (
    <div style={{ fontFamily: fontFamilyFor(data.font), color: '#1a1a1a' }} className="p-10 text-[13px] leading-relaxed">
      <header className="border-b-4 pb-6 text-center" style={{ borderColor: a }}>
        {p.photo && data.showPhoto && (
          <img src={p.photo} alt="" className="mx-auto mb-4 h-24 w-24 rounded-full object-cover" />
        )}
        <h1 className="text-[36px] font-bold leading-tight tracking-tight" style={{ color: '#111827' }}>
          {p.fullName}
        </h1>
        {p.jobTitle && (
          <p className="mt-1 text-[16px] font-semibold uppercase tracking-[0.14em]" style={{ color: a }}>
            {p.jobTitle}
          </p>
        )}
        {contactParts(p).length > 0 && (
          <p className="mt-2 text-[12px]" style={{ color: '#4b5563' }}>
            {contactParts(p).join('   |   ')}
          </p>
        )}
      </header>

      {data.summary && (
        <section>
          {heading(t.builder.sections.summary)}
          <p className="text-[14px] leading-relaxed" style={{ color: '#1f2937' }}>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          {heading(t.builder.sections.experience)}
          {data.experience.map((e) => (
            <ExpBlock key={e.id} exp={e} presentLabel={presentLabel} />
          ))}
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          {heading(t.builder.sections.education)}
          {data.education.map((e) => (
            <EduBlock key={e.id} edu={e} />
          ))}
        </section>
      )}
      {data.skills.length > 0 && (
        <section>
          {heading(t.builder.sections.skills)}
          <p style={{ color: '#1f2937' }}>{data.skills.join('  ·  ')}</p>
        </section>
      )}
      {data.languages.length > 0 && (
        <section>
          {heading(t.builder.sections.languages)}
          <p style={{ color: '#1f2937' }}>{data.languages.join('  ·  ')}</p>
        </section>
      )}
      {customSections(data, heading)}
    </div>
  );
}

/* ================= 2. CORPORATE ================= */

export function ResumeCorporate(data: ResumeData, t: Dict): ReactElement {
  const a = data.accent;
  const p = data.personal;
  const presentLabel = t.builder.experience.present;
  const heading = (text: string) => (
    <h2
      className="mb-2 mt-6 px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em]"
      style={{ background: '#f3f4f6', color: '#111827', borderLeft: `4px solid ${a}` }}
    >
      {text}
    </h2>
  );
  return (
    <div style={{ fontFamily: fontFamilyFor(data.font), color: '#1a1a1a' }} className="p-8 text-[13px] leading-relaxed">
      <header className="flex items-center justify-between gap-6 border-b-2 border-gray-200 pb-5">
        <div>
          <h1 className="text-[30px] font-bold leading-tight" style={{ color: '#111827' }}>
            {p.fullName}
          </h1>
          {p.jobTitle && (
            <p className="mt-0.5 text-[14px] font-medium" style={{ color: a }}>
              {p.jobTitle}
            </p>
          )}
        </div>
        <div className="shrink-0 text-right text-[11px] leading-relaxed" style={{ color: '#4b5563' }}>
          {p.email && <p>{p.email}</p>}
          {p.phone && <p>{p.phone}</p>}
          {p.location && <p>{p.location}</p>}
        </div>
      </header>

      {data.summary && (
        <section>
          {heading(t.builder.sections.summary)}
          <p style={{ color: '#1f2937' }}>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          {heading(t.builder.sections.experience)}
          {data.experience.map((e) => (
            <ExpBlock key={e.id} exp={e} presentLabel={presentLabel} />
          ))}
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          {heading(t.builder.sections.education)}
          {data.education.map((e) => (
            <EduBlock key={e.id} edu={e} />
          ))}
        </section>
      )}
      {data.skills.length > 0 && (
        <section>
          {heading(t.builder.sections.skills)}
          <p style={{ color: '#1f2937' }}>{data.skills.join('  ·  ')}</p>
        </section>
      )}
      {data.languages.length > 0 && (
        <section>
          {heading(t.builder.sections.languages)}
          <p style={{ color: '#1f2937' }}>{data.languages.join('  ·  ')}</p>
        </section>
      )}
      {customSections(data, heading)}
    </div>
  );
}

/* ================= 3. ELEGANT ================= */

export function ResumeElegant(data: ResumeData, t: Dict): ReactElement {
  const a = data.accent;
  const p = data.personal;
  const presentLabel = t.builder.experience.present;
  const serif = "Georgia,'Times New Roman',serif";
  const heading = (text: string) => (
    <div className="mb-3 mt-7 text-center">
      <h2 className="text-[13px] font-bold uppercase tracking-[0.3em]" style={{ color: a }}>
        {text}
      </h2>
      <div className="mx-auto mt-1.5 flex items-center justify-center gap-2">
        <div className="h-px w-16" style={{ background: '#d1d5db' }} />
        <div className="h-1 w-1 rotate-45" style={{ background: a }} />
        <div className="h-px w-16" style={{ background: '#d1d5db' }} />
      </div>
    </div>
  );
  return (
    <div style={{ fontFamily: serif, color: '#1a1a1a' }} className="p-10 text-[13px] leading-relaxed">
      <header className="text-center">
        {p.photo && data.showPhoto && (
          <img src={p.photo} alt="" className="mx-auto mb-4 h-24 w-24 rounded-full object-cover ring-2 ring-offset-2" style={{ ['--tw-ring-color' as string]: a }} />
        )}
        <h1 className="text-[34px] font-normal leading-tight tracking-wide" style={{ color: '#111827' }}>
          {p.fullName}
        </h1>
        {p.jobTitle && (
          <p className="mt-1 text-[15px] italic" style={{ color: '#4b5563' }}>
            {p.jobTitle}
          </p>
        )}
        {contactParts(p).length > 0 && (
          <p className="mt-2 text-[12px] tracking-wide" style={{ color: '#6b7280' }}>
            {contactParts(p).join('  ·  ')}
          </p>
        )}
      </header>

      {data.summary && (
        <section>
          {heading(t.builder.sections.summary)}
          <p className="text-center italic" style={{ color: '#1f2937' }}>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          {heading(t.builder.sections.experience)}
          {data.experience.map((e) => (
            <ExpBlock key={e.id} exp={e} presentLabel={presentLabel} />
          ))}
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          {heading(t.builder.sections.education)}
          {data.education.map((e) => (
            <EduBlock key={e.id} edu={e} />
          ))}
        </section>
      )}
      {data.skills.length > 0 && (
        <section>
          {heading(t.builder.sections.skills)}
          <p className="text-center" style={{ color: '#1f2937' }}>{data.skills.join('  ·  ')}</p>
        </section>
      )}
      {data.languages.length > 0 && (
        <section>
          {heading(t.builder.sections.languages)}
          <p className="text-center" style={{ color: '#1f2937' }}>{data.languages.join('  ·  ')}</p>
        </section>
      )}
      {customSections(data, heading)}
    </div>
  );
}

/* ================= 4. SIDEBAR ================= */

export function ResumeSidebar(data: ResumeData, t: Dict): ReactElement {
  const a = data.accent;
  const p = data.personal;
  const presentLabel = t.builder.experience.present;
  const sideHeading = (text: string) => (
    <h2 className="mb-2 mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90">
      {text}
    </h2>
  );
  const mainHeading = (text: string) => (
    <h2
      className="mb-3 mt-6 border-b-2 pb-1 text-[13px] font-bold uppercase tracking-[0.12em]"
      style={{ borderColor: a, color: '#111827' }}
    >
      {text}
    </h2>
  );
  return (
    <div style={{ fontFamily: fontFamilyFor(data.font) }} className="flex min-h-full text-[13px] leading-relaxed">
      <aside className="w-[32%] shrink-0 p-6 text-white" style={{ background: a }}>
        {p.photo && data.showPhoto && (
          <img src={p.photo} alt="" className="mb-5 h-28 w-28 rounded-full border-4 border-white/30 object-cover" />
        )}
        <h1 className="text-[22px] font-bold leading-tight">{p.fullName}</h1>
        {p.jobTitle && <p className="mt-1 text-[13px] text-white/85">{p.jobTitle}</p>}
        <div className="mt-5 text-[12px] leading-relaxed text-white/90">
          {p.email && <p className="break-all">{p.email}</p>}
          {p.phone && <p>{p.phone}</p>}
          {p.location && <p>{p.location}</p>}
        </div>
        {data.skills.length > 0 && (
          <div>
            {sideHeading(t.builder.sections.skills)}
            <ul className="space-y-1 text-[12px] text-white/90">
              {data.skills.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>
        )}
        {data.languages.length > 0 && (
          <div>
            {sideHeading(t.builder.sections.languages)}
            <ul className="space-y-1 text-[12px] text-white/90">
              {data.languages.map((l, i) => (
                <li key={i}>• {l}</li>
              ))}
            </ul>
          </div>
        )}
      </aside>
      <main className="min-w-0 flex-1 p-7" style={{ color: '#1a1a1a', background: '#ffffff' }}>
        {data.summary && (
          <section>
            {mainHeading(t.builder.sections.summary)}
            <p style={{ color: '#1f2937' }}>{data.summary}</p>
          </section>
        )}
        {data.experience.length > 0 && (
          <section>
            {mainHeading(t.builder.sections.experience)}
            {data.experience.map((e) => (
              <ExpBlock key={e.id} exp={e} presentLabel={presentLabel} />
            ))}
          </section>
        )}
        {data.education.length > 0 && (
          <section>
            {mainHeading(t.builder.sections.education)}
            {data.education.map((e) => (
              <EduBlock key={e.id} edu={e} />
            ))}
          </section>
        )}
        {customSections(data, mainHeading)}
      </main>
    </div>
  );
}

/* ================= 5. BOLD HEADER ================= */

export function ResumeBoldHeader(data: ResumeData, t: Dict): ReactElement {
  const a = data.accent;
  const p = data.personal;
  const presentLabel = t.builder.experience.present;
  const heading = (text: string) => (
    <h2
      className="mb-2 mt-6 text-[12px] font-bold uppercase tracking-[0.16em]"
      style={{ color: a }}
    >
      {text}
    </h2>
  );
  return (
    <div style={{ fontFamily: fontFamilyFor(data.font), color: '#1a1a1a' }} className="text-[13px] leading-relaxed">
      <header className="flex items-center gap-6 p-8 text-white" style={{ background: a }}>
        {p.photo && data.showPhoto && (
          <img src={p.photo} alt="" className="h-24 w-24 shrink-0 rounded-lg border-2 border-white/40 object-cover" />
        )}
        <div className="min-w-0">
          <h1 className="text-[32px] font-bold leading-tight">{p.fullName}</h1>
          {p.jobTitle && <p className="mt-1 text-[15px] font-medium text-white/90">{p.jobTitle}</p>}
          {contactParts(p).length > 0 && (
            <p className="mt-1.5 text-[12px] text-white/85">{contactParts(p).join('  ·  ')}</p>
          )}
        </div>
      </header>
      <div className="bg-white p-8 pt-2">
        {data.summary && (
          <section>
            {heading(t.builder.sections.summary)}
            <p style={{ color: '#1f2937' }}>{data.summary}</p>
          </section>
        )}
        {data.experience.length > 0 && (
          <section>
            {heading(t.builder.sections.experience)}
            {data.experience.map((e) => (
              <ExpBlock key={e.id} exp={e} presentLabel={presentLabel} />
            ))}
          </section>
        )}
        {data.education.length > 0 && (
          <section>
            {heading(t.builder.sections.education)}
            {data.education.map((e) => (
              <EduBlock key={e.id} edu={e} />
            ))}
          </section>
        )}
        {data.skills.length > 0 && (
          <section>
            {heading(t.builder.sections.skills)}
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s, i) => (
                <span
                  key={i}
                  className="rounded-full px-2.5 py-0.5 text-[12px] font-medium text-white"
                  style={{ background: a }}
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}
        {data.languages.length > 0 && (
          <section>
            {heading(t.builder.sections.languages)}
            <p style={{ color: '#1f2937' }}>{data.languages.join('  ·  ')}</p>
          </section>
        )}
        {customSections(data, heading)}
      </div>
    </div>
  );
}

/* ================= 6. SWISS ================= */

export function ResumeSwiss(data: ResumeData, t: Dict): ReactElement {
  const a = data.accent;
  const p = data.personal;
  const presentLabel = t.builder.experience.present;
  let n = 0;
  const heading = (text: string) => {
    n += 1;
    return (
      <div className="mb-3 mt-8 flex items-baseline gap-3">
        <span className="text-[13px] font-bold" style={{ color: a }}>
          {String(n).padStart(2, '0')}
        </span>
        <h2 className="text-[13px] font-bold uppercase tracking-[0.22em]" style={{ color: '#111827' }}>
          {text}
        </h2>
        <div className="h-px flex-1" style={{ background: '#e5e7eb' }} />
      </div>
    );
  };
  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", color: '#111111' }} className="p-10 text-[13px] leading-relaxed">
      <header className="grid grid-cols-3 gap-6 border-b-[3px] border-black pb-6">
        <div className="col-span-2">
          <h1 className="text-[44px] font-bold leading-[1.05] tracking-tight">{p.fullName}</h1>
          {p.jobTitle && (
            <p className="mt-2 text-[16px] font-medium" style={{ color: a }}>
              {p.jobTitle}
            </p>
          )}
        </div>
        <div className="text-right text-[12px] leading-relaxed" style={{ color: '#4b5563' }}>
          {p.email && <p className="break-all">{p.email}</p>}
          {p.phone && <p>{p.phone}</p>}
          {p.location && <p>{p.location}</p>}
        </div>
      </header>

      {data.summary && (
        <section>
          {heading(t.builder.sections.summary)}
          <p className="max-w-[65ch]" style={{ color: '#1f2937' }}>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          {heading(t.builder.sections.experience)}
          {data.experience.map((e) => (
            <div key={e.id} className="mb-4 grid grid-cols-4 gap-4 break-inside-avoid">
              <div className="text-[12px] font-medium" style={{ color: '#6b7280' }}>
                {dateRange(e, presentLabel)}
              </div>
              <div className="col-span-3">
                <h3 className="text-[14px] font-bold" style={{ color: '#111827' }}>{e.jobTitle}</h3>
                {e.company && <p className="text-[12px]" style={{ color: '#4b5563' }}>{e.company}</p>}
                {descLines(e.description).length > 0 && (
                  <ul className="mt-1 list-disc pl-5" style={{ color: '#1f2937' }}>
                    {descLines(e.description).map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          {heading(t.builder.sections.education)}
          {data.education.map((e) => (
            <EduBlock key={e.id} edu={e} />
          ))}
        </section>
      )}
      {data.skills.length > 0 && (
        <section>
          {heading(t.builder.sections.skills)}
          <p style={{ color: '#1f2937' }}>{data.skills.join('  /  ')}</p>
        </section>
      )}
      {data.languages.length > 0 && (
        <section>
          {heading(t.builder.sections.languages)}
          <p style={{ color: '#1f2937' }}>{data.languages.join('  /  ')}</p>
        </section>
      )}
      {customSections(data, heading)}
    </div>
  );
}

/* ================= 7. CREATIVE ================= */

export function ResumeCreative(data: ResumeData, t: Dict): ReactElement {
  const a = data.accent;
  const p = data.personal;
  const presentLabel = t.builder.experience.present;
  const heading = (text: string) => (
    <h2 className="mb-2 mt-6 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.1em]" style={{ color: '#111827' }}>
      <span className="inline-block h-2.5 w-2.5 rotate-45" style={{ background: a }} />
      {text}
    </h2>
  );
  return (
    <div style={{ fontFamily: fontFamilyFor(data.font), color: '#1a1a1a' }} className="relative overflow-hidden text-[13px] leading-relaxed">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-15" style={{ background: a }} />
      <div className="pointer-events-none absolute -left-16 top-1/3 h-48 w-48 rounded-full opacity-10" style={{ background: a }} />
      <header className="relative p-8 pb-2">
        <div className="flex items-center gap-5">
          {p.photo && data.showPhoto && (
            <img src={p.photo} alt="" className="h-24 w-24 shrink-0 rounded-2xl object-cover" style={{ border: `3px solid ${a}` }} />
          )}
          <div>
            <h1 className="text-[34px] font-bold leading-tight">
              <span style={{ color: a }}>{p.fullName.split(' ')[0] || ''}</span>{' '}
              <span style={{ color: '#111827' }}>{p.fullName.split(' ').slice(1).join(' ')}</span>
            </h1>
            {p.jobTitle && (
              <p className="mt-1 inline-block rounded-full px-3 py-0.5 text-[13px] font-semibold text-white" style={{ background: a }}>
                {p.jobTitle}
              </p>
            )}
          </div>
        </div>
        {contactParts(p).length > 0 && (
          <p className="mt-3 text-[12px]" style={{ color: '#4b5563' }}>
            {contactParts(p).join('   ◆   ')}
          </p>
        )}
      </header>
      <div className="relative bg-white p-8 pt-0">
        {data.summary && (
          <section>
            {heading(t.builder.sections.summary)}
            <p style={{ color: '#1f2937' }}>{data.summary}</p>
          </section>
        )}
        {data.experience.length > 0 && (
          <section>
            {heading(t.builder.sections.experience)}
            {data.experience.map((e) => (
              <ExpBlock key={e.id} exp={e} presentLabel={presentLabel} />
            ))}
          </section>
        )}
        {data.education.length > 0 && (
          <section>
            {heading(t.builder.sections.education)}
            {data.education.map((e) => (
              <EduBlock key={e.id} edu={e} />
            ))}
          </section>
        )}
        {data.skills.length > 0 && (
          <section>
            {heading(t.builder.sections.skills)}
            <p style={{ color: '#1f2937' }}>{data.skills.join('  ·  ')}</p>
          </section>
        )}
        {data.languages.length > 0 && (
          <section>
            {heading(t.builder.sections.languages)}
            <p style={{ color: '#1f2937' }}>{data.languages.join('  ·  ')}</p>
          </section>
        )}
        {customSections(data, heading)}
      </div>
    </div>
  );
}

/* ================= 8. INFOGRAPHIC ================= */

export function ResumeInfographic(data: ResumeData, t: Dict): ReactElement {
  const a = data.accent;
  const p = data.personal;
  const presentLabel = t.builder.experience.present;
  const heading = (text: string) => (
    <h2 className="mb-3 mt-6 text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: '#111827' }}>
      <span className="mr-2 inline-block h-3 w-1.5 rounded-sm" style={{ background: a }} />
      {text}
    </h2>
  );
  // pseudo skill levels derived deterministically from skill name length
  const level = (s: string) => 55 + ((s.length * 13) % 40);
  return (
    <div style={{ fontFamily: fontFamilyFor(data.font), color: '#1a1a1a' }} className="p-8 text-[13px] leading-relaxed">
      <header className="flex items-center gap-5 rounded-2xl p-6 text-white" style={{ background: `linear-gradient(135deg, ${a}, #111827)` }}>
        {p.photo && data.showPhoto && (
          <img src={p.photo} alt="" className="h-24 w-24 shrink-0 rounded-full border-4 border-white/30 object-cover" />
        )}
        <div className="min-w-0">
          <h1 className="text-[30px] font-bold leading-tight">{p.fullName}</h1>
          {p.jobTitle && <p className="mt-0.5 text-[14px] text-white/85">{p.jobTitle}</p>}
          {contactParts(p).length > 0 && (
            <p className="mt-1 text-[12px] text-white/80">{contactParts(p).join('  ·  ')}</p>
          )}
        </div>
      </header>

      {data.summary && (
        <section>
          {heading(t.builder.sections.summary)}
          <p style={{ color: '#1f2937' }}>{data.summary}</p>
        </section>
      )}
      {data.skills.length > 0 && (
        <section>
          {heading(t.builder.sections.skills)}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {data.skills.map((s, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="mb-1 flex justify-between text-[12px]">
                  <span className="font-medium" style={{ color: '#1f2937' }}>{s}</span>
                  <span style={{ color: '#6b7280' }}>{level(s)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full" style={{ background: '#e5e7eb' }}>
                  <div className="h-full rounded-full" style={{ width: `${level(s)}%`, background: a }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          {heading(t.builder.sections.experience)}
          {data.experience.map((e) => (
            <ExpBlock key={e.id} exp={e} presentLabel={presentLabel} />
          ))}
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          {heading(t.builder.sections.education)}
          {data.education.map((e) => (
            <EduBlock key={e.id} edu={e} />
          ))}
        </section>
      )}
      {data.languages.length > 0 && (
        <section>
          {heading(t.builder.sections.languages)}
          <div className="flex flex-wrap gap-2">
            {data.languages.map((l, i) => (
              <span key={i} className="rounded-lg px-3 py-1 text-[12px] font-medium" style={{ background: '#f3f4f6', color: '#1f2937', border: `1px solid ${a}55` }}>
                {l}
              </span>
            ))}
          </div>
        </section>
      )}
      {customSections(data, heading)}
    </div>
  );
}

/* ================= 9. TECH ================= */

export function ResumeTech(data: ResumeData, t: Dict): ReactElement {
  const a = data.accent;
  const p = data.personal;
  const presentLabel = t.builder.experience.present;
  const mono = "'JetBrains Mono','SFMono-Regular',Menlo,monospace";
  const heading = (text: string) => (
    <h2 className="mb-2 mt-6 text-[12px] font-bold" style={{ color: a, fontFamily: mono }}>
      <span style={{ color: '#9ca3af' }}>{'// '}</span>{text.toUpperCase()}
    </h2>
  );
  return (
    <div style={{ fontFamily: fontFamilyFor(data.font), color: '#1a1a1a' }} className="text-[13px] leading-relaxed">
      <header className="p-8 text-white" style={{ background: '#111827' }}>
        <p className="text-[12px]" style={{ color: a, fontFamily: mono }}>{'<developer>'}</p>
        <h1 className="mt-1 text-[32px] font-bold leading-tight">
          {p.fullName}<span style={{ color: a }}>_</span>
        </h1>
        {p.jobTitle && (
          <p className="mt-1 text-[14px]" style={{ color: '#d1d5db', fontFamily: mono }}>{p.jobTitle}</p>
        )}
        {contactParts(p).length > 0 && (
          <p className="mt-2 text-[12px] break-all" style={{ color: '#9ca3af', fontFamily: mono }}>
            {contactParts(p).join('  |  ')}
          </p>
        )}
      </header>
      <div className="bg-white p-8 pt-2">
        {data.summary && (
          <section>
            {heading(t.builder.sections.summary)}
            <p style={{ color: '#1f2937' }}>{data.summary}</p>
          </section>
        )}
        {data.skills.length > 0 && (
          <section>
            {heading(t.builder.sections.skills)}
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s, i) => (
                <span
                  key={i}
                  className="rounded px-2 py-0.5 text-[12px]"
                  style={{ background: '#f3f4f6', color: '#111827', fontFamily: mono, border: '1px solid #e5e7eb' }}
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}
        {data.experience.length > 0 && (
          <section>
            {heading(t.builder.sections.experience)}
            {data.experience.map((e) => (
              <ExpBlock key={e.id} exp={e} presentLabel={presentLabel} />
            ))}
          </section>
        )}
        {data.education.length > 0 && (
          <section>
            {heading(t.builder.sections.education)}
            {data.education.map((e) => (
              <EduBlock key={e.id} edu={e} />
            ))}
          </section>
        )}
        {data.languages.length > 0 && (
          <section>
            {heading(t.builder.sections.languages)}
            <p style={{ color: '#1f2937' }}>{data.languages.join('  ·  ')}</p>
          </section>
        )}
        {customSections(data, heading)}
        <p className="mt-8 text-[12px]" style={{ color: '#9ca3af', fontFamily: mono }}>{'</developer>'}</p>
      </div>
    </div>
  );
}

/* ================= 10. ACADEMIC ================= */

export function ResumeAcademic(data: ResumeData, t: Dict): ReactElement {
  const a = data.accent;
  const p = data.personal;
  const presentLabel = t.builder.experience.present;
  const serif = "Georgia,'Times New Roman',serif";
  const heading = (text: string) => (
    <h2
      className="mb-2 mt-6 border-b pb-1 text-[13px] font-bold uppercase tracking-[0.08em]"
      style={{ borderColor: '#9ca3af', color: '#111827' }}
    >
      {text}
    </h2>
  );
  return (
    <div style={{ fontFamily: serif, color: '#1a1a1a' }} className="p-10 text-[13.5px] leading-relaxed">
      <header className="text-center">
        <h1 className="text-[30px] font-bold leading-tight" style={{ color: '#111827' }}>
          {p.fullName}
        </h1>
        {p.jobTitle && (
          <p className="mt-1 text-[14px]" style={{ color: '#374151' }}>{p.jobTitle}</p>
        )}
        {contactParts(p).length > 0 && (
          <p className="mt-1.5 text-[12.5px]" style={{ color: '#4b5563' }}>
            {contactParts(p).join('  ·  ')}
          </p>
        )}
      </header>

      {data.education.length > 0 && (
        <section>
          {heading(t.builder.sections.education)}
          {data.education.map((e) => (
            <div key={e.id} className="mb-3 break-inside-avoid">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[14px] font-bold" style={{ color: '#111827' }}>{e.degree}</h3>
                {e.year && <span className="shrink-0 text-[12px]" style={{ color: '#4b5563' }}>{e.year}</span>}
              </div>
              {e.school && <p className="italic" style={{ color: '#374151' }}>{e.school}</p>}
            </div>
          ))}
        </section>
      )}
      {data.summary && (
        <section>
          {heading(t.builder.sections.summary)}
          <p style={{ color: '#1f2937' }}>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          {heading(t.builder.sections.experience)}
          {data.experience.map((e) => (
            <ExpBlock key={e.id} exp={e} presentLabel={presentLabel} />
          ))}
        </section>
      )}
      {data.skills.length > 0 && (
        <section>
          {heading(t.builder.sections.skills)}
          <p style={{ color: '#1f2937' }}>{data.skills.join(';  ')}</p>
        </section>
      )}
      {data.languages.length > 0 && (
        <section>
          {heading(t.builder.sections.languages)}
          <p style={{ color: '#1f2937' }}>{data.languages.join(';  ')}</p>
        </section>
      )}
      {customSections(data, heading)}
      <p className="mt-8 text-center text-[11px] italic" style={{ color: '#9ca3af' }}>
        References available upon request
      </p>
    </div>
  );
}

/* ================= 11. FRESHER ================= */

export function ResumeFresher(data: ResumeData, t: Dict): ReactElement {
  const a = data.accent;
  const p = data.personal;
  const presentLabel = t.builder.experience.present;
  const heading = (text: string) => (
    <h2 className="mb-2 mt-5 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: a }}>
      <span className="inline-block h-[2px] w-6" style={{ background: a }} />
      {text}
    </h2>
  );
  return (
    <div style={{ fontFamily: fontFamilyFor(data.font), color: '#1a1a1a' }} className="p-8 text-[13px] leading-relaxed">
      <header className="flex items-start gap-5 rounded-2xl p-5" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
        {p.photo && data.showPhoto && (
          <img src={p.photo} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
        )}
        <div className="min-w-0">
          <h1 className="text-[26px] font-bold leading-tight" style={{ color: '#111827' }}>{p.fullName}</h1>
          {p.jobTitle && <p className="text-[14px] font-medium" style={{ color: a }}>{p.jobTitle}</p>}
          {contactParts(p).length > 0 && (
            <p className="mt-1 text-[12px]" style={{ color: '#4b5563' }}>{contactParts(p).join('  ·  ')}</p>
          )}
        </div>
      </header>

      {data.summary && (
        <section>
          {heading(t.builder.sections.summary)}
          <p style={{ color: '#1f2937' }}>{data.summary}</p>
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          {heading(t.builder.sections.education)}
          {data.education.map((e) => (
            <div key={e.id} className="mb-3 rounded-xl p-3 break-inside-avoid" style={{ background: '#f9fafb' }}>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[14px] font-bold" style={{ color: a }}>{e.degree}</h3>
                {e.year && <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium text-white" style={{ background: a }}>{e.year}</span>}
              </div>
              {e.school && <p className="text-[12px]" style={{ color: '#4b5563' }}>{e.school}</p>}
            </div>
          ))}
        </section>
      )}
      {data.skills.length > 0 && (
        <section>
          {heading(t.builder.sections.skills)}
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((s, i) => (
              <span key={i} className="rounded-full px-3 py-1 text-[12px] font-medium" style={{ background: `${a}14`, color: '#111827', border: `1px solid ${a}44` }}>
                {s}
              </span>
            ))}
          </div>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          {heading(t.builder.sections.experience)}
          {data.experience.map((e) => (
            <ExpBlock key={e.id} exp={e} presentLabel={presentLabel} />
          ))}
        </section>
      )}
      {data.languages.length > 0 && (
        <section>
          {heading(t.builder.sections.languages)}
          <p style={{ color: '#1f2937' }}>{data.languages.join('  ·  ')}</p>
        </section>
      )}
      {customSections(data, heading)}
    </div>
  );
}

/* ================= 12. FUNCTIONAL ================= */

export function ResumeFunctional(data: ResumeData, t: Dict): ReactElement {
  const a = data.accent;
  const p = data.personal;
  const presentLabel = t.builder.experience.present;
  const heading = (text: string) => (
    <h2
      className="mb-2 mt-6 border-b-2 pb-1 text-[12px] font-bold uppercase tracking-[0.12em]"
      style={{ borderColor: a, color: '#111827' }}
    >
      {text}
    </h2>
  );
  // group skills into pseudo-categories for the skills-first layout
  const skillGroups: [string, string[]][] = [];
  if (data.skills.length > 0) {
    const third = Math.ceil(data.skills.length / 3);
    const names = ['Core', 'Tools', 'Other'];
    for (let i = 0; i < 3 && i * third < data.skills.length; i++) {
      skillGroups.push([names[i], data.skills.slice(i * third, (i + 1) * third)]);
    }
  }
  return (
    <div style={{ fontFamily: fontFamilyFor(data.font), color: '#1a1a1a' }} className="p-8 text-[13px] leading-relaxed">
      <header className="text-center">
        <h1 className="text-[30px] font-bold leading-tight" style={{ color: '#111827' }}>{p.fullName}</h1>
        {p.jobTitle && <p className="mt-0.5 text-[14px] font-semibold" style={{ color: a }}>{p.jobTitle}</p>}
        {contactParts(p).length > 0 && (
          <p className="mt-1 text-[12px]" style={{ color: '#4b5563' }}>{contactParts(p).join('  ·  ')}</p>
        )}
      </header>

      {data.summary && (
        <section>
          {heading(t.builder.sections.summary)}
          <p style={{ color: '#1f2937' }}>{data.summary}</p>
        </section>
      )}
      {skillGroups.length > 0 && (
        <section>
          {heading(t.builder.sections.skills)}
          {skillGroups.map(([g, ss], i) => (
            <div key={i} className="mb-2 flex gap-3">
              <span className="w-16 shrink-0 text-[12px] font-bold uppercase" style={{ color: a }}>{g}</span>
              <p style={{ color: '#1f2937' }}>{ss.join('  ·  ')}</p>
            </div>
          ))}
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          {heading(t.builder.sections.experience)}
          {data.experience.map((e) => (
            <div key={e.id} className="mb-2 flex items-baseline justify-between gap-3 break-inside-avoid">
              <p style={{ color: '#1f2937' }}>
                <span className="font-bold" style={{ color: '#111827' }}>{e.jobTitle}</span>
                {e.company && <span style={{ color: '#4b5563' }}> — {e.company}</span>}
              </p>
              <span className="shrink-0 text-[11px]" style={{ color: '#6b7280' }}>{dateRange(e, presentLabel)}</span>
            </div>
          ))}
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          {heading(t.builder.sections.education)}
          {data.education.map((e) => (
            <EduBlock key={e.id} edu={e} />
          ))}
        </section>
      )}
      {data.languages.length > 0 && (
        <section>
          {heading(t.builder.sections.languages)}
          <p style={{ color: '#1f2937' }}>{data.languages.join('  ·  ')}</p>
        </section>
      )}
      {customSections(data, heading)}
    </div>
  );
}

/* ================= 13. COMPACT ================= */

export function ResumeCompact(data: ResumeData, t: Dict): ReactElement {
  const a = data.accent;
  const p = data.personal;
  const presentLabel = t.builder.experience.present;
  const heading = (text: string) => (
    <h2 className="mb-1 mt-4 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: a }}>
      {text}
    </h2>
  );
  return (
    <div style={{ fontFamily: fontFamilyFor(data.font), color: '#1a1a1a' }} className="p-6 text-[11.5px] leading-snug">
      <header className="flex items-baseline justify-between gap-4 border-b-2 border-gray-800 pb-2">
        <div>
          <h1 className="text-[24px] font-bold leading-tight" style={{ color: '#111827' }}>{p.fullName}</h1>
          {p.jobTitle && <p className="text-[12.5px] font-semibold" style={{ color: a }}>{p.jobTitle}</p>}
        </div>
        <div className="shrink-0 text-right text-[10.5px] leading-snug" style={{ color: '#4b5563' }}>
          {p.email && <p className="break-all">{p.email}</p>}
          {p.phone && <p>{p.phone}</p>}
          {p.location && <p>{p.location}</p>}
        </div>
      </header>

      {data.summary && (
        <section>
          {heading(t.builder.sections.summary)}
          <p style={{ color: '#1f2937' }}>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          {heading(t.builder.sections.experience)}
          {data.experience.map((e) => (
            <div key={e.id} className="mb-2.5 break-inside-avoid">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-[12.5px] font-bold" style={{ color: '#111827' }}>
                  {e.jobTitle}{e.company && <span className="font-medium" style={{ color: '#4b5563' }}> · {e.company}</span>}
                </h3>
                <span className="shrink-0 text-[10.5px]" style={{ color: '#6b7280' }}>{dateRange(e, presentLabel)}</span>
              </div>
              {descLines(e.description).length > 0 && (
                <ul className="mt-0.5 list-disc pl-4" style={{ color: '#1f2937' }}>
                  {descLines(e.description).map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          {heading(t.builder.sections.education)}
          {data.education.map((e) => (
            <p key={e.id} className="mb-1 break-inside-avoid" style={{ color: '#1f2937' }}>
              <span className="font-bold" style={{ color: '#111827' }}>{e.degree}</span>
              {e.school && <span> — {e.school}</span>}
              {e.year && <span style={{ color: '#6b7280' }}> ({e.year})</span>}
            </p>
          ))}
        </section>
      )}
      {data.skills.length > 0 && (
        <section>
          {heading(t.builder.sections.skills)}
          <p style={{ color: '#1f2937' }}>{data.skills.join('  ·  ')}</p>
        </section>
      )}
      {data.languages.length > 0 && (
        <section>
          {heading(t.builder.sections.languages)}
          <p style={{ color: '#1f2937' }}>{data.languages.join('  ·  ')}</p>
        </section>
      )}
      {customSections(data, heading)}
    </div>
  );
}

/* ================= 14. ATS PLAIN ================= */

export function ResumeATSPlain(data: ResumeData, t: Dict): ReactElement {
  const p = data.personal;
  const presentLabel = t.builder.experience.present;
  const heading = (text: string) => (
    <h2 className="mb-1 mt-5 text-[13px] font-bold uppercase" style={{ color: '#000000' }}>
      {text}
    </h2>
  );
  const rule = <hr className="mb-2 border-t border-black" />;
  return (
    <div style={{ fontFamily: 'Arial,Helvetica,sans-serif', color: '#000000' }} className="bg-white p-8 text-[12.5px] leading-normal">
      <header className="text-center">
        <h1 className="text-[24px] font-bold" style={{ color: '#000000' }}>{p.fullName}</h1>
        {contactParts(p).length > 0 && (
          <p className="mt-1" style={{ color: '#000000' }}>{contactParts(p).join(' | ')}</p>
        )}
      </header>
      {rule}

      {data.summary && (
        <section>
          {heading(t.builder.sections.summary)}
          <p>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          {heading(t.builder.sections.experience)}
          {data.experience.map((e) => (
            <div key={e.id} className="mb-3 break-inside-avoid">
              <p><strong>{e.jobTitle}</strong></p>
              {e.company && <p>{e.company}</p>}
              <p>{dateRange(e, presentLabel)}</p>
              {descLines(e.description).length > 0 && (
                <ul className="mt-1 list-disc pl-5">
                  {descLines(e.description).map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          {heading(t.builder.sections.education)}
          {data.education.map((e) => (
            <div key={e.id} className="mb-2 break-inside-avoid">
              <p><strong>{e.degree}</strong>{e.year && <span> — {e.year}</span>}</p>
              {e.school && <p>{e.school}</p>}
            </div>
          ))}
        </section>
      )}
      {data.skills.length > 0 && (
        <section>
          {heading(t.builder.sections.skills)}
          <p>{data.skills.join(', ')}</p>
        </section>
      )}
      {data.languages.length > 0 && (
        <section>
          {heading(t.builder.sections.languages)}
          <p>{data.languages.join(', ')}</p>
        </section>
      )}
      {data.customSections.map((s) => (
        <section key={s.id}>
          {s.title && heading(s.title)}
          {s.type === 'text' ? (
            <p>{s.content}</p>
          ) : (
            <ul className="list-disc pl-5">
              {s.bullets.filter(Boolean).map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}

/* ================= 15. TIMELINE ================= */

export function ResumeTimeline(data: ResumeData, t: Dict): ReactElement {
  const a = data.accent;
  const p = data.personal;
  const presentLabel = t.builder.experience.present;
  const heading = (text: string) => (
    <h2 className="mb-3 mt-6 text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: '#111827' }}>
      {text}
    </h2>
  );
  return (
    <div style={{ fontFamily: fontFamilyFor(data.font), color: '#1a1a1a' }} className="p-8 text-[13px] leading-relaxed">
      <header className="mb-2 flex items-center gap-5">
        {p.photo && data.showPhoto && (
          <img src={p.photo} alt="" className="h-20 w-20 shrink-0 rounded-full object-cover" style={{ border: `3px solid ${a}` }} />
        )}
        <div>
          <h1 className="text-[30px] font-bold leading-tight" style={{ color: '#111827' }}>{p.fullName}</h1>
          {p.jobTitle && <p className="text-[14px] font-medium" style={{ color: a }}>{p.jobTitle}</p>}
          {contactParts(p).length > 0 && (
            <p className="mt-1 text-[12px]" style={{ color: '#4b5563' }}>{contactParts(p).join('  ·  ')}</p>
          )}
        </div>
      </header>

      {data.summary && (
        <section>
          {heading(t.builder.sections.summary)}
          <p style={{ color: '#1f2937' }}>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          {heading(t.builder.sections.experience)}
          <div className="relative ml-2 border-l-2 pl-6" style={{ borderColor: `${a}55` }}>
            {data.experience.map((e) => (
              <div key={e.id} className="relative mb-5 break-inside-avoid">
                <span
                  className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-white"
                  style={{ background: a, boxShadow: `0 0 0 2px ${a}` }}
                />
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[14px] font-bold" style={{ color: '#111827' }}>{e.jobTitle}</h3>
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium text-white" style={{ background: a }}>
                    {dateRange(e, presentLabel)}
                  </span>
                </div>
                {e.company && <p className="text-[12px] font-medium" style={{ color: '#4b5563' }}>{e.company}</p>}
                {descLines(e.description).length > 0 && (
                  <ul className="mt-1 list-disc pl-5" style={{ color: '#1f2937' }}>
                    {descLines(e.description).map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          {heading(t.builder.sections.education)}
          {data.education.map((e) => (
            <EduBlock key={e.id} edu={e} />
          ))}
        </section>
      )}
      {data.skills.length > 0 && (
        <section>
          {heading(t.builder.sections.skills)}
          <p style={{ color: '#1f2937' }}>{data.skills.join('  ·  ')}</p>
        </section>
      )}
      {data.languages.length > 0 && (
        <section>
          {heading(t.builder.sections.languages)}
          <p style={{ color: '#1f2937' }}>{data.languages.join('  ·  ')}</p>
        </section>
      )}
      {customSections(data, heading)}
    </div>
  );
}

/* ================= registry ================= */

export const EXTRA_TEMPLATES = [
  { id: 'executive', render: ResumeExecutive },
  { id: 'corporate', render: ResumeCorporate },
  { id: 'elegant', render: ResumeElegant },
  { id: 'sidebar', render: ResumeSidebar },
  { id: 'boldheader', render: ResumeBoldHeader },
  { id: 'swiss', render: ResumeSwiss },
  { id: 'creative', render: ResumeCreative },
  { id: 'infographic', render: ResumeInfographic },
  { id: 'tech', render: ResumeTech },
  { id: 'academic', render: ResumeAcademic },
  { id: 'fresher', render: ResumeFresher },
  { id: 'functional', render: ResumeFunctional },
  { id: 'compact', render: ResumeCompact },
  { id: 'atsplain', render: ResumeATSPlain },
  { id: 'timeline', render: ResumeTimeline },
] as const;
