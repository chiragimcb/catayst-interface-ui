import questionsData from '@/data/cat_2023_data.json';

export interface Option {
  id: string;
  label: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
  answer: string;
  exam: string;
}

export const getQuestions = (): Question[] => {
  return questionsData.slice(0, 22).map((q, index) => {
    // Transform string options ["opt1", "opt2"...] into objects [{id: 'a', text: 'opt1'}...]
    const transformedOptions = q.options.map((optStr, i) => ({
      id: String.fromCharCode(97 + i), // a, b, c, d
      label: String.fromCharCode(65 + i), // A, B, C, D
      text: optStr
    }));

    return {
      id: index + 1,
      text: q.question,
      options: transformedOptions,
      answer: q.answer,
      exam: q.exam
    };
  });
};