export type QuizAnswer = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  category: string;
  text: string;
  answers: QuizAnswer[];
  correctAnswerId: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  finalRound?: boolean;
  imageUrl?: string;
  imageAlt?: string;
};

type SourceQuestion = {
  text: string;
  correct: string;
  wrong: [string, string, string];
  difficulty: 1 | 2 | 3 | 4 | 5;
  imageUrl?: string;
  imageAlt?: string;
};

type SourceCategory = {
  category: string;
  questions: SourceQuestion[];
};

function q(
  text: string,
  correct: string,
  wrong: [string, string, string],
  difficulty: 1 | 2 | 3 | 4 | 5,
  imageUrl?: string,
  imageAlt?: string,
): SourceQuestion {
  return { text, correct, wrong, difficulty, imageUrl, imageAlt };
}

const normal: SourceCategory[] = [
  {
    category: "CASCADĂ",
    questions: [
      q("Care cascadă este asociată cel mai des cu râul Niagara?", "Niagara Falls", ["Cascada Bigăr", "Cascada Saharna", "Cascada Duruitoarea"], 1, "/assets/questions/cascade.svg", "Ilustrație cu temă de cascadă"),
      q("În ce țară se află Cascada Bigăr?", "România", ["Republica Moldova", "Ucraina", "Serbia"], 1, "/assets/questions/cascade.svg", "Ilustrație cu temă de cascadă"),
      q("Ce formează de obicei o cascadă?", "O cădere de apă pe o ruptură de pantă", ["Un lac sărat", "Un crater vulcanic", "Un pod natural"], 2),
      q("Cascada Saharna este legată de care spațiu geografic?", "Republica Moldova", ["Franța", "Italia", "Grecia"], 2),
      q("Ce element este cel mai important pentru debitul unei cascade?", "Volumul de apă al cursului", ["Culoarea rocilor", "Altitudinea orașelor", "Vântul de coastă"], 2),
      q("Cascada Victoria se află pe fluviul:", "Zambezi", ["Dunărea", "Nil", "Prut"], 3),
      q("Cum se numește procesul prin care apa erodează roca de sub o cascadă?", "Eroziune", ["Condensare", "Fotosinteză", "Sedentarizare"], 3),
      q("Ce tip de relief favorizează apariția cascadelor?", "Relieful cu diferențe mari de nivel", ["Câmpiile perfect plane", "Delta joasă", "Stepa uscată"], 4),
    ],
  },
  {
    category: "PICTURI MURALE",
    questions: [
      q("Cum se numește tehnica de pictură pe tencuială umedă?", "Frescă", ["Acuarelă", "Mozaic", "Gravură"], 1, "/assets/questions/murale.svg", "Ilustrație cu temă de pictură murală"),
      q("Mănăstirile pictate din Bucovina sunt cunoscute pentru:", "Fresce exterioare", ["Turnuri de sticlă", "Cupole metalice", "Fațade gotice negre"], 2, "/assets/questions/murale.svg", "Ilustrație cu temă de frescă"),
      q("Care culoare este celebră la Voroneț?", "Albastru", ["Verde", "Violet", "Maro"], 1),
      q("O pictură murală se realizează de regulă pe:", "Perete", ["Pânză mică", "Hârtie fotografică", "Ecran digital"], 1),
      q("Ce temă apare frecvent în pictura murală medievală românească?", "Scene religioase", ["Reclame comerciale", "Hărți maritime", "Portrete pop-art"], 2),
      q("Restaurarea frescelor urmărește în primul rând:", "Conservarea stratului original", ["Schimbarea stilului", "Acoperirea completă", "Lăcuirea agresivă"], 3),
      q("Ce se poate deteriora rapid într-o pictură murală veche?", "Pigmentul și tencuiala", ["Rama televizorului", "Memoria calculatorului", "Cablurile electrice"], 3),
      q("Ce rol are documentarea fotografică înainte de restaurare?", "Păstrează starea inițială ca reper", ["Înlocuiește restauratorul", "Schimbă automat culorile", "Acoperă fisurile"], 4),
    ],
  },
  {
    category: "GHICEȘTE ȚARA",
    questions: [
      q("Țara cu capitala la Chișinău este:", "Republica Moldova", ["România", "Bulgaria", "Letonia"], 1, "/assets/questions/harta.svg", "Ilustrație cu hartă și repere"),
      q("Țara cu capitala la București este:", "România", ["Republica Moldova", "Ungaria", "Slovacia"], 1, "/assets/questions/harta.svg", "Ilustrație cu hartă și repere"),
      q("În ce țară se află orașul Iași?", "România", ["Serbia", "Croația", "Polonia"], 1),
      q("Care țară are orașul Lviv?", "Ucraina", ["Moldova", "Cehia", "Austria"], 2),
      q("Țara baltică având capitala Vilnius este:", "Lituania", ["Letonia", "Estonia", "Finlanda"], 2),
      q("Țara traversată de fluviul Sena este:", "Franța", ["Spania", "Elveția", "Belgia"], 1),
      q("Capitala Bulgariei este:", "Sofia", ["Varna", "Plovdiv", "Ruse"], 2),
      q("Orașul Cracovia se află în:", "Polonia", ["Slovenia", "Croația", "Cehia"], 3),
    ],
  },
  {
    category: "PERSONALITĂȚI",
    questions: [
      q("Cine a scris poemul Luceafărul?", "Mihai Eminescu", ["Ion Creangă", "Lucian Blaga", "George Coșbuc"], 1),
      q("Autorul Amintirilor din copilărie este:", "Ion Creangă", ["Mihai Sadoveanu", "Tudor Arghezi", "Nichita Stănescu"], 1),
      q("Grigore Vieru este cunoscut mai ales ca:", "Poet", ["Arhitect", "Astronom", "Medic"], 1),
      q("Dimitrie Cantemir a fost domnitor al:", "Moldovei", ["Țării Românești", "Transilvaniei", "Dobrogei"], 2),
      q("Maria Cebotari a fost o celebră:", "Soprană", ["Pictoriță", "Sportivă", "Regizoare"], 2),
      q("Eugen Doga este cunoscut pentru:", "Compoziții muzicale", ["Descoperiri chimice", "Picturi rupestre", "Romane polițiste"], 2),
      q("Constantin Brâncuși este asociat în primul rând cu:", "Sculptura modernă", ["Astronomia", "Medicina militară", "Cartografia"], 3),
      q("Alexei Mateevici este autorul poeziei:", "Limba noastră", ["Somnoroase păsărele", "Plumb", "Noi vrem pământ"], 3),
    ],
  },
  {
    category: "IMAGINI CONECTATE",
    questions: [
      q("Dacă vezi un strugure, un butoi și o cramă, tema probabilă este:", "Vinificația", ["Astronomia", "Baletul", "Mineritul"], 1, "/assets/questions/imagini-conectate.svg", "Ilustrație cu indicii vizuale conectate"),
      q("O mască, o scenă și aplauze trimit cel mai clar la:", "Teatru", ["Geografie", "Medicină", "Navigație"], 1, "/assets/questions/imagini-conectate.svg", "Ilustrație cu indicii vizuale conectate"),
      q("Un nai, o ie și o horă indică:", "Tradiții populare", ["Sporturi de iarnă", "Arhitectură modernă", "Cinema mut"], 2, "/assets/questions/traditii.svg", "Ilustrație cu temă de tradiții"),
      q("O peliculă, un proiector și o sală întunecată indică:", "Cinema", ["Botanică", "Matematică", "Aviație"], 1, "/assets/questions/cinema.svg", "Ilustrație cu temă de cinema"),
      q("Un compas, o hartă și o busolă indică:", "Geografie", ["Literatură", "Pictură", "Muzică"], 1, "/assets/questions/harta.svg", "Ilustrație cu hartă și repere"),
      q("O pană, o carte și o călimară trimit la:", "Literatură", ["Agricultură", "Balneologie", "Fotbal"], 1),
      q("Un costum popular, o scenă și un fluier trimit la:", "Folclor", ["Chimie", "Tenis", "Navigație"], 2, "/assets/questions/traditii.svg", "Ilustrație cu temă de tradiții"),
      q("Un afiș, un cadru și un montaj indică:", "Film", ["Mineralogie", "Silvicultură", "Meteorologie"], 3, "/assets/questions/cinema.svg", "Ilustrație cu temă de cinema"),
    ],
  },
  {
    category: "LITERATURĂ",
    questions: [
      q("Baltagul a fost scris de:", "Mihail Sadoveanu", ["Ion Luca Caragiale", "Marin Preda", "Camil Petrescu"], 2),
      q("O scrisoare pierdută este o piesă de:", "Ion Luca Caragiale", ["Mihai Eminescu", "Liviu Rebreanu", "Vasile Alecsandri"], 1),
      q("Miorița este o:", "Baladă populară", ["Nuvelă realistă", "Comedie", "Roman istoric"], 1),
      q("Moromeții este romanul lui:", "Marin Preda", ["George Bacovia", "Ion Creangă", "Alecu Russo"], 2),
      q("Plumb este un poem asociat cu:", "George Bacovia", ["Tudor Arghezi", "Nichita Stănescu", "Grigore Vieru"], 2),
      q("Enigma Otiliei aparține lui:", "George Călinescu", ["Liviu Rebreanu", "Mihail Sadoveanu", "Mircea Eliade"], 3),
      q("Ion este romanul scris de:", "Liviu Rebreanu", ["Marin Preda", "Ion Creangă", "Vasile Alecsandri"], 2),
      q("Ce autor este asociat cu teatrul absurdului și piesa Rinocerii?", "Eugène Ionesco", ["Tudor Mușatescu", "Mihail Sebastian", "Barbu Ștefănescu Delavrancea"], 4),
    ],
  },
  {
    category: "ISTORIE",
    questions: [
      q("În ce an s-a unit Basarabia cu România?", "1918", ["1859", "1940", "1991"], 3),
      q("Mica Unire este asociată cu anul:", "1859", ["1918", "1877", "1944"], 2),
      q("Ștefan cel Mare a fost domnitor al:", "Moldovei", ["Transilvaniei", "Dobrogei", "Banatului"], 1),
      q("Independența României este legată de războiul din:", "1877-1878", ["1916-1918", "1941-1945", "1821"], 3),
      q("Sfatul Țării a votat unirea Basarabiei cu România la:", "Chișinău", ["Iași", "București", "Cernăuți"], 3),
      q("Ce domnitor este asociat cu prima unire politică a Țărilor Române?", "Mihai Viteazul", ["Alexandru Ioan Cuza", "Carol I", "Mircea cel Bătrân"], 3),
      q("Care document medieval este atribuit cancelariei Moldovei?", "Letopiseț", ["Manifest futurist", "Cod maritim modern", "Partitură simfonică"], 4),
      q("Cine a fost primul rege al României?", "Carol I", ["Ferdinand I", "Mihai I", "Carol al II-lea"], 2),
    ],
  },
  {
    category: "CINEMA",
    questions: [
      q("Regizorul Emil Loteanu este asociat cu filmul:", "Lăutarii", ["Reconstituirea", "Moara cu noroc", "Nunta de piatră"], 3, "/assets/questions/cinema.svg", "Ilustrație cu temă de cinema"),
      q("Cinematografia folosește cadre montate pentru a crea:", "Narațiune vizuală", ["Hartă geologică", "Rețetă medicală", "Calendar agricol"], 1, "/assets/questions/cinema.svg", "Ilustrație cu temă de cinema"),
      q("Un documentar urmărește în general:", "Realitatea și informația", ["Doar personaje inventate", "Exclusiv animație abstractă", "Numai reclame"], 1),
      q("Festivalul de film de la Cannes are loc în:", "Franța", ["Italia", "Germania", "Grecia"], 2),
      q("Un storyboard este:", "O schiță vizuală a scenelor", ["Un aparat de proiecție", "Un premiu muzical", "Un tip de obiectiv foto"], 2),
      q("Ce element controlează lumina care intră în cameră?", "Diafragma", ["Microfonul", "Clacheta", "Scenariul"], 3),
      q("Montajul paralel arată de obicei:", "Acțiuni care se desfășoară în paralel", ["O singură fotografie statică", "O listă de actori", "Un decor pictat"], 4),
      q("Cine este autorul filmului O șatră urcă la cer?", "Emil Loteanu", ["Sergiu Nicolaescu", "Lucian Pintilie", "Cristian Mungiu"], 3),
    ],
  },
  {
    category: "MUZICĂ",
    questions: [
      q("Eugen Doga a compus celebrul vals din filmul:", "Gingașa și tandra mea fiară", ["Titanic", "Lăutarii", "Moromeții"], 3),
      q("Naiul este un instrument:", "De suflat", ["De percuție", "Cu clape electrice", "De scris"], 1),
      q("Doina este asociată cu:", "Cântecul liric tradițional", ["Dansul electronic", "Marșul militar modern", "Opera rock"], 2),
      q("George Enescu este cunoscut ca:", "Compozitor și violonist", ["Astronom", "Pictor mural", "Arhitect naval"], 2),
      q("Hora este în mod tradițional:", "Un dans în cerc", ["Un instrument", "O specie de pasăre", "O formă de relief"], 1),
      q("Ce indică tempo-ul într-o piesă muzicală?", "Viteza de interpretare", ["Culoarea costumului", "Mărimea scenei", "Limba textului"], 2),
      q("O orchestră simfonică include de obicei:", "Instrumente cu coarde, suflat și percuție", ["Doar telefoane mobile", "Numai voci solo", "Exclusiv clopote"], 3),
      q("Ciprian Porumbescu este asociat cu:", "Balada pentru vioară și orchestră", ["Luceafărul", "Coloana infinitului", "Moromeții"], 3),
    ],
  },
  {
    category: "TRADIȚII",
    questions: [
      q("Mărțișorul se poartă tradițional la început de:", "Martie", ["Ianuarie", "Iulie", "Noiembrie"], 1, "/assets/questions/traditii.svg", "Ilustrație cu temă de tradiții"),
      q("Ia este o piesă de:", "Port popular", ["Mobilier", "Ceramică industrială", "Instrument muzical"], 1, "/assets/questions/traditii.svg", "Ilustrație cu temă de tradiții"),
      q("Colindele sunt asociate mai ales cu:", "Sărbătorile de iarnă", ["Secerișul de vară", "Examenele școlare", "Navigația"], 1),
      q("Hora este dansată frecvent:", "În cerc", ["Pe o linie verticală", "În tăcere completă", "Pe apă"], 1),
      q("Ce obiect este legat de tradiția mărțișorului?", "Șnurul alb-roșu", ["Busola marină", "Clopotul de sticlă", "Vasul de bronz"], 2),
      q("În tradiția populară, ouăle încondeiate sunt asociate cu:", "Paștele", ["Anul Nou Chinezesc", "Ziua Marinei", "Solstițiul de vară"], 2),
      q("Călușarii sunt asociați cu:", "Dans ritualic", ["Astronomie", "Pictură murală", "Cartografie"], 3),
      q("Ce păstrează un muzeu etnografic?", "Obiecte și obiceiuri ale culturii tradiționale", ["Doar avioane militare", "Numai minerale radioactive", "Exclusiv roboți industriali"], 3),
    ],
  },
  {
    category: "GEOGRAFIE",
    questions: [
      q("Râul Prut formează o parte a graniței dintre:", "România și Republica Moldova", ["România și Bulgaria", "Moldova și Grecia", "Ucraina și Franța"], 2, "/assets/questions/harta.svg", "Ilustrație cu hartă și repere"),
      q("Capitala Republicii Moldova este:", "Chișinău", ["Bălți", "Orhei", "Cahul"], 1),
      q("Dunărea se varsă în:", "Marea Neagră", ["Marea Baltică", "Oceanul Atlantic", "Marea Caspică"], 1),
      q("Munții Carpați traversează:", "România", ["Portugalia", "Olanda", "Danemarca"], 1),
      q("Delta Dunării este cunoscută pentru:", "Biodiversitate", ["Deșert", "Gheizere", "Vulcani activi"], 2),
      q("Orașul Soroca se află pe malul râului:", "Nistru", ["Prut", "Olt", "Siret"], 2),
      q("Ce este o deltă?", "O formă de relief la vărsarea unui fluviu", ["Un vârf montan", "Un tip de peșteră", "Un lac glaciar"], 3),
      q("Care este cel mai înalt vârf din România?", "Moldoveanu", ["Omu", "Toaca", "Ceahlău"], 3),
    ],
  },
  {
    category: "LIMBA ROMÂNĂ",
    questions: [
      q("Câte litere are alfabetul limbii române?", "31", ["26", "28", "33"], 2),
      q("Care cuvânt conține literă specifică limbii române?", "Țară", ["Casa", "Radio", "Port"], 1),
      q("Sinonimul pentru cuvântul repede este:", "Iute", ["Lent", "Greu", "Târziu"], 1),
      q("Antonimul cuvântului lumină este:", "Întuneric", ["Strălucire", "Claritate", "Rază"], 1),
      q("În propoziția «Copilul citește», predicatul este:", "citește", ["copilul", "propoziția", "este"], 2),
      q("Pluralul cuvântului carte este:", "cărți", ["carturi", "cărte", "carteuri"], 1),
      q("Ce parte de vorbire este cuvântul frumos în «un cântec frumos»?", "Adjectiv", ["Verb", "Pronume", "Prepoziție"], 2),
      q("Ce semn se folosește la finalul unei întrebări?", "Semnul întrebării", ["Virgula", "Punct și virgulă", "Două puncte"], 1),
    ],
  },
  {
    category: "ȘTIINȚĂ",
    questions: [
      q("Apa are formula chimică:", "H₂O", ["CO₂", "NaCl", "O₂"], 1),
      q("Planeta cea mai apropiată de Soare este:", "Mercur", ["Venus", "Marte", "Jupiter"], 2),
      q("Fotosinteza este realizată în principal de:", "Plante", ["Roci", "Metale", "Nori"], 1),
      q("Unitatea de măsură pentru forță este:", "Newton", ["Volt", "Metru", "Gram"], 3),
      q("Sunetul se propagă prin:", "Vibrații", ["Vid perfect fără mediu", "Culoare", "Magnetism static"], 2),
      q("Ce organ pompează sângele în corp?", "Inima", ["Plămânul", "Stomacul", "Ficatul"], 1),
      q("Care gaz este esențial pentru respirația umană?", "Oxigen", ["Heliu", "Neon", "Argon"], 1),
      q("Ce studiază astronomia?", "Corpurile cerești", ["Textele vechi", "Dansurile populare", "Instrumentele de bucătărie"], 2),
    ],
  },
];

