import { Person, MediationResult } from '../App';
import { LiveSession, ChatMessage } from '../App';
import { v4 as uuidv4 } from 'uuid';

const summaryTemplates = {
  funny: [
    "seems to be channeling their inner drama queen/king about",
    "is basically saying they feel like a misunderstood protagonist in",
    "appears to have strong feelings (and possibly strong coffee) about"
  ],
  compassionate: [
    "is feeling deeply hurt and wants to be understood about",
    "is expressing pain and seeking connection around",
    "feels vulnerable and needs support regarding"
  ],
  direct: [
    "clearly states their position on",
    "directly addresses their concerns about",
    "wants resolution regarding"
  ],
  formal: [
    "has articulated their perspective concerning",
    "has presented their viewpoint regarding",
    "has outlined their position on"
  ]
};

const misunderstandingTemplates = {
  couple: [
    "Different love languages causing communication gaps",
    "Assumptions about intentions without direct communication",
    "Past unresolved issues coloring current situations"
  ],
  friends: [
    "Different expectations about friendship boundaries",
    "Miscommunication about time and priorities",
    "Assumptions about loyalty and support"
  ],
  family: [
    "Generational differences in communication styles",
    "Unspoken expectations and traditional roles",
    "Past family dynamics affecting current relationships"
  ],
  colleagues: [
    "Different work styles and priorities",
    "Unclear role boundaries and responsibilities",
    "Professional stress affecting interpersonal relations"
  ],
  other: [
    "Different communication preferences",
    "Misaligned expectations",
    "Lack of clear boundaries"
  ]
};

const sharedThemeTemplates = {
  couple: [
    "Both want to feel loved and appreciated",
    "Both value the relationship and want it to work",
    "Both are struggling with effective communication"
  ],
  friends: [
    "Both value the friendship deeply",
    "Both want to feel respected and understood",
    "Both are dealing with external pressures"
  ],
  family: [
    "Both love each other despite the conflict",
    "Both want family harmony",
    "Both are carrying emotional baggage from the past"
  ],
  colleagues: [
    "Both want to succeed professionally",
    "Both are under workplace pressure",
    "Both want a respectful work environment"
  ],
  other: [
    "Both want to be heard and understood",
    "Both care about the outcome",
    "Both are dealing with their own stresses"
  ]
};

