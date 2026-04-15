import { Question } from './types';

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: '1',
    question: '2 + 3 = ?',
    type: 'multiple',
    options: ['4', '5', '6', '7'],
    correctAnswer: '5',
    level: 'easy'
  },
  {
    id: '2',
    question: '10 - 4 = ?',
    type: 'multiple',
    options: ['5', '6', '7', '8'],
    correctAnswer: '6',
    level: 'easy'
  },
  {
    id: '3',
    question: '5 x 2 = ?',
    type: 'multiple',
    options: ['8', '10', '12', '15'],
    correctAnswer: '10',
    level: 'easy'
  },
  {
    id: '4',
    question: '12 / 3 = ?',
    type: 'multiple',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
    level: 'medium'
  },
  {
    id: '5',
    question: '15 + 27 = ?',
    type: 'multiple',
    options: ['32', '42', '52', '62'],
    correctAnswer: '42',
    level: 'medium'
  },
  {
    id: '6',
    question: '9 x 9 = ?',
    type: 'multiple',
    options: ['72', '81', '90', '99'],
    correctAnswer: '81',
    level: 'medium'
  },
  {
    id: '7',
    question: '125 - 50 = ?',
    type: 'multiple',
    options: ['65', '75', '85', '95'],
    correctAnswer: '75',
    level: 'hard'
  },
  {
    id: '8',
    question: '12 x 12 = ?',
    type: 'multiple',
    options: ['124', '134', '144', '154'],
    correctAnswer: '144',
    level: 'hard'
  },
  {
    id: '9',
    question: '250 / 5 = ?',
    type: 'multiple',
    options: ['40', '50', '60', '70'],
    correctAnswer: '50',
    level: 'hard'
  },
  {
    id: '10',
    question: 'Con chó có 4 chân, 3 con chó có bao nhiêu chân?',
    type: 'multiple',
    options: ['8', '10', '12', '14'],
    correctAnswer: '12',
    level: 'easy'
  }
];

export const GESTURE_MAP = {
  FIST: 'A',
  ONE_FINGER: 'B',
  TWO_FINGERS: 'C',
  THREE_OR_MORE: 'D'
};