const finalQuestions: SourceQuestion[] = [
  q("În ce an s-a unit Basarabia cu România?", "1918", ["1859", "1940", "1991"], 3),
  q("Cine a compus valsul Gramofon?", "Eugen Doga", ["George Enescu", "Ciprian Porumbescu", "Gavriil Musicescu"], 3),
  q("Care râu formează o parte importantă a graniței dintre România și Republica Moldova?", "Prut", ["Olt", "Mureș", "Tisa"], 3),
  q("Ce oraș este numit frecvent capitala culturală a Moldovei istorice?", "Iași", ["Constanța", "Cluj-Napoca", "Brașov"], 3),
  q("Cine este autorul romanului Ion?", "Liviu Rebreanu", ["Marin Preda", "Mihail Sadoveanu", "Camil Petrescu"], 3),
  q("Ce mănăstire este asociată cu albastrul celebru din pictura exterioară?", "Voroneț", ["Căpriana", "Putna", "Horezu"], 3, "/assets/questions/murale.svg", "Ilustrație cu temă de pictură murală"),
  q("Care personalitate a scris Descriptio Moldaviae?", "Dimitrie Cantemir", ["Bogdan Petriceicu Hasdeu", "Nicolae Iorga", "Miron Costin"], 4),
  q("Ce film moldovenesc este legat de regizorul Emil Loteanu?", "Lăutarii", ["Reconstituirea", "Moara cu noroc", "Pădurea spânzuraților"], 4, "/assets/questions/cinema.svg", "Ilustrație cu temă de cinema"),
  q("Care a fost capitala Moldovei medievale pentru o perioadă importantă?", "Suceava", ["Chișinău", "Galați", "Orhei"], 4),
  q("Cine a scris Limba noastră?", "Alexei Mateevici", ["Grigore Vieru", "Mihai Eminescu", "Vasile Alecsandri"], 4),
  q("Care este numele ansamblului arheologic celebru de lângă Trebujeni?", "Orheiul Vechi", ["Sarmizegetusa", "Histria", "Capidava"], 4),
  q("Cine a pictat Carul cu boi?", "Nicolae Grigorescu", ["Ștefan Luchian", "Theodor Aman", "Ion Andreescu"], 4),
  q("Care cronicar a scris Letopisețul Țării Moldovei de la Aron Vodă încoace?", "Miron Costin", ["Ion Neculce", "Grigore Ureche", "Dimitrie Cantemir"], 5),
  q("Ce limbă romanică este foarte apropiată de română prin originea latină comună?", "Italiana", ["Germana", "Maghiara", "Poloneza"], 5),
  q("În ce localitate s-a născut Constantin Brâncuși?", "Hobița", ["Ipotești", "Humulești", "Liveni"], 5),
  q("Ce operă literară începe cu atmosfera satului Siliștea-Gumești?", "Moromeții", ["Ion", "Baltagul", "Enigma Otiliei"], 5),
  q("Ce stil arhitectural este asociat cu biserica Trei Ierarhi din Iași?", "Baroc moldovenesc cu influențe orientale", ["Brutalism", "Art deco american", "Goticul baltic"], 5),
  q("Ce personalitate este legată de Hora Unirii?", "Vasile Alecsandri", ["George Bacovia", "Tudor Arghezi", "Nichita Stănescu"], 4),
  q("Ce oraș este asociat cu cetatea medievală de pe Nistru?", "Soroca", ["Cahul", "Comrat", "Ungheni"], 4, "/assets/questions/harta.svg", "Ilustrație cu hartă și repere"),
  q("Care este numele sculpturii lui Brâncuși din ansamblul de la Târgu Jiu?", "Coloana fără sfârșit", ["Gânditorul", "David", "Sărutul lui Rodin"], 5),
];

