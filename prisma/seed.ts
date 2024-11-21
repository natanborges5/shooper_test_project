import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: 'Homer Simpson',
      email: 'homersimpson@example.com',
      password: 'hashedpassword',
      role: 'driver',
      driver: {
        create: {
            description: "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
            minKm: 1,
            rating: "2/5 Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.",
            tax: 2.50,
            vehicle: "Plymouth Valiant 1973 rosa e enferrujado",
        }
      }
    },
  });
  await prisma.user.create({
    data: {
      name: 'Dominic Toretto',
      email: 'dominictoretto@example.com',
      password: 'hashedpassword',
      role: 'driver',
      driver: {
        create: {
            description: "Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.",
            minKm: 1,
            rating: "4/5 Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!",
            tax: 2.50,
            vehicle: "Dodge Charger R/T 1970 modificado",
        }
      }
    },
  });
  await prisma.user.create({
    data: {
      name: 'James Bond',
      email: 'johndoe@example.com',
      password: 'hashedpassword',
      role: 'driver',
      driver: {
        create: {
            description: "Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.",
            minKm: 1,
            rating: "5/5 Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.",
            tax: 2.50,
            vehicle: "Aston Martin DB5 clássico",
        }
      }
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