const peacePlanTemplates = {
  funny: {
    couple: "🎭 The Comedy Peace Plan:\n\n1. Implement the '24-hour rule' - no major relationship discussions until you've both had coffee and snacks\n2. Create a 'drama jar' - every time someone gets overly dramatic, contribute $1 to your joint fun fund\n3. Weekly 'appreciation roasts' - lovingly make fun of each other's quirks while also sharing what you adore\n4. Establish a 'time-out' signal (suggest silly dance moves) when things get too heated\n5. End arguments with a mandatory compliment about the other person",
    friends: "🎪 The Friendship Comedy Hour:\n\n1. Create friendship 'terms of service' that you both agree to (including snack-sharing policies)\n2. Implement a 'drama scale' from 1-10 to help gauge when issues are actually serious\n3. Schedule monthly 'friendship maintenance' meetings (with pizza)\n4. Create inside jokes about your conflict styles\n5. Promise to call each other out lovingly when being ridiculous",
    family: "🎨 The Family Sitcom Solution:\n\n1. Institute 'family meeting' rules (talking stick optional, snacks mandatory)\n2. Create family mottos about handling disagreements\n3. Implement a 'generational translation' system for different communication styles\n4. Schedule regular one-on-one time without distractions\n5. End family conflicts with shared memories or photo-looking sessions",
    other: "🎪 The Universal Comedy Approach:\n\n1. Acknowledge that humans are beautifully ridiculous creatures\n2. Create ground rules for respectful disagreement\n3. Implement regular check-ins with a touch of humor\n4. Focus on solutions rather than blame\n5. Remember that most conflicts stem from wanting to be understood"
  },
  compassionate: {
    couple: "💗 The Heart-Centered Healing Plan:\n\n1. Practice daily gratitude sharing - three things you appreciate about each other\n2. Create emotional safety by validating feelings before problem-solving\n3. Implement gentle touch or eye contact during difficult conversations\n4. Schedule weekly relationship nurturing time without distractions\n5. Use 'I feel' statements and listen with the intent to understand, not respond\n6. Create rituals for reconnection after conflicts",
    friends: "🌸 The Friendship Restoration Path:\n\n1. Acknowledge the value and history of your friendship\n2. Practice vulnerable sharing about your individual struggles\n3. Create space for both people to feel heard without judgment\n4. Focus on emotional healing before practical solutions\n5. Plan meaningful activities that reconnect you to why you're friends\n6. Regular check-ins about how the friendship is feeling",
    family: "🕊 The Family Harmony Approach:\n\n1. Honor the love that exists beneath the conflict\n2. Practice intergenerational empathy and understanding\n3. Create new family traditions that bring joy\n4. Allow space for individual growth within family bonds\n5. Focus on healing old wounds with patience and compassion\n6. Regular family appreciation circles",
    other: "🌺 The Compassionate Connection Method:\n\n1. Approach each other with curiosity rather than judgment\n2. Practice active listening and emotional validation\n3. Focus on shared humanity and common needs\n4. Create safe spaces for vulnerable communication\n5. Prioritize emotional healing alongside practical solutions\n6. Regular compassionate check-ins"
  },
  direct: {
    couple: "🎯 The Straight-Talk Relationship Plan:\n\n1. Schedule weekly 20-minute relationship meetings to address issues promptly\n2. Use clear, specific language about needs and boundaries\n3. Implement a 'no beating around the bush' policy for important conversations\n4. Create action items with deadlines for relationship improvements\n5. Address problems immediately rather than letting them fester\n6. Regular relationship health assessments",
    friends: "⚡ The No-Nonsense Friendship Fix:\n\n1. Have honest conversations about friendship expectations\n2. Set clear boundaries and communicate them directly\n3. Address issues within 48 hours of them arising\n4. Be specific about what you need from each other\n5. Create accountability systems for maintaining the friendship\n6. Regular friendship status updates",
    family: "🔧 The Family Problem-Solving Protocol:\n\n1. Establish clear family communication rules and stick to them\n2. Address generational differences head-on with specific examples\n3. Create structured family meetings with agendas\n4. Set measurable goals for family relationship improvement\n5. Implement immediate feedback systems\n6. Regular family efficiency reviews",
    other: "⚙️ The Direct Resolution Method:\n\n1. Clearly define the problem and desired outcomes\n2. Set specific timelines for resolution\n3. Create measurable action steps\n4. Implement regular progress check-ins\n5. Address resistance or obstacles immediately\n6. Maintain focus on practical solutions"
  },
  formal: {
    couple: "📋 The Structured Relationship Agreement:\n\n1. Establish formal communication protocols for addressing relationship concerns\n2. Implement regular relationship review meetings with documented outcomes\n3. Create a relationship charter outlining shared values and expectations\n4. Develop conflict resolution procedures with clear steps\n5. Maintain relationship documentation for tracking progress\n6. Regular formal relationship assessments",
    friends: "📊 The Friendship Framework:\n\n1. Develop a friendship charter outlining mutual expectations\n2. Establish formal communication channels for addressing concerns\n3. Implement structured check-in procedures\n4. Create documented agreements about friendship boundaries\n5. Develop clear protocols for conflict resolution\n6. Regular friendship performance reviews",
    family: "📑 The Family Governance Structure:\n\n1. Establish family bylaws for communication and conflict resolution\n2. Implement structured family meeting procedures\n3. Create formal roles and responsibilities within family dynamics\n4. Develop documented family values and principles\n5. Establish clear protocols for addressing family disputes\n6. Regular family governance reviews",
    other: "📋 The Professional Resolution Protocol:\n\n1. Establish formal communication frameworks\n2. Implement structured problem-solving methodologies\n3. Create documented agreements and expectations\n4. Develop clear escalation procedures\n5. Maintain professional boundaries and protocols\n6. Regular formal review processes"
  }
};

