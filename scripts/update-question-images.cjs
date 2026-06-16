const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const replacements = new Map([
  ["/assets/questions/cascade.png", "/assets/questions/cascade.svg"],
  ["/assets/questions/murale.png", "/assets/questions/murale.svg"],
  ["/assets/questions/harta.png", "/assets/questions/harta.svg"],
  ["/assets/questions/imagini-conectate.png", "/assets/questions/imagini-conectate.svg"],
  ["/assets/questions/traditii.png", "/assets/questions/traditii.svg"],
  ["/assets/questions/cinema.png", "/assets/questions/cinema.svg"],
]);

async function main() {
  let updated = 0;

  for (const [oldUrl, newUrl] of replacements) {
    const result = await prisma.question.updateMany({
      where: { imageUrl: oldUrl },
      data: { imageUrl: newUrl },
    });
    updated += result.count;
    console.log(`${oldUrl} -> ${newUrl}: ${result.count}`);
  }

  console.log(`Updated image URLs: ${updated}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
