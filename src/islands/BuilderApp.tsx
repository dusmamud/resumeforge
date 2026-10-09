import { useEffect, useRef, useState, type ReactElement } from 'react';
import {
  DownloadSimple,
  MagicWand,
  Trash,
  Check,
  Plus,
  X,
  ArrowUp,
  ArrowDown,
  CaretDown,
  Camera,
  User,
  Briefcase,
  GraduationCap,
  Star,
  Translate,
  ListPlus,
  FileText,
  SlidersHorizontal,
} from 'phosphor-react';
import type { Dict } from '../i18n/dicts';
import type { Locale } from '../i18n/index';

interface Props {
  locale: Locale;
  dict: Dict;
}

/* ============================== state model ============================== */

interface Personal {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  photo: string | null; // dataURL
}

interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  start: string;
  end: string;
  current: boolean;
  description: string; // one bullet per line
}

interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

interface CustomSection {
  id: string;
  title: string;
  type: 'text' | 'bullets';
  content: string;
  bullets: string[];
}

interface ResumeData {
  personal: Personal;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: string[];
  customSections: CustomSection[];
  template: 'minimal' | 'professional' | 'modern' | 'classic';
  accent: string;
  font: 'poppins' | 'inter' | 'serif';
  showPhoto: boolean;
}

type TemplateId = ResumeData['template'];

const DRAFT_KEY = 'resumeforge-draft';

const ACCENTS = [
  { name: 'Blue', value: '#0084D1' },
  { name: 'Teal', value: '#0D9488' },
  { name: 'Green', value: '#16A34A' },
  { name: 'Violet', value: '#7C3AED' },
  { name: 'Orange', value: '#EA580C' },
  { name: 'Slate', value: '#475569' },
];

let uidCounter = 0;
const uid = (): string =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `rf-${Date.now()}-${uidCounter++}`;

const emptyData = (): ResumeData => ({
  personal: { fullName: '', jobTitle: '', email: '', phone: '', location: '', photo: null },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
  customSections: [],
  template: 'minimal',
  accent: '#0084D1',
  font: 'poppins',
  showPhoto: true,
});

const SAMPLE: ResumeData = {
  personal: {
    fullName: 'Aarav Mehta',
    jobTitle: 'Senior Product Designer',
    email: 'aarav.mehta@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    photo: null,
  },
  summary:
    'Product designer with 6+ years of experience shipping consumer web and mobile products. I turn ambiguous problems into simple, measurable interfaces — from discovery and prototyping to design systems that scale across teams.',
  experience: [
    {
      id: 'sample-exp-1',
      jobTitle: 'Senior Product Designer',
      company: 'Novacart',
      start: 'Jan 2022',
      end: '',
      current: true,
      description:
        'Led the checkout redesign that lifted conversion by 18% across web and mobile\nBuilt and maintain the company design system now used by 4 product teams\nMentor 3 junior designers through weekly design critiques',
    },
    {
      id: 'sample-exp-2',
      jobTitle: 'UI Designer',
      company: 'Pixelworks Studio',
      start: 'Jun 2019',
      end: 'Dec 2021',
      current: false,
      description:
        'Designed mobile apps used by 2M+ monthly active users\nRan usability tests and iterated on core user journeys, cutting drop-off by 12%',
    },
  ],
  education: [
    { id: 'sample-edu-1', degree: 'B.Des — Communication Design', school: 'National Institute of Design', year: '2019' },
  ],
  skills: ['Figma', 'Design Systems', 'Prototyping', 'User Research', 'Interaction Design', 'HTML/CSS'],
  languages: ['English', 'Hindi'],
  customSections: [
    {
      id: 'sample-cs-1',
      title: 'Awards',
      type: 'bullets',
      content: '',
      bullets: ['Awwwards Honorable Mention — 2023', 'Design of the Year, internal award — Novacart, 2022'],
    },
  ],
  template: 'minimal',
  accent: '#0084D1',
  font: 'poppins',
  showPhoto: true,
};

const cloneSample = (): ResumeData =>
  JSON.parse(JSON.stringify({ ...SAMPLE, template: undefined })) as ResumeData;

function loadDraft(): ResumeData {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return emptyData();
    const d = JSON.parse(raw) as Partial<ResumeData>;
    if (!d || typeof d !== 'object' || !d.personal || typeof d.personal !== 'object') return emptyData();
    const base = emptyData();
    return {
      ...base,
      ...d,
      personal: { ...base.personal, ...d.personal },
      experience: Array.isArray(d.experience) ? (d.experience as Experience[]) : [],
      education: Array.isArray(d.education) ? (d.education as Education[]) : [],
      skills: Array.isArray(d.skills) ? (d.skills as string[]) : [],
      languages: Array.isArray(d.languages) ? (d.languages as string[]) : [],
      customSections: Array.isArray(d.customSections) ? (d.customSections as CustomSection[]) : [],
      template: (['minimal', 'professional', 'modern', 'classic'] as TemplateId[]).includes(d.template as TemplateId)
        ? (d.template as TemplateId)
        : 'minimal',
      font: (['poppins', 'inter', 'serif'] as ResumeData['font'][]).includes(d.font as ResumeData['font'])
        ? (d.font as ResumeData['font'])
        : 'poppins',
      accent: typeof d.accent === 'string' && d.accent ? d.accent : base.accent,
      showPhoto: typeof d.showPhoto === 'boolean' ? d.showPhoto : true,
    };
  } catch {
    return emptyData();
  }
}

