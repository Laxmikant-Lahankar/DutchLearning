/**
 * A1 grammar, one short lesson per unit. The sequence follows a published A1 course;
 * every explanation, example and drill here is original. Every answer is typed (no multiple choice).
 *
 * NOT REVIEWED (R-LV-03): a native speaker must check this content before launch.
 *
 * Text markup: *word* marks Dutch inside English text; it renders in the Dutch typeface with lang="nl-BE".
 * Gap drills contain exactly one "___". Answers are compared ignoring case, accents and punctuation.
 */

export interface GrammarSection {
  heading: string;
  text: string[];
  /** Two-column table: Dutch form, English. */
  table?: [string, string][];
  examples?: { nl: string; en: string }[];
}

export type Drill =
  | { kind: "gap"; text: string; hint: string; answers: string[]; en: string }
  | { kind: "rewrite"; task: string; from: string; answers: string[] }
  | { kind: "translate"; en: string; hint?: string; answers: string[] };

export interface GrammarLesson {
  title: string;
  summary: string;
  sections: GrammarSection[];
  drills: Drill[];
}

/** Keyed by vocabulary lesson id: each unit pairs its phrases with one grammar point. */
export const GRAMMAR: Record<string, GrammarLesson> = {
  greetings: {
    title: "I am, you are: zijn",
    summary: "The most used verb in Dutch, and the words for I, you, he and she.",
    sections: [
      {
        heading: "Who is who",
        text: [
          "Dutch has two words for *you*. Use *jij* (or the short *je*) with friends, family and children. Use *u* with people you don't know, older people, and at work or in shops.",
          "*Zij* means both *she* and *they*; the verb tells you which. The short forms *je*, *ze* and *we* are very common in speech.",
        ],
        table: [
          ["ik", "I"],
          ["jij / je", "you (informal)"],
          ["u", "you (polite)"],
          ["hij / zij / het", "he / she / it"],
          ["wij / we", "we"],
          ["jullie", "you (more than one)"],
          ["zij / ze", "they"],
        ],
      },
      {
        heading: "zijn: to be",
        text: ["*Zijn* is irregular, so learn it by heart. It's worth it: you'll use it in almost every conversation."],
        table: [
          ["ik ben", "I am"],
          ["jij bent", "you are"],
          ["u bent", "you are (polite)"],
          ["hij / zij / het is", "he / she / it is"],
          ["wij zijn", "we are"],
          ["jullie zijn", "you are"],
          ["zij zijn", "they are"],
        ],
        examples: [
          { nl: "Ik ben moe.", en: "I am tired." },
          { nl: "Zij is verpleegster.", en: "She is a nurse." },
        ],
      },
    ],
    drills: [
      { kind: "gap", text: "Ik ___ moe.", hint: "zijn", answers: ["ben"], en: "I am tired." },
      { kind: "gap", text: "Hij ___ in Gent.", hint: "zijn", answers: ["is"], en: "He is in Ghent." },
      { kind: "gap", text: "Wij ___ uit India.", hint: "zijn", answers: ["zijn"], en: "We are from India." },
      { kind: "gap", text: "U ___ welkom.", hint: "zijn", answers: ["bent"], en: "You are welcome." },
      { kind: "gap", text: "Jullie ___ te laat.", hint: "zijn", answers: ["zijn"], en: "You are too late." },
      { kind: "gap", text: "Dit is Ana. ___ woont in Leuven.", hint: "she", answers: ["Zij", "Ze"], en: "This is Ana. She lives in Leuven." },
      { kind: "translate", en: "She is a nurse.", answers: ["Zij is verpleegster.", "Ze is verpleegster.", "Zij is verpleegkundige.", "Ze is verpleegkundige."] },
      { kind: "translate", en: "We are in Antwerp.", answers: ["Wij zijn in Antwerpen.", "We zijn in Antwerpen."] },
    ],
  },

  introductions: {
    title: "Present tense: ik woon, jij woont",
    summary: "How to make almost any verb work for I, you, she and we.",
    sections: [
      {
        heading: "Find the stem",
        text: [
          "Dutch verbs are listed with *-en* at the end: *wonen* (to live), *werken* (to work). Take off *-en* and you have the stem: *woon*, *werk*.",
          "Then: *ik* + stem. *Jij*, *u*, *hij*, *zij* and *het* + stem + *t*. *Wij*, *jullie* and plural *zij* use the full verb.",
        ],
        table: [
          ["ik werk", "I work"],
          ["jij werkt", "you work"],
          ["u werkt", "you work (polite)"],
          ["hij / zij werkt", "he / she works"],
          ["wij werken", "we work"],
          ["jullie werken", "you work"],
          ["zij werken", "they work"],
        ],
      },
      {
        heading: "Spelling the stem",
        text: [
          "A long vowel stays long, so it is written double: *wonen* → *woon*, *spreken* → *spreek*.",
          "A double consonant becomes single: *zitten* → *zit*. A stem never ends in *z* or *v*: *lezen* → *lees*, *leven* → *leef*.",
          "If the stem already ends in *t*, don't add another: *hij zit*, not *zitt*.",
        ],
        examples: [
          { nl: "Ik woon in Antwerpen.", en: "I live in Antwerp." },
          { nl: "Zij spreekt Engels.", en: "She speaks English." },
        ],
      },
    ],
    drills: [
      { kind: "gap", text: "Ik ___ in Antwerpen.", hint: "wonen", answers: ["woon"], en: "I live in Antwerp." },
      { kind: "gap", text: "Zij ___ Engels.", hint: "spreken", answers: ["spreekt"], en: "She speaks English." },
      { kind: "gap", text: "Wij ___ in een winkel.", hint: "werken", answers: ["werken"], en: "We work in a shop." },
      { kind: "gap", text: "Hij ___ koffie.", hint: "drinken", answers: ["drinkt"], en: "He drinks coffee." },
      { kind: "gap", text: "Ik ___ een boek.", hint: "lezen", answers: ["lees"], en: "I am reading a book." },
      { kind: "gap", text: "Jullie ___ in Gent.", hint: "wonen", answers: ["wonen"], en: "You live in Ghent." },
      { kind: "gap", text: "Het kind ___ op de stoel.", hint: "zitten", answers: ["zit"], en: "The child is sitting on the chair." },
      { kind: "translate", en: "She works here.", answers: ["Zij werkt hier.", "Ze werkt hier."] },
    ],
  },

  numbers: {
    title: "hebben, and more than one",
    summary: "To have, and how to make plurals.",
    sections: [
      {
        heading: "hebben: to have",
        text: ["*Hebben* is irregular. With *u* you can say *u hebt* or *u heeft*; both are correct."],
        table: [
          ["ik heb", "I have"],
          ["jij hebt", "you have"],
          ["u hebt / u heeft", "you have (polite)"],
          ["hij / zij heeft", "he / she has"],
          ["wij hebben", "we have"],
          ["jullie hebben", "you have"],
          ["zij hebben", "they have"],
        ],
      },
      {
        heading: "Plurals: -en or -s",
        text: [
          "Most words add *-en*: *boek* → *boeken*. The vowel keeps its sound, so the spelling may change: *tomaat* → *tomaten*, *bus* → *bussen*.",
          "Words ending in *-el*, *-er*, *-em* or *-je* add *-s*: *tafel* → *tafels*. Words ending in *a*, *o*, *u* or *i* add *'s*: *euro* → *euro's*.",
          "A few are irregular. The one you'll need first: *kind* → *kinderen*.",
        ],
      },
    ],
    drills: [
      { kind: "gap", text: "Ik ___ twee kinderen.", hint: "hebben", answers: ["heb"], en: "I have two children." },
      { kind: "gap", text: "Zij ___ een auto.", hint: "hebben", answers: ["heeft"], en: "She has a car." },
      { kind: "gap", text: "Wij ___ geen tijd.", hint: "hebben", answers: ["hebben"], en: "We have no time." },
      { kind: "gap", text: "één boek, twee ___", hint: "boek", answers: ["boeken"], en: "one book, two books" },
      { kind: "gap", text: "één tomaat, drie ___", hint: "tomaat", answers: ["tomaten"], en: "one tomato, three tomatoes" },
      { kind: "gap", text: "één tafel, vier ___", hint: "tafel", answers: ["tafels"], en: "one table, four tables" },
      { kind: "gap", text: "één euro, vijf ___", hint: "euro", answers: ["euro's"], en: "one euro, five euros" },
      { kind: "gap", text: "één bus, twee ___", hint: "bus", answers: ["bussen"], en: "one bus, two buses" },
      { kind: "gap", text: "één kind, drie ___", hint: "kind", answers: ["kinderen"], en: "one child, three children" },
    ],
  },

  cafe: {
    title: "Asking questions",
    summary: "Put the verb first, and watch what happens to jij.",
    sections: [
      {
        heading: "Yes or no questions",
        text: [
          "Swap the verb and the person: *U woont hier* → *Woont u hier?*",
          "With *jij* or *je* after the verb, the *-t* drops: *Jij werkt hier* → *Werk jij hier?* This only happens with *jij* and *je*.",
        ],
        examples: [
          { nl: "Woont u hier?", en: "Do you live here?" },
          { nl: "Werk jij hier?", en: "Do you work here?" },
        ],
      },
      {
        heading: "Question words",
        text: ["Put the question word first, then the verb, then the person: *Waar woon jij?*"],
        table: [
          ["wie", "who"],
          ["wat", "what"],
          ["waar", "where"],
          ["wanneer", "when"],
          ["hoe", "how"],
          ["hoeveel", "how much, how many"],
          ["waarom", "why"],
        ],
      },
    ],
    drills: [
      { kind: "rewrite", task: "Make it a question.", from: "U woont in Gent.", answers: ["Woont u in Gent?"] },
      { kind: "rewrite", task: "Make it a question.", from: "Hij spreekt Engels.", answers: ["Spreekt hij Engels?"] },
      { kind: "rewrite", task: "Make it a question.", from: "Jij werkt hier.", answers: ["Werk jij hier?", "Werk je hier?"] },
      { kind: "gap", text: "___ woont u?", hint: "where", answers: ["Waar"], en: "Where do you live?" },
      { kind: "gap", text: "___ kost de koffie?", hint: "how much", answers: ["Hoeveel"], en: "How much is the coffee?" },
      { kind: "gap", text: "Wat ___ jij?", hint: "drinken", answers: ["drink"], en: "What are you drinking?" },
      { kind: "translate", en: "Do you speak Dutch? (to a friend)", answers: ["Spreek jij Nederlands?", "Spreek je Nederlands?"] },
      { kind: "translate", en: "When does the bus come?", answers: ["Wanneer komt de bus?"] },
    ],
  },

  shopping: {
    title: "Saying no: niet and geen",
    summary: "Two words for not, and when to use each.",
    sections: [
      {
        heading: "geen",
        text: [
          "Use *geen* instead of *een*, or before a noun with no article: *Ik heb een fiets* → *Ik heb geen fiets*. *Ik drink koffie* → *Ik drink geen koffie*.",
        ],
      },
      {
        heading: "niet",
        text: [
          "Use *niet* everywhere else. In a short sentence it usually goes at the end: *Ik werk vandaag niet.*",
          "It comes before a describing word or a place: *Het is niet duur.* *Ik woon niet in Gent.*",
        ],
        examples: [
          { nl: "Ik koop de tomaten niet.", en: "I'm not buying the tomatoes." },
          { nl: "Het brood is niet duur.", en: "The bread isn't expensive." },
        ],
      },
    ],
    drills: [
      { kind: "rewrite", task: "Make it negative.", from: "Ik heb een auto.", answers: ["Ik heb geen auto."] },
      { kind: "rewrite", task: "Make it negative.", from: "Ik werk vandaag.", answers: ["Ik werk vandaag niet."] },
      { kind: "rewrite", task: "Make it negative.", from: "Het brood is duur.", answers: ["Het brood is niet duur."] },
      { kind: "rewrite", task: "Make it negative.", from: "Wij drinken melk.", answers: ["Wij drinken geen melk.", "We drinken geen melk."] },
      { kind: "rewrite", task: "Make it negative.", from: "Hij woont in Brussel.", answers: ["Hij woont niet in Brussel."] },
      { kind: "gap", text: "Ik heb ___ tijd.", hint: "not, no", answers: ["geen"], en: "I have no time." },
      { kind: "gap", text: "Dat is ___ lekker.", hint: "not", answers: ["niet"], en: "That isn't tasty." },
      { kind: "translate", en: "I don't understand.", answers: ["Ik begrijp het niet."] },
    ],
  },

  "getting-around": {
    title: "can, want, must: two verbs together",
    summary: "kunnen, willen, moeten and gaan, with the second verb at the end.",
    sections: [
      {
        heading: "The helping verbs",
        text: ["These verbs are irregular. *Jij kunt* and *jij wilt* are standard; you'll also hear *jij kan* and *jij wil*."],
        table: [
          ["ik kan · jij kunt · hij kan · wij kunnen", "can"],
          ["ik wil · jij wilt · hij wil · wij willen", "want"],
          ["ik moet · jij moet · hij moet · wij moeten", "must, have to"],
          ["ik ga · jij gaat · hij gaat · wij gaan", "go, be going to"],
        ],
      },
      {
        heading: "The other verb goes to the end",
        text: [
          "The helping verb takes second place. The main verb stays whole (with *-en*) and moves to the very end of the sentence.",
          "*Gaan* + verb talks about plans: *Ik ga morgen werken* means *I'm going to work tomorrow*.",
        ],
        examples: [
          { nl: "Ik wil een ticket kopen.", en: "I want to buy a ticket." },
          { nl: "Je moet de tram nemen.", en: "You have to take the tram." },
        ],
      },
    ],
    drills: [
      { kind: "gap", text: "Ik ___ naar Gent gaan.", hint: "willen", answers: ["wil"], en: "I want to go to Ghent." },
      { kind: "gap", text: "___ u dat herhalen?", hint: "kunnen", answers: ["Kunt"], en: "Can you repeat that?" },
      { kind: "gap", text: "Wij ___ om acht uur vertrekken.", hint: "moeten", answers: ["moeten"], en: "We have to leave at eight." },
      { kind: "gap", text: "Hij ___ morgen werken.", hint: "gaan", answers: ["gaat"], en: "He is going to work tomorrow." },
      { kind: "rewrite", task: "Add willen (ik wil).", from: "Ik koop een ticket.", answers: ["Ik wil een ticket kopen."] },
      { kind: "rewrite", task: "Add moeten (jij moet).", from: "Jij neemt de tram.", answers: ["Jij moet de tram nemen.", "Je moet de tram nemen."] },
      { kind: "translate", en: "I can't come tomorrow.", answers: ["Ik kan morgen niet komen."] },
      { kind: "translate", en: "We are going to eat.", answers: ["Wij gaan eten.", "We gaan eten."] },
    ],
  },

  time: {
    title: "The verb comes second",
    summary: "Start with a time word and the person moves behind the verb.",
    sections: [
      {
        heading: "Verb in second place",
        text: [
          "In a Dutch statement the verb is always the second part. If you start with something else, like a time, the person moves after the verb.",
          "*Ik werk morgen niet* → *Morgen werk ik niet.* With *jij* or *je*, the *-t* drops again: *Morgen werk jij laat.*",
        ],
        examples: [
          { nl: "Vandaag is het maandag.", en: "Today is Monday." },
          { nl: "Om negen uur heb ik een afspraak.", en: "At nine o'clock I have an appointment." },
        ],
      },
    ],
    drills: [
      { kind: "rewrite", task: "Start with Morgen.", from: "Ik werk niet.", answers: ["Morgen werk ik niet."] },
      { kind: "rewrite", task: "Start with Zaterdag.", from: "Hij gaat naar Gent.", answers: ["Zaterdag gaat hij naar Gent."] },
      { kind: "rewrite", task: "Start with Om negen uur.", from: "Ik heb een afspraak.", answers: ["Om negen uur heb ik een afspraak."] },
      { kind: "rewrite", task: "Start with Vanavond.", from: "Jij werkt laat.", answers: ["Vanavond werk jij laat.", "Vanavond werk je laat."] },
      { kind: "rewrite", task: "Start with Vandaag.", from: "Wij eten om zes uur.", answers: ["Vandaag eten wij om zes uur.", "Vandaag eten we om zes uur."] },
      { kind: "gap", text: "Morgen ___ ik thuis.", hint: "zijn", answers: ["ben"], en: "Tomorrow I am at home." },
      { kind: "gap", text: "Vandaag ___ jij vrij.", hint: "zijn", answers: ["ben"], en: "Today you are free." },
      { kind: "translate", en: "On Monday I work at home.", answers: ["Maandag werk ik thuis.", "Op maandag werk ik thuis."] },
    ],
  },

  help: {
    title: "Telling and asking politely",
    summary: "Commands, and the polite way to ask for help.",
    sections: [
      {
        heading: "Commands",
        text: [
          "For a command, use just the stem: *komen* → *Kom binnen!* *gaan* → *Ga rechtdoor.*",
          "Small words make it friendlier: *Kom maar binnen* (do come in), *Wacht even* (just a moment).",
        ],
        examples: [
          { nl: "Wacht even.", en: "Wait a moment." },
          { nl: "Doe de deur dicht.", en: "Close the door." },
        ],
      },
      {
        heading: "Asking politely",
        text: [
          "With people you don't know, a question is more polite than a command: *Kunt u dat herhalen?* *Wilt u even wachten?*",
          "Or add *alstublieft* (please, polite) or *alsjeblieft* (please, informal).",
        ],
      },
    ],
    drills: [
      { kind: "gap", text: "___ binnen!", hint: "komen", answers: ["Kom"], en: "Come in!" },
      { kind: "gap", text: "___ rechtdoor.", hint: "gaan", answers: ["Ga"], en: "Go straight on." },
      { kind: "gap", text: "___ even!", hint: "wachten", answers: ["Wacht"], en: "Wait a moment!" },
      { kind: "gap", text: "___ de deur dicht.", hint: "doen", answers: ["Doe"], en: "Close the door." },
      { kind: "gap", text: "___ goed.", hint: "luisteren", answers: ["Luister"], en: "Listen carefully." },
      { kind: "rewrite", task: "Make it a polite question with Kunt u.", from: "Herhaal dat.", answers: ["Kunt u dat herhalen?"] },
      { kind: "rewrite", task: "Make it a command.", from: "Je neemt de tram.", answers: ["Neem de tram."] },
      { kind: "translate", en: "Speak more slowly, please. (polite)", answers: ["Spreek trager, alstublieft.", "Spreek alstublieft trager.", "Spreek langzamer, alstublieft.", "Spreek alstublieft langzamer."] },
    ],
  },

  family: {
    title: "my, your, his: possessives",
    summary: "Words that say whose something is.",
    sections: [
      {
        heading: "Whose is it?",
        text: [
          "*Ons* is for *het*-words (*ons huis*). *Onze* is for *de*-words and plurals (*onze tuin*, *onze kinderen*).",
          "*Jouw* and the short *je* both mean *your* (informal). Use *jouw* when you stress it.",
        ],
        table: [
          ["mijn", "my"],
          ["jouw / je", "your (informal)"],
          ["uw", "your (polite)"],
          ["zijn", "his"],
          ["haar", "her"],
          ["ons / onze", "our"],
          ["jullie", "your (more than one)"],
          ["hun", "their"],
        ],
      },
    ],
    drills: [
      { kind: "gap", text: "Dit is ___ moeder.", hint: "my", answers: ["mijn"], en: "This is my mother." },
      { kind: "gap", text: "Is dat ___ fiets?", hint: "your, informal", answers: ["jouw", "je"], en: "Is that your bike?" },
      { kind: "gap", text: "Hoe heet ___ dochter?", hint: "your, polite", answers: ["uw"], en: "What is your daughter's name?" },
      { kind: "gap", text: "___ broer woont in Brussel.", hint: "her", answers: ["Haar"], en: "Her brother lives in Brussels." },
      { kind: "gap", text: "___ vrouw werkt in Gent.", hint: "his", answers: ["Zijn"], en: "His wife works in Ghent." },
      { kind: "gap", text: "Dit is ___ huis.", hint: "our · het huis", answers: ["ons"], en: "This is our house." },
      { kind: "gap", text: "Dat zijn ___ kinderen.", hint: "our", answers: ["onze"], en: "Those are our children." },
      { kind: "gap", text: "___ ouders wonen in Spanje.", hint: "their", answers: ["Hun"], en: "Their parents live in Spain." },
      { kind: "translate", en: "My sister lives in Antwerp.", answers: ["Mijn zus woont in Antwerpen.", "Mijn zuster woont in Antwerpen."] },
    ],
  },

  clothes: {
    title: "de or het, and describing words",
    summary: "The two words for the, and when a describing word gets an -e.",
    sections: [
      {
        heading: "de and het",
        text: [
          "Dutch has two words for *the*. Most words take *de*; about a third take *het*. Learn each word with its article: *de jas*, *het huis*.",
          "Two rules help: words ending in *-je* always take *het* (*het meisje*), and every plural takes *de* (*de huizen*).",
        ],
      },
      {
        heading: "Adding -e",
        text: [
          "A describing word before a noun usually gets *-e*: *de blauwe jas*, *het blauwe huis*, *een blauwe jas*.",
          "One exception: *een* + a *het*-word, then no *-e*: *een groot huis*. And after the noun, never: *De jas is blauw*.",
          "Spelling follows the vowel: *groot* → *grote*, *wit* → *witte*, *duur* → *dure*.",
        ],
        examples: [
          { nl: "een mooie trui", en: "a nice jumper" },
          { nl: "een groot huis", en: "a big house" },
        ],
      },
    ],
    drills: [
      { kind: "gap", text: "de ___ jas", hint: "blauw", answers: ["blauwe"], en: "the blue coat" },
      { kind: "gap", text: "een ___ huis", hint: "groot · het huis", answers: ["groot"], en: "a big house" },
      { kind: "gap", text: "het ___ huis", hint: "groot", answers: ["grote"], en: "the big house" },
      { kind: "gap", text: "De jas is ___.", hint: "blauw", answers: ["blauw"], en: "The coat is blue." },
      { kind: "gap", text: "een ___ trui", hint: "mooi · de trui", answers: ["mooie"], en: "a nice jumper" },
      { kind: "gap", text: "twee ___ schoenen", hint: "wit", answers: ["witte"], en: "two white shoes" },
      { kind: "gap", text: "___ meisje", hint: "the", answers: ["het"], en: "the girl" },
      { kind: "translate", en: "the red coat", hint: "rood · de jas", answers: ["de rode jas"] },
    ],
  },

  food: {
    title: "like, prefer, most: graag and comparing",
    summary: "Say what you like doing, and compare two things.",
    sections: [
      {
        heading: "graag, liever, het liefst",
        text: [
          "Put *graag* after the verb to say you like doing it: *Ik eet graag vis* (I like eating fish).",
          "*Liever* means you prefer it: *Ik drink liever thee.* *Het liefst* means you like it most.",
        ],
      },
      {
        heading: "Comparing",
        text: [
          "Add *-er* and use *dan* (than): *groot* → *groter dan*. After *r*, add *-der*: *lekker* → *lekkerder*, *duur* → *duurder*.",
          "A few are irregular: *goed* → *beter*, *veel* → *meer*, *graag* → *liever*.",
        ],
        examples: [
          { nl: "Frietjes zijn lekkerder dan rijst.", en: "Chips are tastier than rice." },
          { nl: "Gent is groter dan Brugge.", en: "Ghent is bigger than Bruges." },
        ],
      },
    ],
    drills: [
      { kind: "gap", text: "Ik zwem ___.", hint: "I like swimming", answers: ["graag"], en: "I like swimming." },
      { kind: "gap", text: "Ik drink ___ water dan cola.", hint: "rather", answers: ["liever"], en: "I'd rather drink water than cola." },
      { kind: "gap", text: "Wat eet jij het ___?", hint: "most", answers: ["liefst"], en: "What do you like eating most?" },
      { kind: "gap", text: "Gent is ___ dan Brugge.", hint: "groot", answers: ["groter"], en: "Ghent is bigger than Bruges." },
      { kind: "gap", text: "Deze soep is ___ dan die.", hint: "lekker", answers: ["lekkerder"], en: "This soup is tastier than that one." },
      { kind: "gap", text: "Thee is ___ dan koffie.", hint: "goedkoop", answers: ["goedkoper"], en: "Tea is cheaper than coffee." },
      { kind: "gap", text: "Dit hotel is ___.", hint: "goed → better", answers: ["beter"], en: "This hotel is better." },
      { kind: "translate", en: "I like reading.", answers: ["Ik lees graag."] },
      { kind: "translate", en: "I prefer tea.", answers: ["Ik drink liever thee.", "Ik heb liever thee."] },
    ],
  },

  day: {
    title: "Verbs that split: opstaan → ik sta op",
    summary: "Separable verbs, and washing yourself.",
    sections: [
      {
        heading: "Separable verbs",
        text: [
          "Some verbs start with a small word like *op*, *aan* or *mee*. In a sentence, that small word moves to the end: *opstaan* → *Ik sta om zeven uur op.*",
          "With a helping verb, the verb stays in one piece at the end: *Ik moet vroeg opstaan.*",
          "Verbs starting with *be-*, *ge-*, *ver-* or *ont-* never split: *Ik vertrek om acht uur.*",
        ],
        examples: [
          { nl: "De trein komt om tien uur aan.", en: "The train arrives at ten o'clock." },
          { nl: "Ik bel je morgen op.", en: "I'll call you tomorrow." },
        ],
      },
      {
        heading: "Washing yourself",
        text: ["Some verbs need *myself*, *yourself* and so on: *zich wassen* (to wash), *zich aankleden* (to get dressed)."],
        table: [
          ["ik was me", "I wash (myself)"],
          ["jij wast je", "you wash"],
          ["hij / zij wast zich", "he / she washes"],
          ["wij wassen ons", "we wash"],
        ],
      },
    ],
    drills: [
      { kind: "translate", en: "I get up at seven o'clock.", hint: "opstaan", answers: ["Ik sta om zeven uur op."] },
      { kind: "translate", en: "The train arrives at ten o'clock.", hint: "aankomen", answers: ["De trein komt om tien uur aan."] },
      { kind: "translate", en: "She gets up early.", hint: "opstaan", answers: ["Zij staat vroeg op.", "Ze staat vroeg op."] },
      { kind: "rewrite", task: "Add moeten (ik moet).", from: "Ik sta vroeg op.", answers: ["Ik moet vroeg opstaan."] },
      { kind: "translate", en: "I'll call you tomorrow.", hint: "opbellen", answers: ["Ik bel je morgen op.", "Ik bel jou morgen op."] },
      { kind: "gap", text: "Ik was ___.", hint: "myself", answers: ["me", "mij"], en: "I wash." },
      { kind: "gap", text: "Hij wast ___.", hint: "himself", answers: ["zich"], en: "He washes." },
      { kind: "gap", text: "Wij kleden ___ aan.", hint: "ourselves", answers: ["ons"], en: "We get dressed." },
    ],
  },
};

export function getGrammar(lessonId: string): GrammarLesson | undefined {
  return GRAMMAR[lessonId];
}

/** The full correct sentence for a drill, for showing after an answer and for AI feedback. */
export function drillSolution(drill: Drill): string {
  return drill.kind === "gap" ? drill.text.replace("___", drill.answers[0]!) : drill.answers[0]!;
}

/** The English meaning of a drill, for AI feedback. */
export function drillEnglish(drill: Drill): string {
  if (drill.kind === "translate") return drill.en;
  if (drill.kind === "gap") return drill.en;
  return `${drill.task} (${drill.from})`;
}
