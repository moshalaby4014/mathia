export type LessonPhase =
  | 'discover'
  | 'visualize'
  | 'predict'
  | 'interact'
  | 'explain'
  | 'practice'
  | 'apply'
  | 'master';

export type MathRepresentation =
  | 'objects'
  | 'number_line'
  | 'ten_frame'
  | 'place_value'
  | 'vertical_equation'
  | 'fact_family'
  | 'chart_120'
  | 'clock'
  | 'ruler';

export type LessonCategory =
  | 'addition_strategies'
  | 'subtraction_strategies'
  | 'place_value_regrouping'
  | 'number_patterns'
  | 'story_problems'
  | 'time_and_measurement';

export interface PredictionOption {
  id: string;
  textAr: string;
  isCorrect: boolean;
  explanationAr: string;
}

export interface PredictionPrompt {
  questionAr: string;
  options: PredictionOption[];
}

export interface ExplanationStep {
  titleAr: string;
  textAr: string;
  highlightTarget?: string;
  miroMood?: 'excited' | 'thinking' | 'explaining' | 'celebrating';
  visualHintAr?: string;
}

export interface ActivityStep {
  id: string;
  promptAr: string;
  instructionAr: string;
  initialState: any;
  targetState: any;
  availableRepresentations: MathRepresentation[];
  defaultRepresentation: MathRepresentation;
  prediction?: PredictionPrompt;
  whyExplanation: {
    questionAr: string;
    answerAr: string;
    visualConcept: string;
  };
  walkthroughSteps: ExplanationStep[];
  hintAr: string;
  misconceptionMap?: Record<string, { tag: string; feedbackAr: string; remedyWorkshopId?: string }>;
}

export interface ParentCoachingGuide {
  conceptSummary: string;
  howToExplainInOneMinute: string;
  homeActivity: string;
  questionsBeforePlaying: string[];
  commonPitfall: string;
  encouragementPhrase: string;
}

export interface Lesson {
  id: string;
  titleAr: string;
  subtitleAr: string;
  category: LessonCategory;
  worldId: string;
  icon: string;
  colorTheme: string;
  conceptAr: string;
  objectiveAr: string;
  prerequisitesAr: string[];
  supportedRepresentations: MathRepresentation[];
  parentGuide?: ParentCoachingGuide;
  storyIntro: {
    characterName: string;
    scenarioAr: string;
    dialogueAr: string;
    sceneEmoji: string;
  };
  prediction?: PredictionPrompt;
  discoveryActivity: ActivityStep;
  interactiveLab: ActivityStep;
  practiceChallenges: ActivityStep[];
  realWorldApplication: {
    scenarioAr: string;
    character: string;
    promptAr: string;
    activity: ActivityStep;
  };
  transferTest: {
    promptAr: string;
    representation: MathRepresentation;
    activity: ActivityStep;
  };
  whyExplanation: {
    questionAr: string;
    answerAr: string;
    interactiveDemoType: string;
  };
}

export interface LessonProgressRecord {
  lessonId: string;
  completedPhases: LessonPhase[];
  isCompleted: boolean;
  starsEarned: number;
  attemptsCount: number;
  hintsUsedCount: number;
  misconceptionsTriggered: string[];
  conceptualUnderstandingScore: number; // 0 to 100
  strategyMasteryScore: number; // 0 to 100
  independenceScore: number; // 0 to 100
  lastPlayedAt: string;
}
