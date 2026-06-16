import type { QuizQuestion } from "./question-bank";

type ExtraQuestion = {
  category: string;
  text: string;
  correct: string;
  wrong: [string, string, string];
  difficulty: 1 | 2 | 3 | 4 | 5;
  finalRound?: boolean;
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
  category: string,
  text: string,
  correct: string,
  wrong: [string, string, string],
  difficulty: 1 | 2 | 3 | 4 | 5,
  finalRound = false,
): ExtraQuestion {
  return { category, text, correct, wrong, difficulty, finalRound };
}

const extraNormal: ExtraQuestion[] = [
  q("PERSONALITĂȚI", "Cine este autorul versurilor imnului Republicii Moldova?", "Alexei Mateevici", ["Grigore Vieru", "Mihai Eminescu", "Vasile Alecsandri"], 3),
  q("PERSONALITĂȚI", "Cine a fost supranumit poetul nepereche?", "Mihai Eminescu", ["George Coșbuc", "Tudor Arghezi", "Lucian Blaga"], 2),
  q("PERSONALITĂȚI", "Cine este compozitorul cunoscut pentru valsul din filmul Gingașa și tandra mea fiară?", "Eugen Doga", ["George Enescu", "Ciprian Porumbescu", "Gavriil Musicescu"], 3),
  q("PERSONALITĂȚI", "Dimitrie Cantemir a fost membru al Academiei din:", "Berlin", ["Paris", "Roma", "Viena"], 4),

  q("ISTORIE", "În ce an Republica Moldova și-a declarat independența?", "1991", ["1989", "1918", "2001"], 2),
  q("ISTORIE", "Unirea Principatelor Române a avut loc în timpul domniei lui:", "Alexandru Ioan Cuza", ["Mihai Viteazul", "Carol I", "Ferdinand I"], 2),
  q("ISTORIE", "Ce domnitor este asociat cu bătălia de la Vaslui din 1475?", "Ștefan cel Mare", ["Petru Rareș", "Dimitrie Cantemir", "Mihai Viteazul"], 3),
  q("ISTORIE", "Sfatul Țării a votat unirea Basarabiei cu România în:", "1918", ["1859", "1940", "1991"], 4),

  q("LITERATURĂ", "Cine a scris romanul Pădurea spânzuraților?", "Liviu Rebreanu", ["Marin Preda", "Mihail Sadoveanu", "Camil Petrescu"], 3),
  q("LITERATURĂ", "Ce autor a scris Enigma Otiliei?", "George Călinescu", ["Ion Creangă", "Ion Luca Caragiale", "Tudor Arghezi"], 3),
  q("LITERATURĂ", "Genul dramatic este destinat în primul rând:", "Reprezentării scenice", ["Citirii pe hartă", "Cântării corale", "Calculului matematic"], 2),
  q("LITERATURĂ", "Cine a scris poezia Eu nu strivesc corola de minuni a lumii?", "Lucian Blaga", ["George Bacovia", "Nichita Stănescu", "Vasile Alecsandri"], 4),

  q("GEOGRAFIE", "Care râu marchează o parte din granița dintre România și Republica Moldova?", "Prut", ["Olt", "Mureș", "Tisa"], 2),
  q("GEOGRAFIE", "Care este cel mai mare oraș al Republicii Moldova?", "Chișinău", ["Bălți", "Cahul", "Soroca"], 1),
  q("GEOGRAFIE", "Delta Dunării este inclusă în patrimoniul:", "UNESCO", ["NATO", "OPEC", "FIFA"], 3),
  q("GEOGRAFIE", "Ce oraș moldovenesc este cunoscut pentru cetatea de pe Nistru?", "Soroca", ["Comrat", "Ungheni", "Hîncești"], 2),

  q("TRADIȚII", "Mărțișorul este asociat cu începutul lunii:", "Martie", ["Mai", "Decembrie", "Septembrie"], 1),
  q("TRADIȚII", "Colindele sunt cântate mai ales în perioada:", "Crăciunului", ["Paștelui", "Rusaliilor", "Zilei Limbii Române"], 1),
  q("TRADIȚII", "Cămașa cu altiță este parte din:", "Portul tradițional", ["Arhitectura modernă", "Cinema", "Cartografie"], 2),
  q("TRADIȚII", "Hora se dansează de obicei:", "În cerc", ["Pe scaune", "În linie militară strictă", "În tăcere totală"], 1),

  q("CINEMA", "Ce rol are scenariul într-un film?", "Structurează acțiunea și dialogurile", ["Reglează lumina singur", "Vinde biletele", "Înlocuiește actorii"], 2),
  q("CINEMA", "Regizorul coordonează în principal:", "Viziunea artistică", ["Tipărirea afișelor", "Curățenia sălii", "Vânzarea popcornului"], 2),
  q("CINEMA", "Montajul în film înseamnă:", "Asamblarea cadrelor", ["Scrierea genericului pe hârtie", "Alegerea scaunelor", "Vopsirea decorului"], 2),
  q("CINEMA", "Un documentar urmărește de obicei:", "Realitatea și informația", ["Numai magie", "Doar reclame", "Exclusiv basme"], 1),

  q("LIMBA ROMÂNĂ", "Care este forma corectă?", "să fii atent", ["să fi atent", "să fiii atent", "să fie atent tu"], 4),
  q("LIMBA ROMÂNĂ", "Sinonimul cuvântului harnic este:", "muncitor", ["leneș", "întârziat", "rece"], 1),
  q("LIMBA ROMÂNĂ", "Antonimul cuvântului curajos este:", "fricos", ["viteaz", "îndrăzneț", "hotărât"], 1),
  q("LIMBA ROMÂNĂ", "În propoziția Maria cântă, predicatul este:", "cântă", ["Maria", "propoziția", "este"], 2),

  q("ȘTIINȚĂ", "Ce planetă este cunoscută drept planeta roșie?", "Marte", ["Venus", "Saturn", "Mercur"], 2),
  q("ȘTIINȚĂ", "Ce gaz respirăm pentru a supraviețui?", "Oxigen", ["Heliu", "Azot pur", "Neon"], 1),
  q("ȘTIINȚĂ", "Fotosinteza are loc în principal la:", "Plante", ["Roci", "Metale", "Nori"], 2),
  q("ȘTIINȚĂ", "Unitatea de măsură pentru forță este:", "Newton", ["Volt", "Litru", "Grad"], 3),
];

