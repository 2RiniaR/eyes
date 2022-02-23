import { RandomSource } from "../models/eyes";

export class RandomSourceImpl implements RandomSource {
  public getRandomInteger(min: number, max: number): number {
    if (max - min < 0) {
      throw new RangeError("Max was smaller than min.");
    }
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  public getRandomNormalized(): number {
    return Math.random();
  }
}
