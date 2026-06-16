import type { QuizQuestion } from "./question-bank";

type BoostQuestion = {
  text: string;
  correct: string;
  wrong: [string, string, string];
  difficulty: 1 | 2 | 3 | 4 | 5;
  imageUrl?: string;
  imageAlt?: string;
};

type BoostCategory = {
  category: string;
  questions: BoostQuestion[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function q(
  text: string,
  correct: string,
  wrong: [string, string, string],
  difficulty: 1 | 2 | 3 | 4 | 5,
  imageUrl?: string,
  imageAlt?: string,
): BoostQuestion {
  return { text, correct, wrong, difficulty, imageUrl, imageAlt };
}

const normalBoost: BoostCategory[] = [
  {
    category: "CASCADĂ",
    questions: [
      q("Cascada Duruitoarea se află în zona:", "Rezervației Rudi-Arionești", ["Codrilor", "Deltei Dunării", "Munților Făgăraș"], 2, "/assets/questions/cascade.svg", "Ilustrație cu cascadă"),
      q("Ce indică o cascadă într-un peisaj montan?", "O diferență bruscă de nivel", ["Un teren perfect plat", "O acumulare de nisip", "O zonă fără apă"], 1),
      q("Cascada Angel este renumită pentru:", "Înălțimea foarte mare", ["Apa sărată", "Formarea artificială", "Culoarea roșie permanentă"], 3),
      q("Ce poate forma apa la baza unei cascade?", "Un bazin de eroziune", ["Un con vulcanic", "O dună", "Un ghețar continental"], 3),
      q("Cascada Cailor este situată în:", "Maramureș", ["Dobrogea", "Bugeac", "Câmpia Bărăganului"], 2),
      q("Care factor poate mări temporar debitul unei cascade?", "Topirea zăpezilor", ["Lipsa precipitațiilor", "Seceta lungă", "Înghețul complet"], 2),
      q("Ce studiază hidrologia?", "Apele și circulația lor", ["Stelele", "Sunetele", "Textele literare"], 3),
      q("Cascada Niagara se află la granița dintre:", "SUA și Canada", ["România și Moldova", "Franța și Spania", "Grecia și Turcia"], 2),
      q("Ce tip de rocă rezistentă poate menține un prag de cascadă?", "Rocă dură", ["Nisip fin", "Argilă moale", "Sol vegetal"], 4),
      q("Ce se întâmplă adesea cu pragul unei cascade în timp geologic?", "Se retrage prin eroziune", ["Devine metalic", "Se transformă în nor", "Dispare instantaneu"], 4),
      q("Ce semnal turistic trebuie respectat lângă cascade?", "Atenție la alunecare", ["Interzisă apa", "Zbor obligatoriu", "Tăcere astronomică"], 1),
      q("O cascadă artificială este creată prin:", "Amenajare umană", ["Activitate solară", "Migrație de păsări", "Traducere literară"], 1),
    ],
  },
  {
    category: "PICTURI MURALE",
    questions: [
      q("Ce protejează o pictură murală de umezeală?", "Conservarea controlată", ["Expunerea la ploaie", "Frecarea zilnică", "Lumina directă continuă"], 3, "/assets/questions/murale.svg", "Ilustrație murală"),
      q("Pictura murală urbană modernă se numește adesea:", "Street art", ["Sonet", "Baladă", "Frescă marină"], 1),
      q("Mozaicul mural este format din:", "Piese mici colorate", ["Fire electrice", "Pagini de roman", "Instrumente muzicale"], 2),
      q("Ce înseamnă restaurare?", "Readucerea și conservarea unei lucrări", ["Distrugerea operei", "Schimbarea autorului", "Ascunderea totală"], 2),
      q("În pictura murală, suportul principal este:", "Suprafața arhitecturală", ["O farfurie", "O vioară", "Un telefon"], 1),
      q("Ce poate indica o inscripție lângă o frescă?", "Contextul sau autorul", ["Temperatura apei", "Viteza vântului", "Codul genetic"], 3),
      q("Pigmenții minerali sunt folosiți pentru:", "Culoare", ["Sunet", "Miros", "Greutate electronică"], 2),
      q("Ce este o sinopie în arta murală?", "Desen pregătitor", ["Instrument de suflat", "Dans popular", "Tip de hartă"], 4),
      q("Fresca se fixează chimic pe măsură ce:", "Tencuiala se usucă", ["Pânza se rupe", "Lumina se oprește", "Apa fierbe"], 4),
      q("Un mural comunitar are adesea rol:", "Identitar și social", ["Exclusiv mecanic", "Meteorologic", "Medical"], 3),
      q("Ce trebuie evitat la curățarea unei fresce?", "Intervenția agresivă", ["Documentarea", "Testarea atentă", "Controlul umidității"], 4),
      q("Picturile exterioare de la Voroneț sunt patrimoniu:", "Cultural", ["Industrial petrolier", "Sportiv", "Astronomic"], 1),
    ],
  },
  {
    category: "GHICEȘTE ȚARA",
    questions: [
      q("Țara cu capitala la Roma este:", "Italia", ["Spania", "Grecia", "Croația"], 1, "/assets/questions/harta.svg", "Ilustrație hartă"),
      q("Țara cu capitala la Madrid este:", "Spania", ["Portugalia", "Italia", "Franța"], 1),
      q("În ce țară se află orașul Praga?", "Cehia", ["Slovacia", "Austria", "Ungaria"], 2),
      q("Capitala Austriei este:", "Viena", ["Salzburg", "Graz", "Innsbruck"], 1),
      q("Țara cu capitala Oslo este:", "Norvegia", ["Suedia", "Danemarca", "Islanda"], 2),
      q("În ce țară se află orașul Tbilisi?", "Georgia", ["Armenia", "Azerbaidjan", "Turcia"], 3),
      q("Capitala Croației este:", "Zagreb", ["Split", "Dubrovnik", "Rijeka"], 2),
      q("Țara cu capitala la Tallinn este:", "Estonia", ["Letonia", "Lituania", "Finlanda"], 2),
      q("În ce țară se află orașul Porto?", "Portugalia", ["Spania", "Italia", "Malta"], 3),
      q("Capitala Islandei este:", "Reykjavik", ["Oslo", "Helsinki", "Dublin"], 4),
      q("Țara cu capitala la Ljubljana este:", "Slovenia", ["Slovacia", "Serbia", "Croația"], 3),
      q("În ce țară se află orașul Rotterdam?", "Țările de Jos", ["Belgia", "Germania", "Danemarca"], 3),
    ],
  },
  {
    category: "PERSONALITĂȚI",
    questions: [
      q("Mihai Eminescu este numit adesea:", "Poet național", ["Inventator de avioane", "Medic chirurg", "Compozitor baroc"], 1),
      q("Ion Druță este cunoscut ca:", "Scriitor", ["Fotbalist", "Astronom", "Navigator"], 2),
      q("Nicolae Grigorescu a fost:", "Pictor", ["Matematician", "Pilot", "Explorator polar"], 2),
      q("Sergiu Celibidache este asociat cu:", "Dirijatul", ["Arheologia", "Boxul", "Silvicultura"], 3),
      q("Bogdan Petriceicu Hasdeu a fost:", "Cărturar și filolog", ["Tenismen", "Regizor de animație", "Botanist marin"], 3),
      q("Vasile Alecsandri este asociat cu:", "Hora Unirii", ["Luceafărul", "Baltagul", "Rinocerii"], 2),
      q("Maria Tănase este cunoscută pentru:", "Muzică populară", ["Fizică nucleară", "Pictură murală", "Navigație"], 1),
      q("Lucian Blaga a fost poet și:", "Filosof", ["Arbitru", "Constructor naval", "Cosmonaut"], 3),
      q("Ion Inculeț este asociat cu:", "Sfatul Țării", ["Școala Ardeleană", "Junimea", "Dacia literară"], 4),
      q("Sofia Ionescu-Ogrezeanu a fost una dintre primele femei:", "Neurochirurg", ["Dirijor", "Cartograf", "Pictor mural"], 4),
      q("Ciprian Porumbescu este cunoscut ca:", "Compozitor", ["Sculptor", "Romancier francez", "Inventator"], 2),
      q("Mircea Eliade este asociat cu istoria:", "Religiilor", ["Medicamentelor", "Navigației", "Tipografiei"], 3),
    ],
  },
  {
    category: "IMAGINI CONECTATE",
    questions: [
      q("Un covor, o ie și un război de țesut indică:", "Meșteșuguri tradiționale", ["Astronautică", "Informatică", "Minerit"], 2, "/assets/questions/traditii.svg", "Indiciu vizual tradiții"),
      q("O carte, o lampă și o bibliotecă indică:", "Lectură", ["Pescuit", "Alpinism", "Fotbal"], 1),
      q("Un microfon, o scenă și note muzicale indică:", "Concert", ["Laborator", "Șantier", "Spital"], 1),
      q("Un castel, o stemă și o sabie indică:", "Ev mediu", ["Era digitală", "Oceanografie", "Cinema mut"], 3),
      q("O peliculă, o clachetă și lumini indică:", "Filmări", ["Agricultură", "Dresaj", "Geometrie"], 2, "/assets/questions/cinema.svg", "Indiciu vizual cinema"),
      q("O hartă, un pin și o rută indică:", "Orientare", ["Pictură", "Canto", "Chimie"], 1, "/assets/questions/harta.svg", "Indiciu vizual hartă"),
      q("O lupă, o amprentă și un dosar indică:", "Investigație", ["Dans popular", "Grădinărit", "Meteorologie"], 3),
      q("Un telescop, stele și o planetă indică:", "Astronomie", ["Lingvistică", "Teatru", "Restaurare"], 2),
      q("Un penel, pigmenți și un perete indică:", "Pictură murală", ["Muzică corală", "Gastronomie", "Sport"], 2, "/assets/questions/murale.svg", "Indiciu vizual mural"),
      q("O busolă, munți și un traseu indică:", "Drumeție", ["Operă", "Tipografie", "Matematică pură"], 3),
      q("Un ceas vechi, arhive și documente indică:", "Istorie", ["Fotbal", "Botanică", "Meteorologie"], 3),
      q("O inimă, un scor și un podium indică:", "Clasament", ["Pictură rupestră", "Mecanică", "Agricultură"], 1),
    ],
  },
  {
    category: "LITERATURĂ",
    questions: [
      q("Autorul poeziei Plumb este:", "George Bacovia", ["Mihai Eminescu", "Ion Creangă", "Vasile Alecsandri"], 2),
      q("Povestea lui Harap-Alb a fost scrisă de:", "Ion Creangă", ["Liviu Rebreanu", "Marin Preda", "Nichita Stănescu"], 1),
      q("Dacia literară este asociată cu:", "Mihail Kogălniceanu", ["Eugen Doga", "Emil Loteanu", "Nicolae Milescu"], 3),
      q("Un roman are de obicei:", "Acțiune amplă și personaje", ["Doar o strofă", "Numai formule", "Exclusiv hărți"], 1),
      q("Genul liric exprimă mai ales:", "Trăiri și sentimente", ["Instrucțiuni tehnice", "Legi juridice", "Rețete medicale"], 2),
      q("Meșterul Manole este o:", "Legendă", ["Comedie modernă", "Nuvelă polițistă", "Reclamă"], 2),
      q("Nichita Stănescu este poet al literaturii:", "Române contemporane", ["Antice grecești", "Medievale japoneze", "Ruse clasice"], 3),
      q("Ce este un narator?", "Vocea care relatează acțiunea", ["Decorul scenei", "Tipul de rimă", "Coperta cărții"], 2),
      q("Rima apare în special în:", "Poezie", ["Atlas", "Dicționar tehnic", "Contract"], 1),
      q("Curentul Junimea este legat de orașul:", "Iași", ["Paris", "Roma", "Londra"], 3),
      q("Cine a scris La țigănci?", "Mircea Eliade", ["Ion Barbu", "Gellu Naum", "Marin Sorescu"], 4),
      q("O nuvelă este de obicei mai concentrată decât:", "Romanul", ["Proverbul", "Titlul", "Cuvântul"], 2),
    ],
  },
  {
    category: "ISTORIE",
    questions: [
      q("Anul 1991 este important pentru Republica Moldova deoarece marchează:", "Independența", ["Marea Unire", "Unirea Principatelor", "Încoronarea lui Carol I"], 2),
      q("Unirea Principatelor Române este asociată cu:", "Alexandru Ioan Cuza", ["Ștefan cel Mare", "Carol al II-lea", "Mihai I"], 2),
      q("Cetatea Soroca se află pe malul:", "Nistrului", ["Prutului", "Dunării", "Oltului"], 2),
      q("Mircea cel Bătrân a fost domnitor al:", "Țării Românești", ["Moldovei", "Transilvaniei", "Basarabiei"], 3),
      q("Primul Război Mondial s-a încheiat în:", "1918", ["1939", "1945", "1859"], 2),
      q("Marea Unire este sărbătorită la:", "1 Decembrie", ["24 Ianuarie", "27 Martie", "31 August"], 1),
      q("Cine a fost domnitorul Moldovei în bătălia de la Vaslui?", "Ștefan cel Mare", ["Petru Rareș", "Dimitrie Cantemir", "Alexandru Lăpușneanu"], 3),
      q("Sarmizegetusa Regia este asociată cu:", "Dacii", ["Vikingii", "Fenicienii", "Celții britanici"], 3),
      q("Ce era Sfatul Țării?", "Organ legislativ al Basarabiei", ["Orchestră", "Mănăstire", "Tip de hartă"], 4),
      q("Domnia lui Constantin Brâncoveanu aparține în principal:", "Țării Românești", ["Moldovei", "Poloniei", "Bulgariei"], 4),
      q("Tratatul de la Paris din 1856 a afectat statutul:", "Principatelor Dunărene", ["Norvegiei", "Portugaliei", "Islandei"], 4),
      q("Cine a fost regele României în timpul Marii Uniri?", "Ferdinand I", ["Carol I", "Mihai I", "Carol al II-lea"], 3),
    ],
  },
  {
    category: "CINEMA",
    questions: [
      q("Un cadru cinematografic este:", "O unitate vizuală filmată", ["O notă muzicală", "Un tip de hartă", "Un dans"], 1, "/assets/questions/cinema.svg", "Ilustrație cinema"),
      q("Regizorul coordonează în principal:", "Viziunea artistică a filmului", ["Vânzarea popcornului", "Tipărirea biletelor", "Traficul rutier"], 2),
      q("Scenariul conține:", "Dialoguri și acțiuni", ["Doar costume", "Numai muzică", "Lista spectatorilor"], 1),
      q("Documentarul observațional urmărește:", "Realitatea cu intervenție minimă", ["Doar animații fantastice", "Exclusiv reclame", "Poezii recitate"], 3),
      q("Sunetul diegetic este sunetul:", "Care aparține lumii filmului", ["Auzi doar în sală", "Fără legătură cu scena", "Scris pe afiș"], 4),
      q("Un prim-plan arată de obicei:", "Fața sau detaliul unui personaj", ["O hartă globală", "Doar genericul", "Exteriorul cinematografului"], 2),
      q("Montajul este procesul de:", "Asamblare a cadrelor", ["Vopsire a sălii", "Scriere a subtitrării pe hârtie", "Construire de scaune"], 2),
      q("Clacheta ajută la sincronizarea:", "Sunetului cu imaginea", ["Hărților", "Biletelor", "Reflectoarelor cu scaunele"], 3),
      q("Un film de animație este creat prin:", "Succesiune de imagini desenate sau generate", ["Doar fotografie fixă", "Numai radio", "Tipar manual"], 2),
      q("Festivalul TIFF are loc în România la:", "Cluj-Napoca", ["Iași", "Constanța", "Cahul"], 3),
      q("Cine a regizat 4 luni, 3 săptămâni și 2 zile?", "Cristian Mungiu", ["Emil Loteanu", "Sergiu Nicolaescu", "Nae Caranfil"], 4),
      q("Ce este un travelling?", "Mișcare a camerei", ["Gen muzical", "Instrument de suflat", "Premiu literar"], 3),
    ],
  },
  {
    category: "MUZICĂ",
    questions: [
      q("Vioara este instrument cu:", "Coarde", ["Clape doar electronice", "Membrană", "Aer comprimat"], 1),
      q("Dirijorul conduce:", "Orchestra sau corul", ["Harta", "Camera de filmat", "Muzeul"], 1),
      q("Ce este un refren?", "Parte repetată a unei piese", ["Instrument", "Autor", "Sală"], 2),
      q("Muzica corală este interpretată de:", "Cor", ["Un singur toboșar", "O echipă de fotbal", "Un pictor"], 2),
      q("O partitură notează:", "Muzica în scris", ["Traseul turistic", "Meniul", "Rezultatul sportiv"], 2),
      q("Ce indică dinamica în muzică?", "Intensitatea sunetului", ["Culoarea scenei", "Înălțimea clădirii", "Textura hârtiei"], 3),
      q("Un cvartet are de obicei:", "Patru interpreți", ["Doi interpreți", "Șapte interpreți", "O sută"], 2),
      q("Opera combină muzica cu:", "Teatrul și vocea", ["Astronomia", "Geografia pură", "Programarea"], 3),
      q("Gavriil Musicescu este asociat cu:", "Muzica corală", ["Sculptura", "Cinema mut", "Geologia"], 3),
      q("Ce este timbrul muzical?", "Culoarea specifică a sunetului", ["Durata pauzei de masă", "Mărimea scenei", "Înălțimea scaunului"], 4),
      q("Un lied este:", "Cântec pentru voce și acompaniament", ["Hartă", "Frescă", "Baladă epică fără muzică"], 4),
      q("Flautul este instrument de:", "Suflat", ["Percuție", "Scris", "Măsurat"], 1),
    ],
  },
  {
    category: "TRADIȚII",
    questions: [
      q("Plugul sau Plugușorul este asociat cu:", "Anul Nou", ["Paștele", "Ziua Marinei", "Miezul verii"], 2, "/assets/questions/traditii.svg", "Ilustrație tradiții"),
      q("Sorcova este legată de urări de:", "An Nou", ["Nuntă romană", "Examen", "Cules de struguri"], 1),
      q("Ce simbolizează adesea pâinea și sarea?", "Ospitalitate", ["Război", "Navigație", "Astronomie"], 2),
      q("Șezătoarea era un prilej de:", "Lucru și socializare", ["Pilotaj", "Tipar industrial", "Chimie"], 3),
      q("Ceramica de Horezu este cunoscută pentru:", "Meșteșug tradițional", ["Robotică", "Metalurgie grea", "Astronomie"], 2),
      q("Portul popular se deosebește adesea prin:", "Motive și cusături", ["Microcipuri", "Ecrane", "Motoare"], 1),
      q("La nuntă, hora poate avea rol:", "Comunitar și festiv", ["Astronomic", "Medical", "Juridic obligatoriu"], 2),
      q("Ce este un obicei calendaristic?", "Tradiție legată de perioade ale anului", ["O formulă chimică", "Un tip de cameră", "Un instrument de navigație"], 3),
      q("Cămașa cu altiță este parte din:", "Portul tradițional", ["Costumul spațial", "Uniforma navală", "Echipamentul de laborator"], 3),
      q("Ce rol au motivele populare?", "Transmit simboluri și identitate", ["Măsoară temperatura", "Generează electricitate", "Corectează hărți"], 4),
      q("Buciumul este un instrument tradițional de:", "Suflat", ["Scris", "Țesut", "Pictat"], 2),
      q("Dansul călușarilor este recunoscut ca patrimoniu:", "Imaterial", ["Mineral", "Digital strict", "Subacvatic"], 4),
    ],
  },
  {
    category: "GEOGRAFIE",
    questions: [
      q("Capitala Ucrainei este:", "Kiev", ["Lviv", "Odesa", "Harkov"], 1, "/assets/questions/harta.svg", "Ilustrație hartă"),
      q("Nistrul se varsă în:", "Marea Neagră", ["Marea Baltică", "Oceanul Indian", "Marea Roșie"], 2),
      q("Ce este o peninsulă?", "Uscat înconjurat de apă pe trei părți", ["Vârf montan", "Nor", "Tip de peșteră"], 2),
      q("Capitala României este:", "București", ["Iași", "Cluj-Napoca", "Timișoara"], 1),
      q("Ce este latitudinea?", "Distanța unghiulară față de Ecuator", ["Adâncimea unui lac", "Viteza vântului", "Tipul de sol"], 3),
      q("Marea Neagră se află la est de:", "România", ["Portugalia", "Irlanda", "Norvegia"], 2),
      q("Ce este un afluent?", "Râu care se varsă în alt râu", ["Insulă", "Tip de munte", "Vânt cald"], 2),
      q("Munții Bucegi fac parte din:", "Carpați", ["Alpi", "Pirinei", "Caucaz"], 2),
      q("Care continent are fluviul Amazon?", "America de Sud", ["Europa", "Africa", "Australia"], 3),
      q("Ce este o izohipsă pe hartă?", "Linie de egală altitudine", ["Linie de tren", "Graniță lingvistică", "Traseu maritim"], 4),
      q("Republica Moldova are ieșire directă largă la mare?", "Nu", ["Da, la Atlantic", "Da, la Mediterană", "Da, la Marea Baltică"], 1),
      q("Ce oraș moldovenesc este cunoscut pentru vinăriile subterane?", "Cricova", ["Bălți", "Cahul", "Ungheni"], 3),
    ],
  },
  {
    category: "LIMBA ROMÂNĂ",
    questions: [
      q("Cuvântul «mamă» conține:", "Două silabe", ["O silabă", "Trei silabe", "Patru silabe"], 1),
      q("Care este forma corectă?", "copiii", ["copii-i", "copiii-i", "copi"], 2),
      q("Substantivul denumește:", "Ființe, lucruri sau fenomene", ["Acțiuni", "Însușiri", "Sunete muzicale"], 1),
      q("Verbul exprimă de obicei:", "Acțiunea sau starea", ["Culoarea", "Numărul paginii", "Dimensiunea hărții"], 1),
      q("Care este pluralul pentru «om»?", "oameni", ["omi", "omuri", "ome"], 3),
      q("Sinonimul pentru «curajos» este:", "îndrăzneț", ["fricos", "lent", "tăcut"], 2),
      q("Antonimul pentru «aproape» este:", "departe", ["lângă", "imediat", "vecin"], 1),
      q("În «fata citește», subiectul este:", "fata", ["citește", "în", "este"], 2),
      q("Ce este diftongul?", "Două sunete vocalice în aceeași silabă", ["Două propoziții", "Un tip de accent", "O pauză"], 3),
      q("Cazul genitiv răspunde la întrebarea:", "al cui?", ["unde?", "când?", "cum?"], 3),
      q("Ce marchează virgula?", "O pauză și separare în enunț", ["Sfârșitul obligatoriu al textului", "Accentul muzical", "O cifră romană"], 3),
      q("Care formă este corectă?", "să fii atent", ["să fi atent", "să fiii atent", "să fie atent tu"], 4),
    ],
  },
  {
    category: "ȘTIINȚĂ",
    questions: [
      q("Pământul se rotește în jurul:", "Soarelui", ["Lunii", "Lui Marte", "Polarei"], 1),
      q("Starea solidă a apei se numește:", "Gheață", ["Abur", "Nor", "Sare"], 1),
      q("Ce măsoară termometrul?", "Temperatura", ["Presiunea socială", "Lumina literară", "Altitudinea exactă"], 1),
      q("Plantele absorb dioxid de carbon în procesul de:", "Fotosinteză", ["Evaporare", "Magnetizare", "Traducere"], 2),
      q("Care planetă este numită planeta roșie?", "Marte", ["Venus", "Saturn", "Neptun"], 2),
      q("Ce este gravitația?", "Forță de atracție", ["Culoare", "Sunet", "Tip de hartă"], 2),
      q("Atomul are în nucleu protoni și:", "Neutroni", ["Frunze", "Silabe", "Note"], 3),
      q("Electricitatea se măsoară adesea prin tensiune în:", "Volți", ["Litri", "Grade Celsius", "Ani"], 3),
      q("Ce organ este principal pentru respirație?", "Plămânul", ["Ficatul", "Inima ca pompă", "Stomacul"], 1),
      q("ADN-ul conține:", "Informație genetică", ["Doar apă", "Numai sare", "Hartă rutieră"], 3),
      q("Ce este eclipsa de Soare?", "Luna acoperă discul solar pentru observator", ["Pământul se oprește", "Soarele dispare definitiv", "Norii devin solizi"], 4),
      q("Care este unitatea de bază pentru energie în SI?", "Joule", ["Newton", "Volt", "Metru"], 4),
    ],
  },
];

const finalBoost: BoostQuestion[] = [
  q("Ce râu traversează orașul Iași?", "Bahlui", ["Prut", "Nistru", "Olt"], 3),
  q("Ce autor a creat personajul Harap-Alb?", "Ion Creangă", ["Mihai Eminescu", "Liviu Rebreanu", "Marin Preda"], 3),
  q("Care este capitala istorică a Țării Românești asociată cu Curtea Domnească?", "Târgoviște", ["Cahul", "Bălți", "Sulina"], 4),
  q("Ce compozitor român a creat Rapsodiile române?", "George Enescu", ["Eugen Doga", "Ciprian Porumbescu", "Gavriil Musicescu"], 4),
  q("Ce termen desemnează studiul originii cuvintelor?", "Etimologie", ["Hidrologie", "Cartografie", "Coregrafie"], 4),
  q("Cine a fost domnitorul Unirii Principatelor?", "Alexandru Ioan Cuza", ["Carol I", "Ferdinand I", "Dimitrie Cantemir"], 3),
  q("Ce oraș găzduiește Ateneul Român?", "București", ["Chișinău", "Iași", "Sibiu"], 3),
  q("Ce regiune este asociată cu mănăstirile pictate exterioare?", "Bucovina", ["Dobrogea", "Banat", "Crișana"], 4, "/assets/questions/murale.svg", "Ilustrație murală"),
  q("Ce disciplină studiază hărțile?", "Cartografia", ["Muzicologia", "Etnografia", "Dramaturgia"], 4, "/assets/questions/harta.svg", "Ilustrație hartă"),
  q("Ce poet a scris «Sara pe deal»?", "Mihai Eminescu", ["George Bacovia", "Nichita Stănescu", "Grigore Vieru"], 3),
  q("Ce cetate medievală este un simbol al orașului Soroca?", "Cetatea Soroca", ["Cetatea Neamț", "Cetatea Alba Carolina", "Cetatea Făgăraș"], 4),
  q("Care este forma corectă a numelui sărbătorii din 1 martie?", "Mărțișor", ["Mărțisor", "Martisor", "Mărțișior"], 5),
  q("Ce instrument tradițional este asociat cu Gheorghe Zamfir?", "Naiul", ["Cobza", "Tulnicul", "Țambalul"], 4),
  q("Ce film al lui Cristian Mungiu a câștigat Palme d'Or?", "4 luni, 3 săptămâni și 2 zile", ["Lăutarii", "Moromeții", "Reconstituirea"], 5, "/assets/questions/cinema.svg", "Ilustrație cinema"),
  q("Ce curent cultural a promovat revista Dacia literară?", "Romantismul național", ["Suprarealismul industrial", "Futurismul italian", "Realismul socialist"], 5),
  q("În ce domeniu a excelat Constantin Brâncuși?", "Sculptură", ["Balet", "Astronomie", "Medicină"], 4),
  q("Ce oraș este asociat cu ansamblul sculptural al lui Brâncuși?", "Târgu Jiu", ["Chișinău", "Iași", "Cluj-Napoca"], 5),
  q("Ce înseamnă patrimoniu imaterial?", "Tradiții și practici culturale vii", ["Clădiri din beton", "Numai monede", "Doar picturi în ulei"], 5),
  q("Ce text este imnul Republicii Moldova?", "Limba noastră", ["Deșteaptă-te, române!", "Hora Unirii", "Trei culori"], 4),
  q("Ce limbă stă la baza limbii române?", "Latina", ["Germana", "Slava veche exclusiv", "Greaca modernă"], 3),
];

function toQuizQuestion(
  source: BoostQuestion,
  category: string,
  index: number,
  finalRound = false,
): QuizQuestion {
  return {
    id: `BOOST-${finalRound ? "final" : slugify(category)}-${index + 1}`,
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

export const contentBoostQuestions: QuizQuestion[] = [
  ...normalBoost.flatMap((group) =>
    group.questions.map((question, index) =>
      toQuizQuestion(question, group.category, index),
    ),
  ),
  ...finalBoost.map((question, index) =>
    toQuizQuestion(question, "RUNDA FINALĂ", index, true),
  ),
];
