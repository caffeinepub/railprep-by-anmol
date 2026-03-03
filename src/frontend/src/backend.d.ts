import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Options {
    A: string;
    B: string;
    C: string;
    D: string;
}
export interface Question {
    topic: string;
    question: string;
    exam: string;
    difficulty: string;
    explanation: string;
    section: string;
    correct_answer: string;
    question_id: string;
    options: Options;
}
export interface backendInterface {
    getAllQuestions(): Promise<Array<Question>>;
    getExamTypes(): Promise<Array<string>>;
    getQuestionCount(): Promise<bigint>;
    getQuestions(exam: string, section: string, topic: string, count: bigint, difficulty: string): Promise<Array<Question>>;
    getQuestionsByDifficulty(difficulty: string): Promise<Array<Question>>;
    getQuestionsByExam(exam: string): Promise<Array<Question>>;
    getQuestionsBySection(section: string): Promise<Array<Question>>;
    getQuestionsByTopic(topic: string): Promise<Array<Question>>;
    getSections(): Promise<Array<string>>;
    getTopicsBySection(section: string): Promise<Array<string>>;
}
