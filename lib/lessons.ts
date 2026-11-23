/**
 * A1 lesson content (R-LV-01). Flemish (nl-BE) wording comes first.
 *
 * NOT REVIEWED (R-LV-03): no native speaker has checked these lessons yet.
 * `review` stays null until a reviewer signs off, and `nlNL` flags phrases
 * where Belgian and Netherlands Dutch differ.
 */

export type Level = "A1" | "A2" | "B1";
export type Skill = "read" | "listen" | "write" | "speak";
export const SKILLS: readonly Skill[] = ["read", "listen", "write", "speak"] as const;

export interface Phrase {
  nl: string;
  en: string;
  /** Netherlands (nl-NL) wording, set only where it differs from the Flemish phrase. */
  nlNL?: string;
}

export interface Review {
  reviewer: string;
  date: string; // ISO date
}

export interface Lesson {
  id: string;
  title: string;
  emoji: string;
  level: Level;
  phrases: Phrase[];
  review: Review | null;
}

export const LESSONS: Lesson[] = [
  {
    id: "greetings",
    title: "Greetings",
    emoji: "👋",
    level: "A1",
    review: null,
    phrases: [
      { nl: "Hallo!", en: "Hello!" },
      { nl: "Goeiemorgen!", en: "Good morning!", nlNL: "Goedemorgen!" },
      { nl: "Goeienavond!", en: "Good evening!", nlNL: "Goedenavond!" },
      { nl: "Hoe gaat het?", en: "How are you?" },
      { nl: "Goed, dank u.", en: "Fine, thank you." },
      { nl: "Tot straks!", en: "See you later!" },
    ],
  },
  {
    id: "introductions",
    title: "Introducing yourself",
    emoji: "🙋",
    level: "A1",
    review: null,
    phrases: [
      { nl: "Hoe heet u?", en: "What is your name?" },
      { nl: "Ik woon in Antwerpen.", en: "I live in Antwerp." },
      { nl: "Ik werk hier.", en: "I work here." },
      { nl: "Aangenaam.", en: "Nice to meet you." },
      { nl: "Ik spreek een beetje Nederlands.", en: "I speak a little Dutch." },
      { nl: "Waar woont u?", en: "Where do you live?" },
    ],
  },
  {
    id: "numbers",
    title: "Numbers and prices",
    emoji: "🔢",
    level: "A1",
    review: null,
    phrases: [
      { nl: "Hoeveel kost het?", en: "How much does it cost?" },
      { nl: "Het kost vijf euro.", en: "It costs five euros." },
      { nl: "Twee koffie, alstublieft.", en: "Two coffees, please." },
      { nl: "Ik ben dertig jaar.", en: "I am thirty years old." },
      { nl: "Ik heb drie kinderen.", en: "I have three children." },
      { nl: "Het is tien uur.", en: "It is ten o'clock." },
    ],
  },
  {
    id: "cafe",
    title: "At the café",
    emoji: "☕",
    level: "A1",
    review: null,
    phrases: [
      { nl: "Een koffie, alstublieft.", en: "A coffee, please." },
      { nl: "Wat wilt u drinken?", en: "What would you like to drink?" },
      { nl: "Een glas water, graag.", en: "A glass of water, please." },
      { nl: "Mag ik de rekening?", en: "May I have the bill?" },
      { nl: "Ik betaal met de kaart.", en: "I pay by card." },
      { nl: "Smakelijk!", en: "Enjoy your meal!" },
    ],
  },
  {
    id: "shopping",
    title: "Shopping",
    emoji: "🛒",
    level: "A1",
    review: null,
    phrases: [
      { nl: "Waar is het brood?", en: "Where is the bread?" },
      { nl: "Ik zoek melk.", en: "I am looking for milk." },
      { nl: "Heeft u een zak nodig?", en: "Do you need a bag?" },
      { nl: "Is dit in promotie?", en: "Is this on offer?", nlNL: "Is dit in de aanbieding?" },
      { nl: "Een kilo tomaten, alstublieft.", en: "A kilo of tomatoes, please." },
      { nl: "Dat is alles.", en: "That is all." },
    ],
  },
  {
    id: "getting-around",
    title: "Getting around",
    emoji: "🚋",
    level: "A1",
    review: null,
    phrases: [
      { nl: "Waar is het station?", en: "Where is the station?" },
      { nl: "Welke tram gaat naar het centrum?", en: "Which tram goes to the centre?" },
      { nl: "Ga rechtdoor.", en: "Go straight on." },
      { nl: "Het is hier links.", en: "It is on the left here." },
      { nl: "Een ticket naar Gent, alstublieft.", en: "A ticket to Ghent, please." },
      { nl: "Hoe laat vertrekt de trein?", en: "What time does the train leave?" },
    ],
  },
  {
    id: "time",
    title: "Days and time",
    emoji: "📅",
    level: "A1",
    review: null,
    phrases: [
      { nl: "Hoe laat is het?", en: "What time is it?" },
      { nl: "Het is half drie.", en: "It is half past two." },
      { nl: "Vandaag is het maandag.", en: "Today is Monday." },
      { nl: "Morgen werk ik niet.", en: "I am not working tomorrow." },
      { nl: "Ik heb een afspraak om negen uur.", en: "I have an appointment at nine o'clock." },
      { nl: "Tot volgende week!", en: "See you next week!" },
    ],
  },
  {
    id: "help",
    title: "Asking for help",
    emoji: "🙏",
    level: "A1",
    review: null,
    phrases: [
      { nl: "Sorry, ik begrijp het niet.", en: "Sorry, I don't understand." },
      { nl: "Kunt u dat herhalen?", en: "Can you repeat that?" },
      { nl: "Kunt u wat trager spreken?", en: "Can you speak a bit more slowly?", nlNL: "Kunt u wat langzamer spreken?" },
      { nl: "Spreekt u Engels?", en: "Do you speak English?" },
      { nl: "Dank u wel.", en: "Thank you very much." },
      { nl: "Graag gedaan.", en: "You're welcome." },
    ],
  },
];

export interface LockedLevel {
  level: Level;
  title: string;
}

/** Shown as "coming soon" cards. The A2 unlock rule is an open assumption (R-LV-05). */
export const LOCKED_LEVELS: LockedLevel[] = [
  { level: "A2", title: "A2 Elementary" },
  { level: "B1", title: "B1 Intermediate" },
];

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function isSkill(value: unknown): value is Skill {
  return typeof value === "string" && (SKILLS as readonly string[]).includes(value);
}

export const XP_PER_SKILL = 10;
