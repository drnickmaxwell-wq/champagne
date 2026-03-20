const SAFE_COMMAND_EXAMPLES = Object.freeze([
  'help',
  'onboarding',
  'status',
  'queue',
  'approve 42',
  'reject 42',
]);

const SAFE_PROMPT_EXAMPLES = Object.freeze([
  'Help me understand what this assistant can do.',
  'Show onboarding for a first-time user.',
  'Summarise what is waiting in the queue before I approve anything.',
  'Draft a safe reply for a customer asking for next steps.',
  'Explain why a task needs approval in plain language.',
]);

const CAN_DO = Object.freeze([
  'Explain available bot features in plain language.',
  'Show onboarding steps for first-time users.',
  'Provide safe command examples before a user acts.',
  'Describe how the queue and approval flow works.',
  'Offer prompt examples for common low-risk tasks.',
]);

const CANNOT_DO = Object.freeze([
  'Approve, reject, or execute queued work without an explicit user command.',
  'Suggest bypasses, hidden admin verbs, or unsafe escalation shortcuts.',
  'Promise external side effects that are not confirmed by the queue state.',
  'Invent unsupported capabilities or claim full autonomy.',
  'Encourage users to share secrets, credentials, or sensitive personal data.',
]);

function createCapabilityDeck() {
  return {
    title: 'Champagne Telegram Help',
    intro:
      'Use this assistant to learn the workflow, preview safe commands, and understand which actions stay queued until you approve them.',
    sections: [
      {
        key: 'can_do',
        title: 'What the system can do',
        items: CAN_DO,
      },
      {
        key: 'cannot_do',
        title: 'What the system cannot do',
        items: CANNOT_DO,
      },
      {
        key: 'safe_commands',
        title: 'Safe command examples',
        items: SAFE_COMMAND_EXAMPLES,
      },
      {
        key: 'prompt_examples',
        title: 'Prompt examples',
        items: SAFE_PROMPT_EXAMPLES,
      },
      {
        key: 'queue_approvals',
        title: 'Queue and approvals',
        items: [
          'Low-risk help text can render immediately.',
          'Anything that would change state should stay in the queue until you explicitly approve or reject it.',
          'Approval messages should explain what is waiting, why it is waiting, and what happens after approval.',
        ],
      },
    ],
  };
}

function renderCapabilityDeck(deck = createCapabilityDeck()) {
  const body = deck.sections
    .map((section) => {
      const items = section.items.map((item) => `- ${item}`).join('\n');
      return `${section.title}\n${items}`;
    })
    .join('\n\n');

  return `${deck.title}\n\n${deck.intro}\n\n${body}`;
}

function isHelpRequest(input = '') {
  const normalized = String(input).trim().toLowerCase();
  return normalized === 'help' || normalized === '/help' || normalized === 'onboarding';
}

function hasUnsafeSuggestion(text = '') {
  return /(^|\n)-\s*(bypass approval|override guard|admin token|sudo|ignore approval|force approve|share your secret key)\b/im.test(
    String(text),
  );
}

module.exports = {
  CAN_DO,
  CANNOT_DO,
  SAFE_COMMAND_EXAMPLES,
  SAFE_PROMPT_EXAMPLES,
  createCapabilityDeck,
  renderCapabilityDeck,
  isHelpRequest,
  hasUnsafeSuggestion,
};
