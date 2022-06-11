import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  // const stockholm = await prisma.household.create({
  //   data: {
  //     name: "Fågelstavägen 44",
  //   }
  // });

  // const guillaume = await prisma.user.create({
  //   data: {
  //     email: "guillaume.brunerie@gmail.com",
  //     password: {
  //       create: {
  //         hash: await bcrypt.hash("password", 10),
  //       },
  //     },
  //     households: {
  //       connect: [{id: stockholm.id}]
  //     },
  //   },
  // });

  // const sourceTypeGuillaume = await prisma.sourceType.create({
  //   data: {
  //     name: "Guillaume"
  //   },
  // })

  const nutella = await prisma.ingredientType.create({
    data: {
      name: "Nutella",
      image: "",
    }
  })

  const whippedCream = await prisma.ingredientType.create({
    data: {
      name: "Crème chantilly",
      image: "",
    }
  })

  await prisma.recipe.create({
    data: {
      title: "Nutella à la crème chantilly",
      // user: {
      //   connect: {id: guillaume.id},
      // },
      // household: {
      //   connect: {id: stockholm.id},
      // },
      // source: {
      //   create: {
      //     typeId: sourceTypeGuillaume.id
      //   }
      // },
      ingredients: {
        create: [{
          typeId: nutella.id,
          amount: "a lot",
        }, {
          typeId: whippedCream.id,
          amount: "even more",
        }]
      },
      steps: {
        create: [{
          step: "Servir le nutella et la chantilly."
        }, {
          step: "Déguster!"
        }]
      }
    }
  })

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
