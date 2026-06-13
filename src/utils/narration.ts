import { say, ask, cheer, emphasize, celebrate, instruct } from './audio';

export function introNarration() {
  return [
    cheer('Welcome to Multiplication Tables!'),
    say('Today we will master the times tables for six, seven, eight, and nine.'),
    ask('Can you spot patterns and solve multiplication facts quickly?'),
    cheer('Are you ready to explore four amazing worlds and become a multiplication master? Let us begin!'),
  ];
}

export function wonderNarration(questionText: string, subtext: string) {
  return [ask(questionText), say(subtext)];
}

export function wonderDiscoverNarration() {
  return [];
}

export function getStoryNarration(slideIndex: number) {
  switch (slideIndex) {
    case 0:
      return [
        say('Sarah explores the coral reef and discovers rows of six colourful fish.'),
        ask('How many fish are there when there are four rows of six?'),
        say('That is what the six times table helps us find out!'),
      ];
    case 1:
      return [
        say('Miguel swings through the jungle canopy counting groups of seven.'),
        emphasize('Seven is tricky, but patterns and practice make it easier!'),
      ];
    case 2:
      return [
        say('John floats in the space station. Each fuel pod holds eight litres.'),
        emphasize('Eight is double-double — a handy trick for the eights!'),
      ];
    case 3:
      return [
        say('Aiko unlocks the ancient temple and learns the nine times table.'),
        emphasize('The digits of nine times facts always add up to nine!'),
      ];
    case 4:
      return [
        cheer('You have met all four table worlds!'),
        say('Now it is time to practice building arrays and solving challenges!'),
      ];
    default:
      return [];
  }
}

export function simulateStation1Intro() {
  return [
    instruct('Tap each circle to build equal rows for multiplication!'),
    ask('Put the same number in every group. Can you fill them all?'),
  ];
}

export function simulateStation2Intro() {
  return [
    instruct('Look at these multiplication arrays. Which one matches the sentence?'),
    ask('Tap the correct arrangement!'),
  ];
}

export function simulateStation3Intro() {
  return [ask('Fill in the missing number. Use the number pad!')];
}

export function playWorldIntro(worldName: string) {
  return [celebrate(`Welcome to ${worldName}!`)];
}

export function playReadQuestion(questionText: string) {
  return [say(questionText)];
}

export function playCorrectNarration() {
  return [];
}

export function playWrongNarration() {
  return [];
}

export function playWorldComplete(worldName: string, score: number, total: number) {
  return [say(`${worldName} Complete!`), say(`Score: ${score} out of ${total}`)];
}

export function reflectIntroNarration() {
  return [ask('What did you learn about multiplication tables?')];
}

export function reflectCorrectNarration() {
  return [];
}

export function reflectWrongNarration() {
  return [];
}

export function reflectConfidenceNarration() {
  return [ask('How confident do you feel about times tables six through nine?')];
}

export function reflectCertificateNarration(pct: number) {
  return [say(`You scored ${Math.round(pct)} percent!`)];
}