export function generateMediationResult(
  persons: Person[], 
  relationship: string, 
  tone: string
): MediationResult {
  const summaries = persons.map((person, index) => {
    const templates = summaryTemplates[tone as keyof typeof summaryTemplates] || summaryTemplates.compassionate;
    const template = templates[index % templates.length];
    const name = person.name || `Person ${String.fromCharCode(65 + index)}`;
    return `${name} ${template} ${getConflictTopic(person.statement)}.`;
  });

  const misunderstandings = misunderstandingTemplates[relationship as keyof typeof misunderstandingTemplates] || 
                           misunderstandingTemplates.other;

  const sharedThemes = sharedThemeTemplates[relationship as keyof typeof sharedThemeTemplates] || 
                      sharedThemeTemplates.other;

  const peacePlan = peacePlanTemplates[tone as keyof typeof peacePlanTemplates]?.[relationship as keyof typeof peacePlanTemplates[typeof tone]] ||
                   peacePlanTemplates.compassionate.other;

  return {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    persons,
    relationship,
    tone,
    summaries,
    misunderstandings: misunderstandings.slice(0, 3),
    sharedThemes: sharedThemes.slice(0, 3),
    peacePlan
  };
}

function getConflictTopic(statement: string): string {
  const topics = [
    "communication patterns",
    "quality time and attention",
    "household responsibilities",
    "work-life balance",
    "expectations and boundaries",
    "trust and transparency",
    "personal space and independence",
    "financial priorities",
    "social activities and friendships",
    "family obligations"
  ];
  
  // Simple keyword matching to suggest relevant topics
  const lowerStatement = statement.toLowerCase();
  if (lowerStatement.includes('time') || lowerStatement.includes('busy')) return topics[1];
  if (lowerStatement.includes('work') || lowerStatement.includes('job')) return topics[3];
  if (lowerStatement.includes('money') || lowerStatement.includes('spend')) return topics[7];
  if (lowerStatement.includes('clean') || lowerStatement.includes('house')) return topics[2];
  if (lowerStatement.includes('trust') || lowerStatement.includes('honest')) return topics[5];
  if (lowerStatement.includes('friend') || lowerStatement.includes('social')) return topics[8];
  if (lowerStatement.includes('family') || lowerStatement.includes('parent')) return topics[9];
  
  return topics[Math.floor(Math.random() * topics.length)];
}

export function generateAIResponse(messages: ChatMessage[], tone: string): string {
  const recentUserMessages = messages.filter(m => m.type === 'user').slice(-3);
  
  if (recentUserMessages.length === 0) {
    return "I'm here to help facilitate this conversation. Please share your thoughts.";
  }

  const responses = {
    funny: [
      "I hear you both, and I'm sensing some strong feelings here. Let's take a breath and remember we're all just humans trying to figure things out! 😊",
      "That's a valid point! Now, let's see if we can find some common ground - maybe somewhere between 'I'm right' and 'you're wrong'? 😉",
      "I appreciate you sharing that. Sometimes conflicts are like tangled headphones - frustrating, but usually solvable with patience! 🎧"
    ],
    compassionate: [
      "Thank you for sharing that with such honesty. I can hear the pain in your words, and I want you to know that your feelings are completely valid.",
      "I'm sensing a lot of hurt here, and that's okay. Healing takes time, and you're both being so brave by having this conversation.",
      "What I'm hearing is that you both care deeply about this relationship. That love, even when it's complicated, is something beautiful to build on."
    ],
    direct: [
      "Let me reflect back what I'm hearing: you both have specific concerns that need to be addressed. Let's focus on solutions.",
      "I notice some key issues emerging. Let's tackle them one by one and find practical ways forward.",
      "You've both made important points. Now let's identify the specific actions needed to resolve this."
    ],
    formal: [
      "I acknowledge the perspectives that have been shared. Let us proceed to identify the core issues and potential resolutions.",
      "Thank you for your contributions to this discussion. I believe we can establish a framework for moving forward constructively.",
      "Based on the information provided, I suggest we focus on developing a structured approach to address these concerns."
    ]
  };

  const toneResponses = responses[tone as keyof typeof responses] || responses.compassionate;
  return toneResponses[Math.floor(Math.random() * toneResponses.length)];
}

export function generateMediationSummary(session: LiveSession): MediationResult {
  const userMessages = session.messages.filter(m => m.type === 'user');
  const participantNames = session.participants.map(p => p.name).join(' and ');
  
  return {
    id: uuidv4(),
    date: new Date().toISOString(),
    sessionId: session.id,
    participants: session.participants,
    relationship: session.relationship,
    tone: session.tone,
    chatMessages: session.messages,
    peacePlan: `Live mediation session completed between ${participantNames}. Through open dialogue and AI facilitation, both parties engaged in meaningful conversation about their ${session.relationship} relationship. The session included ${userMessages.length} exchanges and concluded with mutual understanding and commitment to moving forward positively.`
  };
}