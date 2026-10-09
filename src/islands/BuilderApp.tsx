import { useEffect, useRef, useState, type ReactElement } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  template: 'minimal' | 'professional' | 'modern' | 'classic' | 'traditional';
  accent: string;
  font: 'poppins' | 'inter' | 'serif';
  showPhoto: boolean;
}

type TemplateId = ResumeData['template'];

const DRAFT_KEY = 'resumeforge-draft';

/* ============================== traditional template model ==============================
   Mirrors the resumeground.com/create-resume reference form + output exactly. */

interface TraditionalQualification {
  degree: string;
  university: string;
  year: string;
  gpa: string;
}

interface TraditionalCustomSection {
  id: string;
  title: string;
  type: 'text' | 'bullets';
  content: string;
  bullets: string[];
}

interface TraditionalData {
  heading: 'RESUME' | 'CURRICULUM VITAE';
  name: string;
  house: string;
  landmark: string; // collected but NOT rendered (reference quirk)
  area: string;
  state: string;
  pincode: string;
  mobile: string;
  email: string;
  profile: string;
  objectivePreset: '' | 'entry' | 'custom';
  objective: string;
  qualifications: TraditionalQualification[];
  otherQual: string[];
  experience: string[];
  customSections: TraditionalCustomSection[];
  gender: '' | 'Male' | 'Female' | 'Others';
  fatherName: string;
  dob: string;
  languages: string;
  nationality: string;
  maritalStatus: '' | 'Married' | 'Unmarried';
  photo: string | null; // optional profile photo (data URL)
}

const TRADITIONAL_DRAFT_KEY = 'resumeforge-traditional-draft';

const ENTRY_LEVEL_OBJECTIVE =
  'To make contribution in the organization with best of my ability and also to Develop new skills during the interaction to achieve new heights.';

const DECLARATION_TEXT =
  'I hereby declared that the above information given by me is true to best of my Knowledge.';

const emptyTraditionalData = (): TraditionalData => ({
  heading: 'RESUME',
  name: '',
  house: '',
  landmark: '',
  area: '',
  state: '',
  pincode: '',
  mobile: '',
  email: '',
  profile: '',
  objectivePreset: '',
  objective: '',
  qualifications: [{ degree: '', university: '', year: '', gpa: '' }],
  otherQual: [''],
  experience: [''],
  customSections: [],
  gender: '',
  fatherName: '',
  dob: '',
  languages: '',
  nationality: '',
  maritalStatus: '',
  photo: null,
});

const SAMPLE_TRADITIONAL: TraditionalData = {
  heading: 'RESUME',
  name: 'Rahul Sharma',
  house: '123',
  landmark: 'Near Park',
  area: 'Model Town',
  state: 'Delhi',
  pincode: '110001',
  mobile: '9876543210',
  email: 'rahul@example.com',
  profile: 'Web Designer',
  objectivePreset: 'custom',
  objective: 'To obtain a challenging position.',
  qualifications: [{ degree: 'BCA', university: 'Delhi University', year: '2020', gpa: '75' }],
  otherQual: ['Basic Knowledge of Computer'],
  experience: ['2 years as Web Designer'],
  customSections: [],
  gender: 'Male',
  fatherName: 'Ramesh Sharma',
  dob: '1995-05-15',
  languages: 'Hindi & English',
  nationality: 'Indian',
  maritalStatus: 'Unmarried',
  photo: null,
};

const cloneTraditionalSample = (): TraditionalData =>
  JSON.parse(JSON.stringify(SAMPLE_TRADITIONAL)) as TraditionalData;

function loadTraditionalDraft(): TraditionalData {
  try {
    const raw = localStorage.getItem(TRADITIONAL_DRAFT_KEY);
    if (!raw) return emptyTraditionalData();
    const d = JSON.parse(raw) as Partial<TraditionalData>;
    if (!d || typeof d !== 'object') return emptyTraditionalData();
    const base = emptyTraditionalData();
    return {
      ...base,
      ...d,
      heading: d.heading === 'CURRICULUM VITAE' ? 'CURRICULUM VITAE' : 'RESUME',
      objectivePreset: (['', 'entry', 'custom'] as const).includes(d.objectivePreset as '' | 'entry' | 'custom')
        ? (d.objectivePreset as '' | 'entry' | 'custom')
        : '',
      qualifications: Array.isArray(d.qualifications) && d.qualifications.length > 0
        ? (d.qualifications as TraditionalQualification[])
        : base.qualifications,
      otherQual: Array.isArray(d.otherQual) ? (d.otherQual as string[]) : [],
      experience: Array.isArray(d.experience) ? (d.experience as string[]) : [],
      customSections: Array.isArray(d.customSections) ? (d.customSections as TraditionalCustomSection[]) : [],
      gender: (['', 'Male', 'Female', 'Others'] as const).includes(d.gender as TraditionalData['gender'])
        ? (d.gender as TraditionalData['gender'])
        : '',
      maritalStatus: (['', 'Married', 'Unmarried'] as const).includes(d.maritalStatus as TraditionalData['maritalStatus'])
        ? (d.maritalStatus as TraditionalData['maritalStatus'])
        : '',
      photo: typeof d.photo === 'string' ? d.photo : null,
    };
  } catch {
    return emptyTraditionalData();
  }
}

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
  template: 'traditional',
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
  template: 'traditional',
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
      template: (['minimal', 'professional', 'modern', 'classic', 'traditional'] as TemplateId[]).includes(d.template as TemplateId)
        ? (d.template as TemplateId)
        : 'traditional',
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
  { id: 'traditional', render: (d) => ResumeTraditional(SAMPLE_TRADITIONAL, d.accent, d.font) },
  { id: 'minimal', render: ResumeMinimal },
  { id: 'professional', render: ResumeProfessional },
  { id: 'modern', render: ResumeModern },
  { id: 'classic', render: ResumeClassic },
];

