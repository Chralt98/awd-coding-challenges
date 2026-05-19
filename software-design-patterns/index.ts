interface Creature {
  name: string;
  // prints a message what the Creature does
  useAbility(): void;
}

class Dragon implements Creature {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  useAbility(): void {
    console.log(`Breathing fire`);
  }
}

class Phoenix implements Creature {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  useAbility(): void {
    console.log(`Reborn`);
  }
}

class Unicorn implements Creature {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  useAbility(): void {
    console.log(`Dancing on rainbow`);
  }
}

class SummoningCircle {
  summon(ingredientType: string) {
    let creature: Creature;
    switch (ingredientType) {
      case "fire":
        creature = new Dragon("Dragon X");
        break;
      case "air":
        creature = new Phoenix("Phoenix Y");
        break;
      case "sparkles":
        creature = new Unicorn("Unicorn Z");
        break;
      default:
        throw new Error(`Unsupported ingredient type ${ingredientType}.`);
    }
    creature.useAbility();
  }
}

const circle = new SummoningCircle();
circle.summon("air");
circle.summon("fire");
circle.summon("sparkles");