function toQuizQuestion(
  source: SourceQuestion,
  category: string,
  index: number,
  finalRound = false,
): QuizQuestion {
  return {
    id: `${finalRound ? "FINAL" : category}-${index + 1}`,
    category,
    text: source.text,
    difficulty: source.difficulty,
    finalRound,
    imageUrl: source.imageUrl,
    imageAlt: source.imageAlt,
    answers: [
      { id: "a", text: source.correct },
      { id: "b", text: source.wrong[0] },
      { id: "c", text: source.wrong[1] },
      { id: "d", text: source.wrong[2] },
    ],
    correctAnswerId: "a",
  };
}

export const questionBank: QuizQuestion[] = [
  ...normal.flatMap((group) =>
    group.questions.map((question, index) =>
      toQuizQuestion(question, group.category, index),
    ),
  ),
  ...finalQuestions.map((question, index) =>
    toQuizQuestion(question, "RUNDA FINALĂ", index, true),
  ),
];

export const playableCategories = normal.map((group) => group.category);

export function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function getRandomPlayableCategories(limit = 6) {
  return shuffle(playableCategories).slice(0, limit);
}

export function getNormalQuestions(category: string, round: number, usedIds: string[]) {
  const ranges: Record<number, number[]> = {
    1: [1, 2],
    2: [2, 3],
    3: [3, 4],
  };
  const range = ranges[round] ?? [1, 4];
  let pool = questionBank.filter(
    (question) =>
      !question.finalRound &&
      question.category === category &&
      !usedIds.includes(question.id),
  );

  if (pool.length < 5) {
    pool = questionBank.filter(
      (question) => !question.finalRound && question.category === category,
    );
  }

  const preferred = pool.filter((question) => range.includes(question.difficulty));
  return shuffle(preferred.length >= 5 ? preferred : pool).slice(0, 5);
}

export function getFinalQuestions(usedIds: string[]) {
  const available = questionBank.filter(
    (question) => question.finalRound && !usedIds.includes(question.id),
  );
  const fallback = questionBank.filter((question) => question.finalRound);

  return shuffle(available.length >= 16 ? available : fallback)
    .sort((a, b) => a.difficulty - b.difficulty)
    .slice(0, 16)
    .map((question) => ({
      ...question,
      answers: shuffle(question.answers),
    }));
}