/* ============================== print CSS ============================== */

const PRINT_CSS = `
#resume-print-root { background: #ffffff; color: #1a1a1a; }
@media print {
  @page { size: A4; margin: 0; }
  html.rf-printing body { background: #ffffff !important; }
  html.rf-printing .rf-no-print,
  html.rf-printing .rf-print-hide { display: none !important; }
  html.rf-printing .rf-sticky { position: static !important; }
  html.rf-printing #resume-print-root {
    display: block !important;
    position: static !important;
    width: 210mm !important;
    max-width: none !important;
    min-height: 297mm !important;
    margin: 0 !important;
    aspect-ratio: auto !important;
    transform: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    overflow: visible !important;
    background: #ffffff !important;
    color: #1a1a1a !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
`;

/* ============================== shared bits ============================== */

const inputCls =
  'w-full rounded-lg border border-graphite-200 bg-white px-3.5 py-2.5 text-sm text-graphite-900 outline-none transition placeholder:text-graphite-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-graphite-700 dark:bg-graphite-800 dark:text-white dark:placeholder:text-graphite-500';
const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-graphite-500 dark:text-graphite-400';
const iconBtnCls =
  'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-graphite-200 text-graphite-500 transition hover:border-brand-400 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-30 dark:border-graphite-700 dark:text-graphite-400 dark:hover:border-brand-500 dark:hover:text-brand-400';

const fontFamilyFor = (f: ResumeData['font']): string =>
  f === 'poppins'
    ? "'Poppins','Inter',system-ui,sans-serif"
    : f === 'serif'
      ? "Georgia,'Times New Roman',serif"
      : "'Inter',system-ui,sans-serif";

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

const contactParts = (p: Personal): string[] => [p.email, p.phone, p.location].filter(Boolean);

/* ============================== template renderers ==============================
   Pure functions of (data, dict). ATS-friendly: real text, semantic HTML,
   no absolute positioning. Explicit light colors so dark page theme never
   leaks into the printed resume. */

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