/* ================= traditional renderer (resumeground.com reference) =============
   Pixel-faithful to the reference dompdf output: centered heading, name block,
   thick rule, gray #D3D3D3 section bars, bordered qualification table, bullets,
   personal-info "Label : value" rows, declaration, and the Date/Place/(name)
   footer. Structural labels stay in English exactly like the reference. */

const TRAD_BAR = '#D3D3D3';

const TRAD_FONTS: Record<'poppins' | 'inter' | 'serif', string> = {
  poppins: "'Poppins',sans-serif",
  inter: "'Inter',sans-serif",
  serif: "Georgia,'Times New Roman',serif",
};

function ResumeTraditional(
  d: TraditionalData,
  accent = '#000000',
  fontId: 'poppins' | 'inter' | 'serif' = 'poppins'
): ReactElement {
  const fontFamily = TRAD_FONTS[fontId] ?? TRAD_FONTS.poppins;
  const bar = (text: string) => (
    <h2
      className="mb-2 mt-4 px-2 py-1.5 text-[14px] font-bold uppercase"
      style={{ background: TRAD_BAR, color: accent }}
    >
      {text}
    </h2>
  );
  const bullets = (items: string[]) => {
    const list = items.map((s) => s.trim()).filter(Boolean);
    if (list.length === 0) return null;
    return (
      <ul className="mb-2 ml-6 list-none text-[12px] leading-relaxed" style={{ color: '#000000' }}>
        {list.map((s, i) => (
          <li key={i} className="mb-1">
            <span className="mr-2">•</span>
            {s}
          </li>
        ))}
      </ul>
    );
  };
  const addressLines = [d.house, d.area, d.state && d.pincode ? `${d.state} - ${d.pincode}` : d.state || d.pincode]
    .map((s) => s.trim())
    .filter(Boolean);
  const personalRows: [string, string][] = [
    ["Father's Name", d.fatherName],
    ['Date of Birth', d.dob],
    ['Language Known', d.languages],
    ['Gender', d.gender],
    ['Nationality', d.nationality],
    ['Marital Status', d.maritalStatus],
  ];
  const objective = d.objectivePreset === 'entry' ? ENTRY_LEVEL_OBJECTIVE : d.objective;
  return (
    <div
      style={{ fontFamily, color: '#000000', background: '#ffffff' }}
      className="relative p-8 text-[12px] leading-relaxed"
    >
      <h1 className="text-center text-[22px] font-bold uppercase" style={{ color: '#000000' }}>
        {d.heading || 'RESUME'}
      </h1>

      {d.photo && (
        <img
          src={d.photo}
          alt=""
          className="absolute right-8 top-8 h-28 w-24 object-cover"
          style={{ border: '1px solid #999' }}
        />
      )}

      {d.name && (
        <p className="mt-4 text-[16px] font-bold" style={{ color: accent }}>
          {d.name}
        </p>
      )}
      {d.profile && (
        <p className="text-[13px]" style={{ color: '#000000' }}>
          {d.profile}
        </p>
      )}
      {addressLines.map((l, i) => (
        <p key={i} style={{ color: '#000000' }}>
          {l}
        </p>
      ))}
      {d.mobile && (
        <p style={{ color: '#000000' }}>
          Mob No. : {d.mobile}
        </p>
      )}
      {d.email && (
        <p style={{ color: '#000000' }}>
          Email Id : {d.email}
        </p>
      )}

      <hr className="my-2 border-t-[3px] border-black" />

      {objective.trim() && (
        <section>
          {bar('Career Objective')}
          <p style={{ color: '#000000' }}>{objective}</p>
        </section>
      )}

      {d.qualifications.some((q) => q.degree || q.university || q.year || q.gpa) && (
        <section>
          {bar('Academic Qualification')}
          <table className="w-full border-collapse text-[12px]" style={{ color: '#000000' }}>
            <thead>
              <tr style={{ background: TRAD_BAR }}>
                {['S.No.', 'Qualification', 'University / Board', 'Year', 'Per %'].map((h) => (
                  <th key={h} className="border border-gray-400 px-2 py-1 text-left font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.qualifications.map((q, i) => (
                <tr key={i}>
                  <td className="border border-gray-400 px-2 py-1">{i + 1}</td>
                  <td className="border border-gray-400 px-2 py-1">{q.degree}</td>
                  <td className="border border-gray-400 px-2 py-1">{q.university}</td>
                  <td className="border border-gray-400 px-2 py-1">{q.year}</td>
                  <td className="border border-gray-400 px-2 py-1">{q.gpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section>
        {bar('Other Qualification')}
        {bullets(d.otherQual)}
      </section>

      <section>
        {bar('Work Experience')}
        {bullets(d.experience)}
      </section>

      {d.customSections.map((s) => (
        <section key={s.id}>
          {s.title.trim() && bar(s.title)}
          {s.type === 'text' ? (
            s.content.trim() && (
              <p style={{ color: '#000000' }}>{s.content}</p>
            )
          ) : (
            bullets(s.bullets)
          )}
        </section>
      ))}

      <section>
        {bar('Personal Information')}
        <table className="text-[12px]" style={{ color: '#000000' }}>
          <tbody>
            {personalRows.map(([label, value]) => (
              <tr key={label}>
                <td className="py-0.5 pr-2 align-top" style={{ minWidth: '150px' }}>
                  {label}
                </td>
                <td className="px-2 py-0.5 align-top">:</td>
                <td className="py-0.5 align-top">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        {bar('Declaration')}
        <p style={{ color: '#000000' }}>{DECLARATION_TEXT}</p>
      </section>

      <div className="mt-6 flex items-start justify-between text-[13px] font-bold" style={{ color: '#000000' }}>
        <div>
          <p>Date :</p>
          {d.state && <p>Place : {d.state}</p>}
        </div>
        {d.name && <p>({d.name})</p>}
      </div>
    </div>
  );
}

/* ============ traditional PDF (jsPDF, A4 portrait, direct download) ============
   Replicates the reference dompdf output: same order, gray #D3D3D3 bars,
   bordered qualification table, bullets, personal-info rows, declaration,
   and the Date/Place/(name) footer. All text stays selectable. */

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return [0, 0, 0];
  const v = parseInt(m[1], 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function generateTraditionalPdf(
  d: TraditionalData,
  accent = '#000000',
  fontId: 'poppins' | 'inter' | 'serif' = 'poppins'
): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const PW = 210;
  const ML = 19; // measured from the reference PDF
  const MR = 19;
  const CW = PW - ML - MR; // 172
  let y = 10; // reference heading starts ~9mm from top edge
  const BLACK: [number, number, number] = [0, 0, 0];
  const GRAY: [number, number, number] = [211, 211, 211];
  const ACC = hexToRgb(accent);
  const PDFFONT = fontId === 'serif' ? 'times' : 'helvetica';

  const need = (h: number) => {
    if (y + h > 278) {
      doc.addPage();
      y = 19;
    }
  };
  const para = (text: string, size: number, style: 'normal' | 'bold', indent = 0) => {
    doc.setFont(PDFFONT, style);
    doc.setFontSize(size);
    doc.setTextColor(...BLACK);
    const lines = doc.splitTextToSize(text, CW - indent);
    const lh = size * 0.45;
    lines.forEach((ln: string) => {
      need(lh + 1);
      doc.text(ln, ML + indent, y);
      y += lh;
    });
    y += 1.5;
  };
  const grayBar = (text: string) => {
    need(10);
    doc.setFillColor(...GRAY);
    doc.rect(ML, y, CW, 7, 'F');
    doc.setFont(PDFFONT, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...ACC);
    doc.text(text.toUpperCase(), ML + 2, y + 5);
    y += 10;
  };

  // 1. heading
  doc.setFont(PDFFONT, 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...BLACK);
  doc.text(d.heading || 'RESUME', PW / 2, y, { align: 'center' });
  y += 10;

  // 1b. photo (optional, top-right like the reference)
  if (d.photo) {
    try {
      const fmt = d.photo.startsWith('data:image/png') ? 'PNG' : 'JPEG';
      doc.addImage(d.photo, fmt, PW - MR - 30, 22, 30, 36);
    } catch {
      /* ignore unreadable image data */
    }
  }

  // 2-4. name / profile / address / contact
  if (d.name.trim()) {
    doc.setFont(PDFFONT, 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...ACC);
    doc.text(d.name.trim(), ML, y);
    doc.setTextColor(...BLACK);
    y += 7;
  }
  if (d.profile.trim()) {
    doc.setFont(PDFFONT, 'normal');
    doc.setFontSize(11);
    doc.text(d.profile.trim(), ML, y);
    y += 6;
  }
  const addr = [d.house, d.area, d.state && d.pincode ? `${d.state} - ${d.pincode}` : d.state || d.pincode]
    .map((s) => s.trim())
    .filter(Boolean);
  doc.setFont(PDFFONT, 'normal');
  doc.setFontSize(10);
  addr.forEach((l) => {
    need(5);
    doc.text(l, ML, y);
    y += 5;
  });
  if (d.mobile.trim()) {
    need(5);
    doc.text(`Mob No. : ${d.mobile.trim()}`, ML, y);
    y += 5;
  }
  if (d.email.trim()) {
    need(5);
    doc.text(`Email Id : ${d.email.trim()}`, ML, y);
    y += 5;
  }

  // 5. thick rule
  need(4);
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(1.1);
  doc.line(ML, y, PW - MR, y);
  y += 5;

  // 6a. career objective
  const objective = d.objectivePreset === 'entry' ? ENTRY_LEVEL_OBJECTIVE : d.objective;
  if (objective.trim()) {
    grayBar('Career Objective');
    para(objective.trim(), 10.5, 'normal');
  }

  // 6b. academic qualification table
  const quals = d.qualifications.filter((q) => q.degree || q.university || q.year || q.gpa);
  if (quals.length > 0) {
    grayBar('Academic Qualification');
    autoTable(doc, {
      startY: y,
      head: [['S.No.', 'Qualification', 'University / Board', 'Year', 'Per %']],
      body: quals.map((q, i) => [String(i + 1), q.degree, q.university, q.year, q.gpa]),
      theme: 'grid',
      styles: { font: PDFFONT, fontSize: 10, textColor: BLACK, lineColor: [150, 150, 150], lineWidth: 0.2, cellPadding: 2.5 },
      headStyles: { fillColor: GRAY, textColor: BLACK, fontStyle: 'bold' },
      columnStyles: { 0: { cellWidth: 15 }, 1: { cellWidth: 45 }, 2: { cellWidth: 60 }, 3: { cellWidth: 25 }, 4: { cellWidth: 35 } },
      margin: { left: ML, right: MR },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 4;
  }

  // 6c/6d. bullets sections
  const bulletSection = (title: string, items: string[]) => {
    const list = items.map((s) => s.trim()).filter(Boolean);
    if (list.length === 0) return;
    grayBar(title);
    doc.setFont(PDFFONT, 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(...BLACK);
    list.forEach((s) => {
      const lines = doc.splitTextToSize(s, CW - 6);
      const lh = 10.5 * 0.45;
      lines.forEach((ln: string, li: number) => {
        need(lh + 1);
        doc.text(li === 0 ? '•  ' + ln : '    ' + ln, ML, y);
        y += lh;
      });
      y += 1;
    });
    y += 2;
  };
  bulletSection('Other Qualification', d.otherQual);
  bulletSection('Work Experience', d.experience);

  // 6e. custom sections
  d.customSections.forEach((s) => {
    if (!s.title.trim()) return;
    if (s.type === 'text') {
      grayBar(s.title.trim());
      if (s.content.trim()) para(s.content.trim(), 10.5, 'normal');
    } else {
      bulletSection(s.title.trim(), s.bullets); // emits its own gray bar
    }
  });

  // 6f. personal information
  grayBar('Personal Information');
  const rows: [string, string][] = [
    ["Father's Name", d.fatherName],
    ['Date of Birth', d.dob],
    ['Language Known', d.languages],
    ['Gender', d.gender],
    ['Nationality', d.nationality],
    ['Marital Status', d.maritalStatus],
  ];
  doc.setFont(PDFFONT, 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(...BLACK);
  rows.forEach(([label, value]) => {
    need(6);
    doc.text(label, ML, y);
    doc.text(':', ML + 45, y);
    const vlines = doc.splitTextToSize(value || '', CW - 50);
    vlines.forEach((ln: string, li: number) => {
      if (li > 0) need(6);
      doc.text(ln, ML + 50, y);
      if (li < vlines.length - 1) y += 5;
    });
    y += 5.5;
  });
  y += 2;

  // 6g. declaration
  grayBar('Declaration');
  para(DECLARATION_TEXT, 10.5, 'normal');

  // 7. footer
  need(14);
  doc.setFont(PDFFONT, 'bold');
  doc.setFontSize(11);
  doc.text('Date :', ML, y);
  y += 6;
  if (d.state.trim()) doc.text(`Place : ${d.state.trim()}`, ML, y);
  if (d.name.trim()) doc.text(`(${d.name.trim()})`, PW - MR, y - 6, { align: 'right' });

  doc.save('resume.pdf');
}

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

  /* ---- traditional template state (separate draft) ---- */
  const [tdata, setTdata] = useState<TraditionalData>(loadTraditionalDraft);
  const tradSaveTimer = useRef<number | null>(null);
  const tradFirstRender = useRef(true);
  const [tradErrors, setTradErrors] = useState<Record<string, boolean>>({});
  const [tradModal, setTradModal] = useState<{ title: string; type: 'text' | 'bullets' } | null>(null);

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

  /* ---- traditional autosave (debounced 800ms) ---- */
  useEffect(() => {
    if (tradFirstRender.current) {
      tradFirstRender.current = false;
      return;
    }
    if (tradSaveTimer.current) window.clearTimeout(tradSaveTimer.current);
    tradSaveTimer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(TRADITIONAL_DRAFT_KEY, JSON.stringify(tdata));
      } catch {
        /* storage unavailable — stay quiet */
      }
      setShowSaved(true);
      if (savedHideTimer.current) window.clearTimeout(savedHideTimer.current);
      savedHideTimer.current = window.setTimeout(() => setShowSaved(false), 2200);
    }, 800);
    return () => {
      if (tradSaveTimer.current) window.clearTimeout(tradSaveTimer.current);
    };
  }, [tdata]);

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

  /* ---- traditional helpers ---- */
  const setT = <K extends keyof TraditionalData>(k: K, v: TraditionalData[K]) => {
    setTdata((d) => ({ ...d, [k]: v }));
    setTradErrors((e) => ({ ...e, [k as string]: false }));
  };
  const setTObjectivePreset = (preset: TraditionalData['objectivePreset']) =>
    setTdata((d) => ({
      ...d,
      objectivePreset: preset,
      objective: preset === 'entry' ? ENTRY_LEVEL_OBJECTIVE : preset === '' ? '' : d.objective,
    }));
  const addTQual = () =>
    setTdata((d) => ({
      ...d,
      qualifications: [...d.qualifications, { degree: '', university: '', year: '', gpa: '' }],
    }));
  const updTQual = (i: number, patch: Partial<TraditionalQualification>) =>
    setTdata((d) => ({
      ...d,
      qualifications: d.qualifications.map((q, j) => (j === i ? { ...q, ...patch } : q)),
    }));
  const removeTQual = (i: number) =>
    setTdata((d) => ({ ...d, qualifications: d.qualifications.filter((_, j) => j !== i) }));
  const updTBulletList = (key: 'otherQual' | 'experience', i: number, v: string) =>
    setTdata((d) => ({ ...d, [key]: d[key].map((s, j) => (j === i ? v : s)) }));
  const addTBullet = (key: 'otherQual' | 'experience') =>
    setTdata((d) => ({ ...d, [key]: [...d[key], ''] }));
  const removeTBullet = (key: 'otherQual' | 'experience', i: number) =>
    setTdata((d) => ({ ...d, [key]: d[key].filter((_, j) => j !== i) }));
  const addTradCustomSection = (title: string, type: 'text' | 'bullets') =>
    setTdata((d) => ({
      ...d,
      customSections: [...d.customSections, { id: uid(), title, type, content: '', bullets: [''] }],
    }));
  const updTradCustomSection = (id: string, patch: Partial<TraditionalCustomSection>) =>
    setTdata((d) => ({
      ...d,
      customSections: d.customSections.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  const removeTradCustomSection = (id: string) =>
    setTdata((d) => ({ ...d, customSections: d.customSections.filter((s) => s.id !== id) }));

  /* ---- traditional required-field validation (reference marks with *) ---- */
  const validateTraditional = (): boolean => {
    const missing: Record<string, boolean> = {};
    if (!tdata.name.trim()) missing.name = true;
    if (!tdata.house.trim()) missing.house = true;
    if (!tdata.area.trim()) missing.area = true;
    if (!tdata.state.trim()) missing.state = true;
    if (!tdata.pincode.trim()) missing.pincode = true;
    if (!tdata.mobile.trim()) missing.mobile = true;
    if (!tdata.fatherName.trim()) missing.fatherName = true;
    if (!tdata.dob.trim()) missing.dob = true;
    if (!tdata.languages.trim()) missing.languages = true;
    if (!tdata.nationality.trim()) missing.nationality = true;
    setTradErrors(missing);
    if (Object.keys(missing).length > 0) {
      const first = document.querySelector<HTMLElement>('[data-trad-error="true"]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  };

  const downloadTraditional = () => {
    if (!validateTraditional()) return;
    generateTraditionalPdf(tdata, data.accent, data.font);
  };

  /* ---- photo ---- */
  const onPhotoFile = (f: File | undefined) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPersonal('photo', String(reader.result));
    reader.readAsDataURL(f);
  };

  /* ---- traditional photo (optional) ---- */
  const tradPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const onTradPhotoFile = (f: File | undefined) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setT('photo', String(reader.result));
    reader.readAsDataURL(f);
  };

  /* ---- toolbar actions ---- */
  const fillSample = () => {
    if (data.template === 'traditional') {
      setTdata(cloneTraditionalSample());
      setTradErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
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
    setTdata(emptyTraditionalData());
    setTradErrors({});
  };

  const activeTemplate = TEMPLATES.find((x) => x.id === data.template) ?? TEMPLATES[0];
  const p = data.personal;

  /* ============ traditional (reference-style) form ============ */
  const tr = b.traditional;
  const tradInput = (key: string) =>
    `${inputCls}${tradErrors[key] ? ' !border-red-500 !ring-2 !ring-red-500/20' : ''}`;
  const tradErrAttr = (key: string) =>
    tradErrors[key] ? ({ 'data-trad-error': 'true' } as const) : {};
  const hasTradErrors = Object.keys(tradErrors).length > 0;

  const renderTraditionalForm = () => (
    <>
      {hasTradErrors && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
          {tr.requiredHint}
        </div>
      )}

      {/* personal */}
      <SectionCard title={tr.sections.personal} icon={<User className="h-5 w-5" />}>
        <div>
          <label className={labelCls}>{tr.headingLabel} *</label>
          <select value={tdata.heading} onChange={(e) => setT('heading', e.target.value as TraditionalData['heading'])} className={inputCls}>
            <option value="RESUME">{tr.headingResume}</option>
            <option value="CURRICULUM VITAE">{tr.headingCV}</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2" {...tradErrAttr('name')}>
            <label className={labelCls}>{tr.fullName} *</label>
            <input type="text" value={tdata.name} onChange={(e) => setT('name', e.target.value)} className={tradInput('name')} />
          </div>
          <div {...tradErrAttr('house')}>
            <label className={labelCls}>{tr.houseNo} *</label>
            <input type="text" value={tdata.house} onChange={(e) => setT('house', e.target.value)} className={tradInput('house')} />
          </div>
          <div>
            <label className={labelCls}>{tr.landmark}</label>
            <input type="text" value={tdata.landmark} onChange={(e) => setT('landmark', e.target.value)} className={inputCls} />
          </div>
          <div className="col-span-2" {...tradErrAttr('area')}>
            <label className={labelCls}>{tr.area} *</label>
            <input type="text" value={tdata.area} onChange={(e) => setT('area', e.target.value)} className={tradInput('area')} />
          </div>
          <div {...tradErrAttr('state')}>
            <label className={labelCls}>{tr.stateCity} *</label>
            <input type="text" value={tdata.state} onChange={(e) => setT('state', e.target.value)} className={tradInput('state')} />
          </div>
          <div {...tradErrAttr('pincode')}>
            <label className={labelCls}>{tr.pincode} *</label>
            <input type="text" inputMode="numeric" value={tdata.pincode} onChange={(e) => setT('pincode', e.target.value)} className={tradInput('pincode')} />
          </div>
          <div {...tradErrAttr('mobile')}>
            <label className={labelCls}>{tr.mobile} *</label>
            <input type="tel" value={tdata.mobile} onChange={(e) => setT('mobile', e.target.value)} className={tradInput('mobile')} />
          </div>
          <div>
            <label className={labelCls}>{tr.email}</label>
            <input type="email" value={tdata.email} onChange={(e) => setT('email', e.target.value)} className={inputCls} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>{tr.profile}</label>
            <input
              type="text"
              value={tdata.profile}
              onChange={(e) => setT('profile', e.target.value)}
              placeholder={tr.profilePlaceholder}
              className={inputCls}
            />
          </div>
          <div className="col-span-2">
            <span className={labelCls}>{tr.photoLabel}</span>
            <div className="flex items-center gap-3">
              {tdata.photo ? (
                <img src={tdata.photo} alt="" className="h-14 w-14 rounded object-cover ring-1 ring-graphite-200 dark:ring-graphite-700" />
              ) : (
                <span className="flex h-14 w-14 items-center justify-center rounded bg-graphite-100 text-graphite-400 dark:bg-graphite-800 dark:text-graphite-500">
                  <Camera className="h-6 w-6" />
                </span>
              )}
              <button
                type="button"
                onClick={() => tradPhotoInputRef.current?.click()}
                className="rounded-lg border border-graphite-200 px-3 py-2 text-xs font-semibold text-graphite-600 transition hover:border-brand-400 hover:text-brand-600 dark:border-graphite-700 dark:text-graphite-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
              >
                {tdata.photo ? tr.photoChange : tr.photoUpload}
              </button>
              {tdata.photo && (
                <button
                  type="button"
                  onClick={() => setT('photo', null)}
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  {tr.photoRemove}
                </button>
              )}
            </div>
            <input
              ref={tradPhotoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                onTradPhotoFile(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </div>
        </div>
      </SectionCard>

      {/* career objective */}
      <SectionCard title={tr.sections.objective} icon={<FileText className="h-5 w-5" />}>
        <div>
          <select
            value={tdata.objectivePreset}
            onChange={(e) => setTObjectivePreset(e.target.value as TraditionalData['objectivePreset'])}
            className={inputCls}
          >
            <option value="">{tr.presetSelect}</option>
            <option value="entry">{tr.presetEntry}</option>
            <option value="custom">{tr.presetCustom}</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>{tr.objectiveLabel}</label>
          <textarea
            rows={4}
            value={tdata.objectivePreset === 'entry' ? ENTRY_LEVEL_OBJECTIVE : tdata.objective}
            onChange={(e) => setT('objective', e.target.value)}
            disabled={tdata.objectivePreset !== 'custom'}
            placeholder={tr.objectivePlaceholder}
            className={`${inputCls} resize-y disabled:opacity-60`}
          />
        </div>
      </SectionCard>

      {/* qualification */}
      <SectionCard title={tr.sections.qualification} icon={<GraduationCap className="h-5 w-5" />}>
        {tdata.qualifications.map((q, i) => (
          <div key={i} className="rounded-xl border border-graphite-100 p-4 dark:border-graphite-800">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-graphite-400 dark:text-graphite-500">#{i + 1}</span>
              {tdata.qualifications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTQual(i)}
                  className={`${iconBtnCls} hover:!border-red-400 hover:!text-red-500`}
                  aria-label={tr.remove}
                  title={tr.remove}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={labelCls}>{tr.qualDegree} *</label>
                <input type="text" value={q.degree} onChange={(e) => updTQual(i, { degree: e.target.value })} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>{tr.qualUniversity} *</label>
                <input type="text" value={q.university} onChange={(e) => updTQual(i, { university: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{tr.qualYear} *</label>
                <input type="text" value={q.year} onChange={(e) => updTQual(i, { year: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{tr.qualGpa} *</label>
                <input type="text" value={q.gpa} onChange={(e) => updTQual(i, { gpa: e.target.value })} className={inputCls} />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addTQual}
          className="inline-flex items-center gap-2 rounded-lg border border-dashed border-graphite-300 px-4 py-2.5 text-sm font-semibold text-graphite-600 transition hover:border-brand-400 hover:text-brand-600 dark:border-graphite-700 dark:text-graphite-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
        >
          <Plus className="h-4 w-4" weight="bold" />
          {tr.addMore}
        </button>
      </SectionCard>

      {/* other qualification bullets */}
      <SectionCard title={tr.sections.otherQual} icon={<Star className="h-5 w-5" />}>
        {tdata.otherQual.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={s}
              onChange={(e) => updTBulletList('otherQual', i, e.target.value)}
              placeholder={tr.bulletPlaceholder}
              className={inputCls}
            />
            <button
              type="button"
              onClick={() => removeTBullet('otherQual', i)}
              className={`${iconBtnCls} shrink-0 hover:!border-red-400 hover:!text-red-500`}
              aria-label={tr.remove}
              title={tr.remove}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addTBullet('otherQual')}
          className="inline-flex items-center gap-2 rounded-lg border border-dashed border-graphite-300 px-4 py-2.5 text-sm font-semibold text-graphite-600 transition hover:border-brand-400 hover:text-brand-600 dark:border-graphite-700 dark:text-graphite-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
        >
          <Plus className="h-4 w-4" weight="bold" />
          {tr.addPoint}
        </button>
      </SectionCard>

      {/* work experience bullets */}
      <SectionCard title={tr.sections.experience} icon={<Briefcase className="h-5 w-5" />}>
        {tdata.experience.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={s}
              onChange={(e) => updTBulletList('experience', i, e.target.value)}
              placeholder={tr.bulletPlaceholder}
              className={inputCls}
            />
            <button
              type="button"
              onClick={() => removeTBullet('experience', i)}
              className={`${iconBtnCls} shrink-0 hover:!border-red-400 hover:!text-red-500`}
              aria-label={tr.remove}
              title={tr.remove}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addTBullet('experience')}
          className="inline-flex items-center gap-2 rounded-lg border border-dashed border-graphite-300 px-4 py-2.5 text-sm font-semibold text-graphite-600 transition hover:border-brand-400 hover:text-brand-600 dark:border-graphite-700 dark:text-graphite-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
        >
          <Plus className="h-4 w-4" weight="bold" />
          {tr.addPoint}
        </button>
      </SectionCard>

      {/* custom sections */}
      <SectionCard title={tr.sections.custom} icon={<ListPlus className="h-5 w-5" />}>
        {tdata.customSections.map((s) => (
          <div key={s.id} className="rounded-xl border border-graphite-100 p-4 dark:border-graphite-800">
            <div className="mb-3 flex items-end gap-3">
              <div className="flex-1">
                <label className={labelCls}>{tr.sectionTitle}</label>
                <input
                  type="text"
                  value={s.title}
                  onChange={(e) => updTradCustomSection(s.id, { title: e.target.value })}
                  className={inputCls}
                />
              </div>
              <button
                type="button"
                onClick={() => removeTradCustomSection(s.id)}
                className={`${iconBtnCls} mb-0.5 hover:!border-red-400 hover:!text-red-500`}
                aria-label={tr.remove}
                title={tr.remove}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div>
              <label className={labelCls}>{tr.contentType}: {s.type === 'text' ? tr.typeText : tr.typeBullets}</label>
              {s.type === 'text' ? (
                <textarea
                  rows={3}
                  value={s.content}
                  onChange={(e) => updTradCustomSection(s.id, { content: e.target.value })}
                  className={`${inputCls} resize-y`}
                />
              ) : (
                s.bullets.map((bl, bi) => (
                  <div key={bi} className="mb-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={bl}
                      onChange={(e) =>
                        updTradCustomSection(s.id, {
                          bullets: s.bullets.map((x, j) => (j === bi ? e.target.value : x)),
                        })
                      }
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updTradCustomSection(s.id, { bullets: s.bullets.filter((_, j) => j !== bi) })
                      }
                      className={`${iconBtnCls} shrink-0 hover:!border-red-400 hover:!text-red-500`}
                      aria-label={tr.remove}
                      title={tr.remove}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
              {s.type === 'bullets' && (
                <button
                  type="button"
                  onClick={() => updTradCustomSection(s.id, { bullets: [...s.bullets, ''] })}
                  className="mt-1 inline-flex items-center gap-2 rounded-lg border border-dashed border-graphite-300 px-3 py-2 text-xs font-semibold text-graphite-600 transition hover:border-brand-400 hover:text-brand-600 dark:border-graphite-700 dark:text-graphite-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
                >
                  <Plus className="h-3.5 w-3.5" weight="bold" />
                  {tr.addPoint}
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setTradModal({ title: '', type: 'text' })}
          className="inline-flex items-center gap-2 rounded-lg border border-dashed border-graphite-300 px-4 py-2.5 text-sm font-semibold text-graphite-600 transition hover:border-brand-400 hover:text-brand-600 dark:border-graphite-700 dark:text-graphite-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
        >
          <Plus className="h-4 w-4" weight="bold" />
          {tr.addNewSection}
        </button>
      </SectionCard>

      {/* personal information */}
      <SectionCard title={tr.sections.personalInfo} icon={<User className="h-5 w-5" />}>
        <div>
          <span className={labelCls}>{tr.gender} *</span>
          <div className="flex flex-wrap gap-4">
            {(['Male', 'Female', 'Others'] as const).map((g) => (
              <label key={g} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-graphite-700 dark:text-graphite-200">
                <input
                  type="radio"
                  name="trad-gender"
                  checked={tdata.gender === g}
                  onChange={() => setT('gender', g)}
                  className="h-4 w-4 accent-[#0084D1]"
                />
                {g === 'Male' ? tr.genderMale : g === 'Female' ? tr.genderFemale : tr.genderOthers}
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2" {...tradErrAttr('fatherName')}>
            <label className={labelCls}>{tr.fatherName} *</label>
            <input type="text" value={tdata.fatherName} onChange={(e) => setT('fatherName', e.target.value)} className={tradInput('fatherName')} />
          </div>
          <div {...tradErrAttr('dob')}>
            <label className={labelCls}>{tr.dob} *</label>
            <input type="date" value={tdata.dob} onChange={(e) => setT('dob', e.target.value)} className={tradInput('dob')} />
          </div>
          <div className="col-span-2" {...tradErrAttr('languages')}>
            <label className={labelCls}>{tr.languages} *</label>
            <input
              type="text"
              value={tdata.languages}
              onChange={(e) => setT('languages', e.target.value)}
              placeholder={tr.languagesPlaceholder}
              className={tradInput('languages')}
            />
          </div>
          <div className="col-span-2" {...tradErrAttr('nationality')}>
            <label className={labelCls}>{tr.nationality} *</label>
            <input
              type="text"
              value={tdata.nationality}
              onChange={(e) => setT('nationality', e.target.value)}
              placeholder={tr.nationalityPlaceholder}
              className={tradInput('nationality')}
            />
          </div>
        </div>
        <div>
          <span className={labelCls}>{tr.maritalStatus}</span>
          <div className="flex flex-wrap gap-4">
            {(['Married', 'Unmarried'] as const).map((m) => (
              <label key={m} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-graphite-700 dark:text-graphite-200">
                <input
                  type="radio"
                  name="trad-marital"
                  checked={tdata.maritalStatus === m}
                  onChange={() => setT('maritalStatus', m)}
                  className="h-4 w-4 accent-[#0084D1]"
                />
                {m === 'Married' ? tr.married : tr.unmarried}
              </label>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* add-section modal */}
      {tradModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-graphite-900">
            <h3 className="text-lg font-bold text-graphite-900 dark:text-white">{tr.modalTitle}</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className={labelCls}>{tr.sectionTitle} *</label>
                <input
                  type="text"
                  value={tradModal.title}
                  onChange={(e) => setTradModal({ ...tradModal, title: e.target.value })}
                  className={inputCls}
                  autoFocus
                />
              </div>
              <div>
                <label className={labelCls}>{tr.contentType}</label>
                <select
                  value={tradModal.type}
                  onChange={(e) => setTradModal({ ...tradModal, type: e.target.value as 'text' | 'bullets' })}
                  className={inputCls}
                >
                  <option value="text">{tr.typeText}</option>
                  <option value="bullets">{tr.typeBullets}</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setTradModal(null)}
                className="rounded-lg border border-graphite-200 px-4 py-2 text-sm font-semibold text-graphite-600 transition hover:border-graphite-300 dark:border-graphite-700 dark:text-graphite-300"
              >
                {tr.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!tradModal.title.trim()) return;
                  addTradCustomSection(tradModal.title.trim(), tradModal.type);
                  setTradModal(null);
                }}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                {tr.addSection}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div ref={rootRef} dir={rtl ? 'rtl' : 'ltr'}>
      <style>{PRINT_CSS}</style>

      {/* ============ action bar ============ */}
      <div className="rf-no-print flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => (data.template === 'traditional' ? downloadTraditional() : window.print())}
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
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
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
          {/* customize — shown for every template (photo toggle only where it applies) */}
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
            {data.template !== 'traditional' && (
              <Switch checked={data.showPhoto} onChange={(v) => set('showPhoto', v)} label={b.showPhotoLabel} />
            )}
          </SectionCard>

          {data.template === 'traditional' ? (
            renderTraditionalForm()
          ) : (
            <>
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
            </>
          )}
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
              {data.template === 'traditional' ? ResumeTraditional(tdata, data.accent, data.font) : activeTemplate.render(data, t)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
