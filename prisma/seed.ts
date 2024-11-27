import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passenger = await prisma.user.create({
    data:{
      email: "natanborgesseed@gmail.com",
      name: "natan borges seed",
      role: "passenger",
      password: "123123"
    }
  })
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
            avgRating: 2,
            tax: 2.50,
            vehicle: "Plymouth Valiant 1973 rosa e enferrujado",
            ride: {
              create:{
                destination: "Jardim Botanico Rio de Janeiro",
                origin: "Aeroporto Santos Dumont",
                distance: 1000,
                duration: "20 mins",
                status: "completed",
                value: 10,
                passengerId: passenger.id,
                review: {
                  create: {
                    authorRole: "passenger",
                    rating: 2,
                    comment: "Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.",
                    userId: passenger.id,
                  }
                }
              }
            }
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
            minKm: 5,
            avgRating: 4,
            tax: 5,
            vehicle: "Dodge Charger R/T 1970 modificado",
            ride: {
              create:{
                destination: "Jardim Botanico Rio de Janeiro",
                origin: "Aeroporto Santos Dumont",
                distance: 1000,
                duration: "20 mins",
                status: "completed",
                value: 10,
                passengerId: passenger.id,
                review: {
                  create: {
                    authorRole: "passenger",
                    rating: 4,
                    comment: "Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!",
                    userId: passenger.id,
                  }
                }
              }
            }
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
            minKm: 10,
            avgRating: 5,
            tax: 10,
            vehicle: "Aston Martin DB5 clássico",
            ride: {
              create:{
                destination: "Jardim Botanico Rio de Janeiro",
                origin: "Aeroporto Santos Dumont",
                distance: 1000,
                duration: "20 mins",
                status: "completed",
                value: 10,
                passengerId: passenger.id,
                review: {
                  create: {
                    authorRole: "passenger",
                    rating: 5,
                    comment: "Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.",
                    userId: passenger.id,
                  }
                }
              }
            }
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
