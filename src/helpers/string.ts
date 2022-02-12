export function limitWord(input: string, max: number) {
  if (input?.length > max) {
    input = input.slice(0, max);
    const output: string = input + "...";
    return output;
  }
  return input;
}