const extraFinal: ExtraQuestion[] = [
  q("RUNDA FINALĂ", "Ce personalitate a scris Descriptio Moldaviae?", "Dimitrie Cantemir", ["Miron Costin", "Ion Neculce", "Bogdan Petriceicu Hasdeu"], 4, true),
  q("RUNDA FINALĂ", "Ce sculptor este autorul Coloanei fără sfârșit?", "Constantin Brâncuși", ["Ion Jalea", "Oscar Han", "Dimitrie Paciurea"], 4, true),
  q("RUNDA FINALĂ", "Ce oraș este asociat cu ansamblul sculptural al lui Brâncuși?", "Târgu Jiu", ["Iași", "Chișinău", "Suceava"], 5, true),
  q("RUNDA FINALĂ", "Cine a scris Letopisețul Țării Moldovei?", "Grigore Ureche", ["Mihai Eminescu", "Alexei Mateevici", "Eugen Doga"], 5, true),
  q("RUNDA FINALĂ", "Ce poet a scris Plumb?", "George Bacovia", ["Lucian Blaga", "Tudor Arghezi", "Grigore Vieru"], 3, true),
  q("RUNDA FINALĂ", "Ce oraș este capitala istorică a Bucovinei?", "Cernăuți", ["Cahul", "Tiraspol", "Constanța"], 4, true),
  q("RUNDA FINALĂ", "Ce instrument este asociat cu Gheorghe Zamfir?", "Naiul", ["Cobza", "Țambalul", "Flautul traversier"], 4, true),
  q("RUNDA FINALĂ", "Care este originea principală a limbii române?", "Latină", ["Germanică", "Ugro-finică", "Celtică modernă"], 3, true),
];

function toQuizQuestion(source: ExtraQuestion, index: number): QuizQuestion {
  return {
    id: `EXTRA-${source.finalRound ? "final" : slugify(source.category)}-${index + 1}`,
    category: source.category,
    text: source.text,
    difficulty: source.difficulty,
    finalRound: source.finalRound,
    answers: [
      { id: "a", text: source.correct },
      { id: "b", text: source.wrong[0] },
      { id: "c", text: source.wrong[1] },
      { id: "d", text: source.wrong[2] },
    ],
    correctAnswerId: "a",
  };
}

export const extraTextQuestions: QuizQuestion[] = [
  ...extraNormal.map(toQuizQuestion),
  ...extraFinal.map(toQuizQuestion),
];
