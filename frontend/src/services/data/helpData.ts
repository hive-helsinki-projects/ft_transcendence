export interface FAQ {
  question: string
  answer: string
}

export const gameRules = [
  'The game is played between two players.',
  'Each player takes turns hitting the ball across the table.',
  "The ball must bounce once on the opponent's side of the table before they return it.",
  'A point is scored if the opponent fails to return the ball or hits it out of bounds.',
  'The first player to reach 11 points with a 2-point lead wins the game.',
  'If the score reaches 10-10, the game continues until one player has a 2-point lead.',
]

export const faqs: FAQ[] = [
  {
    question: 'How do I register an account?',
    answer:
      "Click on the 'Register' button on the landing page and fill out the form.",
  },
  {
    question: 'How do I reset my password?',
    answer:
      "Go to the login page and click on 'Forgot Password' to reset your password.",
  },
  {
    question: 'How do I start a game?',
    answer:
      "Navigate to the 'Game' section from the sidebar and click 'Start Game'.",
  },
]

export const troubleshootingSteps = [
  'Ensure you have a stable internet connection.',
  'Clear your browser cache and cookies.',
  'Restart the application.',
]
