/**
 * A1 lesson content (R-LV-01). Flemish (nl-BE) wording comes first.
 *
 * NOT REVIEWED (R-LV-03): no native speaker has checked these lessons yet.
 * `review` stays null until a reviewer signs off, and `nlNL` flags phrases
 * where Belgian and Netherlands Dutch differ.
 */

export type Level = "A1" | "A2" | "B1";
/** Lesson order: see the phrases, learn the grammar, then type and say them. Every answer is typed. */
export type Skill = "read" | "grammar" | "listen" | "write" | "speak";
export const SKILLS: readonly Skill[] = ["read", "grammar", "listen", "write", "speak"] as const;

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
  {
    id: "family",
    title: "Family",
    emoji: "👪",
    level: "A1",
    review: null,
    phrases: [
      { nl: "Dit is mijn moeder.", en: "This is my mother." },
      { nl: "Mijn broer woont in Brussel.", en: "My brother lives in Brussels." },
      { nl: "Hoe heet uw dochter?", en: "What is your daughter's name?" },
      { nl: "Haar man werkt in een winkel.", en: "Her husband works in a shop." },
      { nl: "Wij hebben twee zonen.", en: "We have two sons." },
      { nl: "Hun kinderen gaan naar school.", en: "Their children go to school." },
    ],
  },
  {
    id: "clothes",
    title: "Clothes and looks",
    emoji: "🧥",
    level: "A1",
    review: null,
    phrases: [
      { nl: "Ik draag een blauwe jas.", en: "I am wearing a blue coat." },
      { nl: "Het is een mooie trui.", en: "It is a nice jumper." },
      { nl: "Die broek is te groot.", en: "Those trousers are too big." },
      { nl: "Ze heeft lang bruin haar.", en: "She has long brown hair." },
      { nl: "Hij ziet er moe uit.", en: "He looks tired." },
      { nl: "Mag ik deze schoenen passen?", en: "May I try on these shoes?" },
    ],
  },
  {
    id: "food",
    title: "Food you like",
    emoji: "🍟",
    level: "A1",
    review: null,
    phrases: [
      { nl: "Ik eet graag vis.", en: "I like eating fish." },
      { nl: "Ik drink liever thee.", en: "I'd rather drink tea." },
      { nl: "Ik vind spruitjes niet lekker.", en: "I don't like sprouts." },
      { nl: "Wat eet je het liefst?", en: "What do you like eating most?" },
      { nl: "Frietjes zijn lekkerder dan rijst.", en: "Chips are tastier than rice.", nlNL: "Patat is lekkerder dan rijst." },
      { nl: "Dat is te zout.", en: "That is too salty." },
    ],
  },
  {
    id: "day",
    title: "My day",
    emoji: "⏰",
    level: "A1",
    review: null,
    phrases: [
      { nl: "Ik sta om zeven uur op.", en: "I get up at seven o'clock." },
      { nl: "Ik was me en ik kleed me aan.", en: "I wash and get dressed." },
      { nl: "Ik vertrek om acht uur.", en: "I leave at eight o'clock." },
      { nl: "De bus komt om tien over acht aan.", en: "The bus arrives at ten past eight." },
      { nl: "Ik bel je vanavond op.", en: "I'll call you tonight." },
      { nl: "Ik ga om elf uur slapen.", en: "I go to sleep at eleven." },
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