function ResumeMinimal(data: ResumeData, t: Dict): ReactElement {
  const a = data.accent;
  const p = data.personal;
  const presentLabel = t.builder.experience.present;
  const heading = (text: string) => (
    <h2
      className="mb-2 mt-6 border-b-2 pb-1 text-[12px] font-bold uppercase tracking-[0.12em]"
      style={{ borderColor: a, color: a }}
    >
      {text}
    </h2>
  );
  return (
    <div style={{ fontFamily: fontFamilyFor(data.font), color: '#1a1a1a' }} className="p-8 text-[13px] leading-relaxed">
      <header className="flex items-start gap-5">
        {p.photo && data.showPhoto && (
          <img src={p.photo} alt="" className="h-20 w-20 shrink-0 rounded-full object-cover" />
        )}
        <div className="min-w-0">
          <h1 className="text-[28px] font-bold leading-tight" style={{ color: '#111827' }}>
            {p.fullName}
          </h1>
          {p.jobTitle && (
            <p className="text-[15px] font-semibold" style={{ color: a }}>
              {p.jobTitle}
            </p>
          )}
          {contactParts(p).length > 0 && (
            <p className="mt-1 text-[11px]" style={{ color: '#6b7280' }}>
              {contactParts(p).join('  ·  ')}
            </p>
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
    </div>
  );
}

function ResumeProfessional(data: ResumeData, t: Dict): ReactElement {
  const a = data.accent;
  const p = data.personal;
  const presentLabel = t.builder.experience.present;
  const sideHeading = (text: string) => (
    <h2 className="mb-2 mt-5 border-b pb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white/95">
      {text}
    </h2>
  );
  const mainHeading = (text: string) => (
    <h2
      className="mb-2 mt-6 border-b-2 pb-1 text-[12px] font-bold uppercase tracking-[0.12em]"
      style={{ borderColor: a, color: a }}
    >
      {text}
    </h2>
  );
  return (
    <div style={{ fontFamily: fontFamilyFor(data.font), color: '#1a1a1a' }} className="flex min-h-full text-[13px] leading-relaxed">
      <aside className="w-[33%] shrink-0 p-6 text-white" style={{ background: a }}>
        {p.photo && data.showPhoto && (
          <img src={p.photo} alt="" className="mx-auto mb-4 h-24 w-24 rounded-full border-2 border-white/60 object-cover" />
        )}
        {sideHeading(t.builder.sections.personal)}
        <div className="space-y-1 text-[11px] leading-relaxed text-white/95">
          {p.email && <p className="break-all">{p.email}</p>}
          {p.phone && <p>{p.phone}</p>}
          {p.location && <p>{p.location}</p>}
        </div>
        {data.skills.length > 0 && (
          <div>
            {sideHeading(t.builder.sections.skills)}
            <ul className="space-y-1 text-[12px] text-white/95">
              {data.skills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
        {data.languages.length > 0 && (
          <div>
            {sideHeading(t.builder.sections.languages)}
            <ul className="space-y-1 text-[12px] text-white/95">
              {data.languages.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
        {data.education.length > 0 && (
          <div>
            {sideHeading(t.builder.sections.education)}
            {data.education.map((e) => (
              <EduBlock key={e.id} edu={e} dark />
            ))}
          </div>
        )}
      </aside>
      <main className="min-w-0 flex-1 p-7">
        <h1 className="text-[26px] font-bold leading-tight" style={{ color: '#111827' }}>
          {p.fullName}
        </h1>
        {p.jobTitle && (
          <p className="text-[14px] font-semibold" style={{ color: a }}>
            {p.jobTitle}
          </p>
        )}
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
        {data.customSections.map((s) => (
          <section key={s.id}>
            {s.title && mainHeading(s.title)}
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
      </main>
    </div>
  );
}

function ResumeModern(data: ResumeData, t: Dict): ReactElement {
  const a = data.accent;
  const p = data.personal;
  const presentLabel = t.builder.experience.present;
  const heading = (text: string) => (
    <h2 className="mb-2 mt-6 text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: a }}>
      {text}
    </h2>
  );
  return (
    <div style={{ fontFamily: fontFamilyFor(data.font), color: '#1a1a1a' }} className="text-[13px] leading-relaxed">
      <header className="flex items-center gap-5 p-8 text-white" style={{ background: a }}>
        {p.photo && data.showPhoto && (
          <img src={p.photo} alt="" className="h-20 w-20 shrink-0 rounded-full border-2 border-white/60 object-cover" />
        )}
        <div className="min-w-0">
          <h1 className="text-[28px] font-bold leading-tight">{p.fullName}</h1>
          {p.jobTitle && <p className="text-[14px] font-medium text-white/90">{p.jobTitle}</p>}
          {contactParts(p).length > 0 && (
            <p className="mt-1 text-[11px] text-white/80">{contactParts(p).join('  ·  ')}</p>
          )}
        </div>
      </header>
      <div className="p-8 pt-2">
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
        <div className="flex gap-8">
          {data.education.length > 0 && (
            <section className="flex-1">
              {heading(t.builder.sections.education)}
              {data.education.map((e) => (
                <EduBlock key={e.id} edu={e} />
              ))}
            </section>
          )}
          {data.skills.length > 0 && (
            <section className="flex-1">
              {heading(t.builder.sections.skills)}
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((s, i) => (
                  <span
                    key={i}
                    className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                    style={{ borderColor: a, color: a }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
        {data.languages.length > 0 && (
          <section>
            {heading(t.builder.sections.languages)}
            <p style={{ color: '#1f2937' }}>{data.languages.join('  ·  ')}</p>
          </section>
        )}
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
      </div>
    </div>
  );
}

function ResumeClassic(data: ResumeData, t: Dict): ReactElement {
  const p = data.personal;
  const presentLabel = t.builder.experience.present;
  const ff = "Georgia,'Times New Roman',serif";
  const heading = (text: string) => (
    <h2 className="mb-2 mt-6 text-center text-[13px] font-bold uppercase tracking-[0.2em]" style={{ color: '#111827' }}>
      {text}
    </h2>
  );
  const rule = <hr className="my-1 border-t" style={{ borderColor: '#9ca3af' }} />;
  return (
    <div style={{ fontFamily: ff, color: '#1a1a1a' }} className="p-8 text-[13px] leading-relaxed">
      <header className="text-center">
        {p.photo && data.showPhoto && (
          <img src={p.photo} alt="" className="mx-auto mb-3 h-20 w-20 rounded-full object-cover" />
        )}
        <h1 className="text-[30px] font-bold leading-tight" style={{ color: '#111827' }}>
          {p.fullName}
        </h1>
        {p.jobTitle && (
          <p className="text-[14px] italic" style={{ color: '#374151' }}>
            {p.jobTitle}
          </p>
        )}
        {contactParts(p).length > 0 && (
          <p className="mt-1 text-[11px]" style={{ color: '#6b7280' }}>
            {contactParts(p).join('  ·  ')}
          </p>
        )}
      </header>
      {rule}
      {data.summary && (
        <section className="text-left">
          {heading(t.builder.sections.summary)}
          {rule}
          <p style={{ color: '#1f2937' }}>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section className="text-left">
          {heading(t.builder.sections.experience)}
          {rule}
          {data.experience.map((e) => (
            <ExpBlock key={e.id} exp={e} presentLabel={presentLabel} />
          ))}
        </section>
      )}
      {data.education.length > 0 && (
        <section className="text-left">
          {heading(t.builder.sections.education)}
          {rule}
          {data.education.map((e) => (
            <EduBlock key={e.id} edu={e} />
          ))}
        </section>
      )}
      {data.skills.length > 0 && (
        <section className="text-left">
          {heading(t.builder.sections.skills)}
          {rule}
          <p style={{ color: '#1f2937' }}>{data.skills.join('  ·  ')}</p>
        </section>
      )}
      {data.languages.length > 0 && (
        <section className="text-left">
          {heading(t.builder.sections.languages)}
          {rule}
          <p style={{ color: '#1f2937' }}>{data.languages.join('  ·  ')}</p>
        </section>
      )}
      {data.customSections.map((s) => (
        <section key={s.id} className="text-left">
          {s.title && heading(s.title)}
          {s.title && rule}
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
    </div>
  );
}

const TEMPLATES: { id: TemplateId; render: (data: ResumeData, t: Dict) => ReactElement }[] = [
  { id: 'minimal', render: ResumeMinimal },
  { id: 'professional', render: ResumeProfessional },
  { id: 'modern', render: ResumeModern },
  { id: 'classic', render: ResumeClassic },
];

/* ============================== form subcomponents ============================== */

function SectionCard({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group overflow-hidden rounded-2xl border border-graphite-200 bg-white dark:border-graphite-800 dark:bg-graphite-900"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
          {icon}
        </span>
        <span className="flex-1 text-sm font-bold text-graphite-900 dark:text-white">{title}</span>
        <CaretDown className="h-4 w-4 shrink-0 text-graphite-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-4 border-t border-graphite-100 px-5 py-5 dark:border-graphite-800">{children}</div>
    </details>
  );
}

function ChipInput({
  value,
  onChange,
  placeholder,
  hint,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
  hint?: string;
}) {
  const [text, setText] = useState('');
  const commit = (raw: string) => {
    const parts = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    const next = [...value];
    for (const p of parts) if (!next.includes(p)) next.push(p);
    onChange(next);
  };
  return (
    <div>
      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {value.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1.5 rounded-full border border-graphite-200 bg-graphite-50 py-1 pl-3 pr-1.5 text-xs font-medium text-graphite-700 dark:border-graphite-700 dark:bg-graphite-800 dark:text-graphite-200"
            >
              {v}
              <button
                type="button"
                onClick={() => onChange(value.filter((x) => x !== v))}
                className="flex h-4 w-4 items-center justify-center rounded-full text-graphite-400 transition hover:bg-graphite-200 hover:text-graphite-700 dark:hover:bg-graphite-700 dark:hover:text-white"
                aria-label={`Remove ${v}`}
              >
                <X className="h-3 w-3" weight="bold" />
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        type="text"
        value={text}
        placeholder={placeholder}
        className={inputCls}
        onChange={(e) => {
          const v = e.target.value;
          if (v.includes(',')) {
            commit(v);
            setText('');
          } else {
            setText(v);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit(text);
            setText('');
          } else if (e.key === 'Backspace' && text === '' && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => {
          if (text.trim()) {
            commit(text);
            setText('');
          }
        }}
      />
      {hint && <p className="mt-1.5 text-xs text-graphite-400 dark:text-graphite-500">{hint}</p>}
    </div>
  );
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3"
    >
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-brand-600' : 'bg-graphite-200 dark:bg-graphite-700'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </span>
      <span className="text-sm font-medium text-graphite-700 dark:text-graphite-200">{label}</span>
    </button>
  );
}

/* ============================== main island ============================== */

export default function BuilderApp({ locale, dict }: Props) {
  const t = dict;
  const b = t.builder;
  const rtl = locale === 'ar' || locale === 'ur';

  const [data, setData] = useState<ResumeData>(loadDraft);
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [showSaved, setShowSaved] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const saveTimer = useRef<number | null>(null);
  const savedHideTimer = useRef<number | null>(null);
  const firstRender = useRef(true);

  /* ---- autosave (debounced 800ms; retry without photo on quota errors) ---- */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      } catch {
        try {
          localStorage.setItem(
            DRAFT_KEY,
            JSON.stringify({ ...data, personal: { ...data.personal, photo: null } })
          );
        } catch {
          /* storage unavailable — stay quiet */
        }
      }
      setShowSaved(true);
      if (savedHideTimer.current) window.clearTimeout(savedHideTimer.current);
      savedHideTimer.current = window.setTimeout(() => setShowSaved(false), 2200);
    }, 800);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [data]);

  /* ---- remove the static loading fallback as soon as the island mounts ---- */
  useEffect(() => {
    document.getElementById('builder-fallback')?.remove();
  }, []);

  /* ---- print: hide all chrome, force A4 print root ---- */
  useEffect(() => {
    const onBefore = () => {
      document.documentElement.classList.add('rf-printing');
      try {
        // Hide site header/footer from the layout, but never anything inside
        // this island (the resume's own <header> elements must print).
        document.querySelectorAll('header, footer').forEach((el) => {
          if (!rootRef.current?.contains(el)) el.classList.add('rf-print-hide');
        });
      } catch {
        /* ignore */
      }
    };
    const onAfter = () => {
      document.documentElement.classList.remove('rf-printing');
      try {
        document.querySelectorAll('.rf-print-hide').forEach((el) => el.classList.remove('rf-print-hide'));
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('beforeprint', onBefore);
    window.addEventListener('afterprint', onAfter);
    return () => {
      window.removeEventListener('beforeprint', onBefore);
      window.removeEventListener('afterprint', onAfter);
    };
  }, []);

  /* ---- state helpers ---- */
  const set = <K extends keyof ResumeData>(k: K, v: ResumeData[K]) =>
    setData((d) => ({ ...d, [k]: v }));
  const setPersonal = (k: keyof Personal, v: string | null) =>
    setData((d) => ({ ...d, personal: { ...d.personal, [k]: v } }));

  const addExperience = () =>
    setData((d) => ({
      ...d,
      experience: [
        ...d.experience,
        { id: uid(), jobTitle: '', company: '', start: '', end: '', current: false, description: '' },
      ],
    }));
  const updExperience = (id: string, patch: Partial<Experience>) =>
    setData((d) => ({ ...d, experience: d.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
  const removeExperience = (id: string) =>
    setData((d) => ({ ...d, experience: d.experience.filter((e) => e.id !== id) }));
  const moveExperience = (id: string, dir: -1 | 1) =>
    setData((d) => {
      const i = d.experience.findIndex((e) => e.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= d.experience.length) return d;
      const arr = [...d.experience];
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...d, experience: arr };
    });

  const addEducation = () =>
    setData((d) => ({
      ...d,
      education: [...d.education, { id: uid(), degree: '', school: '', year: '' }],
    }));
  const updEducation = (id: string, patch: Partial<Education>) =>
    setData((d) => ({ ...d, education: d.education.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
  const removeEducation = (id: string) =>
    setData((d) => ({ ...d, education: d.education.filter((e) => e.id !== id) }));
  const moveEducation = (id: string, dir: -1 | 1) =>
    setData((d) => {
      const i = d.education.findIndex((e) => e.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= d.education.length) return d;
      const arr = [...d.education];
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...d, education: arr };
    });

  const addCustomSection = () =>
    setData((d) => ({
      ...d,
      customSections: [...d.customSections, { id: uid(), title: '', type: 'text', content: '', bullets: [] }],
    }));
  const updCustomSection = (id: string, patch: Partial<CustomSection>) =>
    setData((d) => ({
      ...d,
      customSections: d.customSections.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  const removeCustomSection = (id: string) =>
    setData((d) => ({ ...d, customSections: d.customSections.filter((s) => s.id !== id) }));

  /* ---- photo ---- */
  const onPhotoFile = (f: File | undefined) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPersonal('photo', String(reader.result));
    reader.readAsDataURL(f);
  };

  /* ---- toolbar actions ---- */
  const fillSample = () => {
    const s = cloneSample();
    s.template = data.template;
    s.accent = data.accent;
    s.font = data.font;
    setData(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  /* Two-step inline confirm (no native dialog — reliable in all browsers) */
  const [clearArmed, setClearArmed] = useState(false);
  const clearTimer = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (clearTimer.current) window.clearTimeout(clearTimer.current);
    },
    []
  );
  const clearAll = () => {
    if (!clearArmed) {
      setClearArmed(true);
      if (clearTimer.current) window.clearTimeout(clearTimer.current);
      clearTimer.current = window.setTimeout(() => setClearArmed(false), 4000);
      return;
    }
    if (clearTimer.current) window.clearTimeout(clearTimer.current);
    setClearArmed(false);
    const prefs = { template: data.template, accent: data.accent, font: data.font };
    setData({ ...emptyData(), ...prefs });
  };

  const activeTemplate = TEMPLATES.find((x) => x.id === data.template) ?? TEMPLATES[0];
  const p = data.personal;

  return (
    <div ref={rootRef} dir={rtl ? 'rtl' : 'ltr'}>
      <style>{PRINT_CSS}</style>

      {/* ============ action bar ============ */}
      <div className="rf-no-print flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            <DownloadSimple className="h-4 w-4" weight="bold" />
            {b.actions.downloadPdf}
          </button>
          <button
            type="button"
            onClick={fillSample}
            className="inline-flex items-center gap-2 rounded-lg border border-graphite-200 bg-white px-4 py-2.5 text-sm font-semibold text-graphite-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-graphite-700 dark:bg-graphite-900 dark:text-graphite-200 dark:hover:border-brand-500 dark:hover:text-brand-400"
          >
            <MagicWand className="h-4 w-4" />
            {b.actions.fillSample}
          </button>
          <button
            type="button"
            onClick={clearAll}
            aria-live="polite"
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
              clearArmed
                ? 'border-red-600 bg-red-600 text-white hover:bg-red-700 dark:border-red-500 dark:bg-red-600'
                : 'border-graphite-200 bg-white text-graphite-700 hover:border-red-400 hover:text-red-600 dark:border-graphite-700 dark:bg-graphite-900 dark:text-graphite-200 dark:hover:border-red-500 dark:hover:text-red-400'
            }`}
          >
            <Trash className="h-4 w-4" />
            {clearArmed ? b.actions.confirmClear : b.actions.clear}
          </button>
        </div>
        <span className="ml-auto inline-flex min-w-[90px] items-center justify-end gap-1.5 text-sm text-graphite-400 dark:text-graphite-500">
          {showSaved && (
            <>
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" weight="bold" />
              {b.actions.saved}
            </>
          )}
        </span>
      </div>

      {/* ============ template strip ============ */}
      <div className="rf-no-print mt-8">
        <h2 className="text-lg font-bold text-graphite-900 dark:text-white">{b.templateTitle}</h2>
        <p className="mt-1 text-sm text-graphite-500 dark:text-graphite-400">{b.templateSubtitle}</p>
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TEMPLATES.map(({ id, render }) => {
            const selected = data.template === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => set('template', id)}
                aria-pressed={selected}
                aria-label={b.templates[id].name}
                className={`overflow-hidden rounded-xl border-2 bg-white text-left transition ${
                  selected
                    ? 'border-brand-500 ring-2 ring-brand-500/20'
                    : 'border-graphite-200 hover:border-graphite-300 dark:border-graphite-700 dark:hover:border-graphite-600'
                }`}
              >
                <div className="pointer-events-none h-44 select-none overflow-hidden bg-white" aria-hidden="true">
                  <div style={{ width: '312.5%', transform: 'scale(0.32)', transformOrigin: 'top left' }}>
                    {render({ ...SAMPLE, template: id, accent: data.accent, font: data.font }, t)}
                  </div>
                </div>
                <div className="border-t border-graphite-100 p-3 dark:border-graphite-800">
                  <p className="text-sm font-bold text-graphite-900 dark:text-white">{b.templates[id].name}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-graphite-500 dark:text-graphite-400">
                    {b.templates[id].desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============ mobile tabs ============ */}
      <div className="rf-no-print mt-8 grid grid-cols-2 gap-1 rounded-xl border border-graphite-200 bg-white p-1 dark:border-graphite-800 dark:bg-graphite-900 lg:hidden">
        {(['edit', 'preview'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setMobileTab(tab)}
            className={`rounded-lg py-2 text-sm font-semibold transition ${
              mobileTab === tab
                ? 'bg-brand-600 text-white'
                : 'text-graphite-500 hover:text-graphite-800 dark:text-graphite-400 dark:hover:text-white'
            }`}
          >
            {b.tabs[tab]}
          </button>
        ))}
      </div>

      {/* ============ editor + preview ============ */}
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[480px_1fr]">
        {/* ---- form column ---- */}
        <div className={`space-y-4 ${mobileTab === 'edit' ? '' : 'hidden'} rf-no-print lg:block`}>
          {/* customize */}
          <SectionCard title={b.customizeTitle} icon={<SlidersHorizontal className="h-5 w-5" />}>
            <div>
              <span className={labelCls}>{b.accentLabel}</span>
              <div className="flex flex-wrap gap-2">
                {ACCENTS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.name}
                    aria-label={c.name}
                    aria-pressed={data.accent === c.value}
                    onClick={() => set('accent', c.value)}
                    className={`h-9 w-9 rounded-full border-2 transition ${
                      data.accent === c.value
                        ? 'scale-110 border-graphite-900 dark:border-white'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ background: c.value }}
                  />
                ))}
              </div>
            </div>
            <div>
              <span className={labelCls}>{b.fontLabel}</span>
              <div className="grid grid-cols-3 gap-2">
                {(['poppins', 'inter', 'serif'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => set('font', f)}
                    aria-pressed={data.font === f}
                    className={`rounded-lg border px-3 py-2 text-sm transition ${
                      data.font === f
                        ? 'border-brand-500 bg-brand-50 font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                        : 'border-graphite-200 text-graphite-600 hover:border-graphite-300 dark:border-graphite-700 dark:text-graphite-300'
                    }`}
                  >
                    {b.fontOptions[f]}
                  </button>
                ))}
              </div>
            </div>
            <Switch checked={data.showPhoto} onChange={(v) => set('showPhoto', v)} label={b.showPhotoLabel} />
          </SectionCard>

          {/* personal */}
          <SectionCard title={b.sections.personal} icon={<User className="h-5 w-5" />}>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>{b.personal.fullName}</label>
                <input
                  type="text"
                  value={p.fullName}
                  onChange={(e) => setPersonal('fullName', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>{b.personal.jobTitle}</label>
                <input
                  type="text"
                  value={p.jobTitle}
                  onChange={(e) => setPersonal('jobTitle', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>{b.personal.email}</label>
                <input
                  type="email"
                  value={p.email}
                  onChange={(e) => setPersonal('email', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>{b.personal.phone}</label>
                <input
                  type="tel"
                  value={p.phone}
                  onChange={(e) => setPersonal('phone', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>{b.personal.location}</label>
                <input
                  type="text"
                  value={p.location}
                  onChange={(e) => setPersonal('location', e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <span className={labelCls}>{b.personal.photo}</span>
              <div className="flex items-center gap-3">
                {p.photo ? (
                  <img src={p.photo} alt="" className="h-14 w-14 rounded-full object-cover ring-1 ring-graphite-200 dark:ring-graphite-700" />
                ) : (
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-graphite-100 text-graphite-400 dark:bg-graphite-800 dark:text-graphite-500">
                    <Camera className="h-6 w-6" />
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="rounded-lg border border-graphite-200 px-3 py-2 text-xs font-semibold text-graphite-600 transition hover:border-brand-400 hover:text-brand-600 dark:border-graphite-700 dark:text-graphite-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
                >
                  {p.photo ? b.personal.photoChange : b.personal.photoUpload}
                </button>
                {p.photo && (
                  <button
                    type="button"
                    onClick={() => setPersonal('photo', null)}
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    {b.personal.photoRemove}
                  </button>
                )}
              </div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  onPhotoFile(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </div>
          </SectionCard>

          {/* summary */}
          <SectionCard title={b.sections.summary} icon={<FileText className="h-5 w-5" />}>
            <div>
              <label className={labelCls}>{b.summary.label}</label>
              <textarea
                rows={4}
                value={data.summary}
                onChange={(e) => set('summary', e.target.value)}
                placeholder={b.summary.placeholder}
                className={`${inputCls} resize-y`}
              />
            </div>
          </SectionCard>

          {/* experience */}
          <SectionCard title={b.sections.experience} icon={<Briefcase className="h-5 w-5" />}>
            {data.experience.map((e, idx) => (
              <div
                key={e.id}
                className="rounded-xl border border-graphite-100 p-4 dark:border-graphite-800"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-graphite-400 dark:text-graphite-500">
                    #{idx + 1}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      title={b.experience.moveUp}
                      aria-label={b.experience.moveUp}
                      onClick={() => moveExperience(e.id, -1)}
                      disabled={idx === 0}
                      className={iconBtnCls}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title={b.experience.moveDown}
                      aria-label={b.experience.moveDown}
                      onClick={() => moveExperience(e.id, 1)}
                      disabled={idx === data.experience.length - 1}
                      className={iconBtnCls}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title={b.experience.remove}
                      aria-label={b.experience.remove}
                      onClick={() => removeExperience(e.id)}
                      className={`${iconBtnCls} hover:!border-red-400 hover:!text-red-500`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>{b.experience.jobTitle}</label>
                    <input
                      type="text"
                      value={e.jobTitle}
                      onChange={(ev) => updExperience(e.id, { jobTitle: ev.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>{b.experience.company}</label>
                    <input
                      type="text"
                      value={e.company}
                      onChange={(ev) => updExperience(e.id, { company: ev.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>{b.experience.startDate}</label>
                    <input
                      type="text"
                      value={e.start}
                      onChange={(ev) => updExperience(e.id, { start: ev.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>{b.experience.endDate}</label>
                    <input
                      type="text"
                      value={e.current ? '' : e.end}
                      disabled={e.current}
                      onChange={(ev) => updExperience(e.id, { end: ev.target.value })}
                      className={`${inputCls} disabled:opacity-40`}
                    />
                    <label className="mt-1.5 flex cursor-pointer items-center gap-2 text-xs font-medium text-graphite-600 dark:text-graphite-300">
                      <input
                        type="checkbox"
                        checked={e.current}
                        onChange={(ev) => updExperience(e.id, { current: ev.target.checked })}
                        className="h-4 w-4 rounded accent-[#0084D1]"
                      />
                      {b.experience.present}
                    </label>
                  </div>
                </div>
                <div className="mt-3">
                  <label className={labelCls}>{b.experience.description}</label>
                  <textarea
                    rows={3}
                    value={e.description}
                    onChange={(ev) => updExperience(e.id, { description: ev.target.value })}
                    className={`${inputCls} resize-y`}
                  />
                  <p className="mt-1.5 text-xs text-graphite-400 dark:text-graphite-500">
                    {b.experience.descriptionHint}
                  </p>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addExperience}
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-graphite-300 px-4 py-2.5 text-sm font-semibold text-graphite-600 transition hover:border-brand-400 hover:text-brand-600 dark:border-graphite-700 dark:text-graphite-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
            >
              <Plus className="h-4 w-4" weight="bold" />
              {b.experience.add}
            </button>
          </SectionCard>

          {/* education */}
          <SectionCard title={b.sections.education} icon={<GraduationCap className="h-5 w-5" />}>
            {data.education.map((e, idx) => (
              <div
                key={e.id}
                className="rounded-xl border border-graphite-100 p-4 dark:border-graphite-800"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-graphite-400 dark:text-graphite-500">
                    #{idx + 1}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      title={b.education.moveUp}
                      aria-label={b.education.moveUp}
                      onClick={() => moveEducation(e.id, -1)}
                      disabled={idx === 0}
                      className={iconBtnCls}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title={b.education.moveDown}
                      aria-label={b.education.moveDown}
                      onClick={() => moveEducation(e.id, 1)}
                      disabled={idx === data.education.length - 1}
                      className={iconBtnCls}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title={b.education.remove}
                      aria-label={b.education.remove}
                      onClick={() => removeEducation(e.id)}
                      className={`${iconBtnCls} hover:!border-red-400 hover:!text-red-500`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={labelCls}>{b.education.degree}</label>
                    <input
                      type="text"
                      value={e.degree}
                      onChange={(ev) => updEducation(e.id, { degree: ev.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>{b.education.school}</label>
                    <input
                      type="text"
                      value={e.school}
                      onChange={(ev) => updEducation(e.id, { school: ev.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>{b.education.year}</label>
                    <input
                      type="text"
                      value={e.year}
                      onChange={(ev) => updEducation(e.id, { year: ev.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addEducation}
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-graphite-300 px-4 py-2.5 text-sm font-semibold text-graphite-600 transition hover:border-brand-400 hover:text-brand-600 dark:border-graphite-700 dark:text-graphite-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
            >
              <Plus className="h-4 w-4" weight="bold" />
              {b.education.add}
            </button>
          </SectionCard>

          {/* skills */}
          <SectionCard title={b.sections.skills} icon={<Star className="h-5 w-5" />}>
            <div>
              <label className={labelCls}>{b.skills.label}</label>
              <ChipInput
                value={data.skills}
                onChange={(v) => set('skills', v)}
                placeholder={b.skills.placeholder}
                hint={b.skills.hint}
              />
            </div>
          </SectionCard>

          {/* languages */}
          <SectionCard title={b.sections.languages} icon={<Translate className="h-5 w-5" />}>
            <div>
              <label className={labelCls}>{b.languages.label}</label>
              <ChipInput
                value={data.languages}
                onChange={(v) => set('languages', v)}
                placeholder={b.languages.placeholder}
                hint={b.languages.hint}
              />
            </div>
          </SectionCard>

          {/* custom sections */}
          <SectionCard title={b.sections.custom} icon={<ListPlus className="h-5 w-5" />}>
            {data.customSections.map((s) => (
              <div key={s.id} className="rounded-xl border border-graphite-100 p-4 dark:border-graphite-800">
                <div className="mb-3 flex items-end gap-3">
                  <div className="flex-1">
                    <label className={labelCls}>{b.custom.sectionTitle}</label>
                    <input
                      type="text"
                      value={s.title}
                      onChange={(ev) => updCustomSection(s.id, { title: ev.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <button
                    type="button"
                    title={b.custom.remove}
                    aria-label={b.custom.remove}
                    onClick={() => removeCustomSection(s.id)}
                    className={`${iconBtnCls} mb-0.5 hover:!border-red-400 hover:!text-red-500`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <span className={labelCls}>{b.custom.typeLabel}</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['text', 'bullets'] as const).map((ty) => (
                      <button
                        key={ty}
                        type="button"
                        onClick={() => updCustomSection(s.id, { type: ty })}
                        aria-pressed={s.type === ty}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                          s.type === ty
                            ? 'border-brand-500 bg-brand-50 font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                            : 'border-graphite-200 text-graphite-600 hover:border-graphite-300 dark:border-graphite-700 dark:text-graphite-300'
                        }`}
                      >
                        {ty === 'text' ? b.custom.typeText : b.custom.typeBullets}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelCls}>{b.custom.contentLabel}</label>
                  {s.type === 'text' ? (
                    <textarea
                      rows={3}
                      value={s.content}
                      onChange={(ev) => updCustomSection(s.id, { content: ev.target.value })}
                      className={`${inputCls} resize-y`}
                    />
                  ) : (
                    <textarea
                      rows={3}
                      value={s.bullets.join('\n')}
                      onChange={(ev) =>
                        updCustomSection(s.id, {
                          bullets: ev.target.value.split('\n').map((x) => x.trim()).filter(Boolean),
                        })
                      }
                      className={`${inputCls} resize-y`}
                    />
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addCustomSection}
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-graphite-300 px-4 py-2.5 text-sm font-semibold text-graphite-600 transition hover:border-brand-400 hover:text-brand-600 dark:border-graphite-700 dark:text-graphite-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
            >
              <Plus className="h-4 w-4" weight="bold" />
              {b.custom.addSection}
            </button>
          </SectionCard>
        </div>

        {/* ---- preview column ---- */}
        <div className={`${mobileTab === 'preview' ? '' : 'hidden'} lg:block`}>
          <div className="rf-sticky lg:sticky lg:top-6">
            <h2 className="rf-no-print mb-4 text-lg font-bold text-graphite-900 dark:text-white">
              {b.previewTitle}
            </h2>
            <div
              id="resume-print-root"
              className="aspect-[1/1.414] w-full overflow-y-auto rounded-sm bg-white shadow-xl ring-1 ring-graphite-200 dark:ring-graphite-700"
            >
              {activeTemplate.render(data, t)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
