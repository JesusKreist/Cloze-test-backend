export interface ProcessedWord {
  wordType: "whole" | "split";
  returnedWord: string;
  lineLength: number;
  indexOfWord: number;
  punctuation: string;
  fullWord: string;
  answers: string[];
  hasPunctuation: boolean;
}

const setWordType = (
  word: string,
  formattedWordObj: Partial<ProcessedWord>
) => {
  if (word.startsWith("@split")) {
    formattedWordObj.wordType = "split";
  } else {
    formattedWordObj.wordType = "whole";
  }
};

const getWordWithoutPrefix = (word: string) => {
  if (word.startsWith("@split")) {
    return word.replace("@split", "");
  }
  return word;
};

const setHasPunctuationInWord = (
  word: string,
  formattedWordObj: Partial<ProcessedWord>
) => {
  if (word.endsWith("@punctuation")) {
    formattedWordObj.hasPunctuation = true;
  } else {
    formattedWordObj.hasPunctuation = false;
  }
};

const getWordWithoutSuffix = (word: string) => {
  if (word.endsWith("@punctuation")) {
    return word.replace("@punctuation", "");
  }

  return word;
};

const getWordWithoutPunctuation = (
  word: string,
  formattedWordObj: Partial<ProcessedWord>
) => {
  if (formattedWordObj.hasPunctuation) {
    const lastIndex = word.length - 1;
    const wordWithoutPunctuation = word.substring(0, lastIndex);
    return wordWithoutPunctuation;
  }
  return word;
};

const setPunctuationInObject = (
  word: string,
  formattedWordObj: Partial<ProcessedWord>
) => {
  if (formattedWordObj.hasPunctuation) {
    const lastIndex = word.length - 1;
    formattedWordObj.punctuation = word.charAt(lastIndex);
  } else {
    formattedWordObj.punctuation = "";
  }
};

const getProcessedWords = (splitParagraph: string[]): ProcessedWord[] => {
  const createdQuiz = splitParagraph.map((word, indexOfWord) => {
    const formattedWordObj: Partial<ProcessedWord> = {};

    setWordType(word, formattedWordObj);
    const wordWithoutPrefix = getWordWithoutPrefix(word);
    setHasPunctuationInWord(wordWithoutPrefix, formattedWordObj);

    const wordWithoutSuffix = getWordWithoutSuffix(wordWithoutPrefix);
    setPunctuationInObject(wordWithoutSuffix, formattedWordObj);

    const wordWithoutPunctuation = getWordWithoutPunctuation(
      wordWithoutSuffix,
      formattedWordObj
    );

    if (formattedWordObj.wordType === "split") {
      const lengthOfWord = wordWithoutPunctuation.length;
      const halfOfWordLength = Math.floor(lengthOfWord / 2);
      const firstPartOfWord = wordWithoutPunctuation.slice(0, halfOfWordLength);
      const secondPartOfWord = wordWithoutPunctuation.slice(halfOfWordLength);

      formattedWordObj.returnedWord = firstPartOfWord;
      formattedWordObj.answers = [secondPartOfWord];
      formattedWordObj.lineLength = firstPartOfWord.length + 1;
    } else {
      formattedWordObj.answers = [""];
      formattedWordObj.lineLength = 0;
      formattedWordObj.returnedWord = wordWithoutPunctuation;
    }

    formattedWordObj.indexOfWord = indexOfWord;
    formattedWordObj.fullWord = wordWithoutPunctuation;

    const quizObject = formattedWordObj as ProcessedWord;
    return quizObject;
  });

  return createdQuiz;
};

export const createQuiz = (text: string) => {
  const splitParagraph = text.replace(/(\r\n|\n|\r)/gm, " ").split(" ");
  const formattedWords = getProcessedWords(splitParagraph);
  return formattedWords;
};
