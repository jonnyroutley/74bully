import { Layout } from "@/layouts/layout";
import { INSPECT_MAX_BYTES } from "buffer";
import Image from "next/image";

interface Housemate {
  name: string;
  hp: number;
  type: string;
  height: string;
  weight: string;
  powerName: string;
  powerDescription: string;
  move1Name: string;
  move1Description: string;
  move1Damage: number;
  move2Name: string;
  move2Description: string;
  move2Damage: number;
  weakness: string;
  resistance: string;
  retreatCost: string;
  fact: string;
}

const Reviews = () => {

  const jonny: Housemate = {
    name: "Jonny",
    hp: 100,
    type: "Fire",
    height: "6'10",
    weight: "10 stone",
    powerName: "string",
    powerDescription: "string",
    move1Name: "string",
    move1Description: "string",
    move1Damage: 100,
    move2Name: "string",
    move2Description: "string",
    move2Damage: 100,
    weakness: "string",
    resistance: "string",
    retreatCost: "string",
    fact: "string",
  };

  const fraser: Housemate = {
    name: "Fraser",
    hp: 100,
    type: "Fire",
    height: "6'10",
    weight: "10 stone",
    powerName: "string",
    powerDescription: "string",
    move1Name: "string",
    move1Description: "string",
    move1Damage: 100,
    move2Name: "string",
    move2Description: "string",
    move2Damage: 100,
    weakness: "string",
    resistance: "string",
    retreatCost: "string",
    fact: "string",
  };

  const mia: Housemate = {
    name: "Mia",
    hp: 100,
    type: "Fire",
    height: "6'10",
    weight: "10 stone",
    powerName: "string",
    powerDescription: "string",
    move1Name: "string",
    move1Description: "string",
    move1Damage: 100,
    move2Name: "string",
    move2Description: "string",
    move2Damage: 100,
    weakness: "string",
    resistance: "string",
    retreatCost: "string",
    fact: "string",
  };

  const doug: Housemate = {
    name: "Doug",
    hp: 100,
    type: "Fire",
    height: "6'10",
    weight: "10 stone",
    powerName: "string",
    powerDescription: "string",
    move1Name: "string",
    move1Description: "string",
    move1Damage: 100,
    move2Name: "string",
    move2Description: "string",
    move2Damage: 100,
    weakness: "string",
    resistance: "string",
    retreatCost: "string",
    fact: "string",
  };

  const housemates: Housemate[] = [jonny, fraser, mia, doug];

  return (
    <Layout>
      <div className="flex justify-center">
        <div className="flex w-full max-w-xl flex-col gap-4">
          <h1 className="text-4xl font-bold">Meet the House!</h1>
          <p>Who are we?</p>
          {housemates.map((housemate) => (
            <div className="mx-auto flex w-96 flex-row flex-wrap rounded-xl bg-[#ffd102] p-4">
              <div className="flex w-full shadow-inner">
                <div
                  className="background-color: rgb(185, 28, 
                    28); background-image: radial-gradient(at 4%
        14%, rgb(124, 58, 237) 0, transparent 90%), radial-gradient(at 99% 61%, rgb(153, 27, 27) 0, transparent 93%), radial-gradient(at 89% 65%, rgb(251, 207, 232) 0, transparent 43%), radial-gradient(at 1% 50%, rgb(157, 23, 77) 0, transparent 55%), radial-gradient(at 17% 9%, rgb(217, 119, 6) 0, transparent 37%), radial-gradient(at 64% 2%, rgb(120, 113, 108) 0, transparent 23%), radial-gradient(at 97% 7%, rgb(131, 24, 67) 0, transparent 16%); flex w-full flex-col
       justify-between gap-2 bg-red-400 p-4 text-sm"
                >
                  <div className="mx-4 flex items-center justify-between gap-2">
                    <h2 className="text-lg font-bold">{housemate.name}</h2>
                    <p>{housemate.hp} HP 🔥</p>
                  </div>
                  <Image
                    src="/poke.jpeg"
                    alt="Pokemon"
                    width={400}
                    height={300}
                    className="border-8 border-amber-300 shadow-xl"
                  />
                  <div className="mx-2 flex flex-row justify-between bg-gradient-to-r from-[#D0AE31] to-[#FFE292] px-2 py-1 text-xs font-bold italic">
                    <p>{housemate.type} Pokemon</p>
                    <p>Length: {housemate.height}</p>
                    <p>Weight: {housemate.weight}</p>
                  </div>
                  <p>
                    <span className="mr-2 text-base font-bold text-blue-950">
                      Pokemon Power: Thirsty Boy
                    </span>
                    Drink 8 pints. This is some filler text to make the
                    paragraph look bigger
                  </p>
                  <hr className="border-t-2 border-black" />

                  <div className="flex flex-row gap-1">
                    <p className="min-w-[40px]">🔥🔥</p>
                    <p className="font-bold">Move Name</p>
                    <p>Description</p>
                    <p className="ml-auto font-bold">-10</p>
                  </div>
                  <hr className="border-t-2 border-black" />
                  <div className="flex flex-row gap-1">
                    <p className="min-w-[40px]">🙈🙈</p>
                    <p className="font-bold">Move Name</p>
                    <p>Description</p>
                    <p className="ml-auto font-bold">100</p>
                  </div>
                  <hr className="border-t-2 border-black" />
                  <div className="flex flex-row justify-between text-xs">
                    <div className="flex flex-col text-center">
                      <p className="font-semibold">Weakness</p>
                      <p>💦</p>
                    </div>
                    <div className="flex flex-col text-center">
                      <p className="font-semibold">Resistance</p>
                      <p>🍆</p>
                    </div>
                    <div className="flex flex-col text-center">
                      <p className="font-semibold">Retreat Cost</p>
                      <p>🌮</p>
                    </div>
                  </div>
                  <div className="border-2 border-amber-300 px-2 py-1 text-xs font-semibold italic drop-shadow-md">
                    <p>
                      Has been known to drink coffee on the toilet. Puts the
                      bins out for the neighbours though.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Reviews;
