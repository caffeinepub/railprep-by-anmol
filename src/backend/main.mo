import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Options = {
    A : Text;
    B : Text;
    C : Text;
    D : Text;
  };

  type Question = {
    question_id : Text;
    exam : Text;
    section : Text;
    topic : Text;
    difficulty : Text;
    question : Text;
    options : Options;
    correct_answer : Text;
    explanation : Text;
  };

  type Result = {
    userId : Text;
    correct : Nat;
    wrong : Nat;
    skipped : Nat;
    timeTaken : Nat;
    examType : Text;
    mode : Text;
    finalScore : Int;
  };

  type TopicStats = {
    topic : Text;
    section : Text;
    wrongCount : Nat;
  };

  let questions = List.empty<Question>();
  var randomSeed = 0;

  let examTypes : [Text] = ["RRB Group D", "RRB NTPC", "RRB ALP"];
  let sections : [Text] = ["Mathematics", "Mental Ability", "General Science", "General Awareness"];

  func getMathematicsTopics() : [Text] {
    ["Percentage", "Profit & Loss", "Time & Work", "Simple Interest", "Ratio & Proportion", "Mensuration", "Number System", "LCM & HCF", "Average"];
  };

  func getMentalAbilityTopics() : [Text] {
    ["Number Series", "Coding-Decoding", "Blood Relations", "Analogies", "Syllogism", "Venn Diagram"];
  };

  func getScienceTopics() : [Text] {
    ["Physics", "Chemistry", "Biology", "Human Body"];
  };

  func getAwarenessTopics() : [Text] {
    ["History", "Geography", "Polity", "Indian Economy", "Sports", "Science & Technology", "Current Affairs"];
  };

  func matchesCriteria(question : Question, exam : Text, section : Text, topic : Text, difficulty : Text) : Bool {
    let examMatch = exam == "" or question.exam == exam;
    let sectionMatch = section == "" or question.section == section;
    let topicMatch = topic == "" or question.topic == topic;
    let difficultyMatch = difficulty == "" or question.difficulty == difficulty;

    examMatch and sectionMatch and topicMatch and difficultyMatch;
  };

  func randomizeQuestions(filteredQuestions : List.List<Question>) : List.List<Question> {
    let array = filteredQuestions.toArray();
    if (array.size() == 0) {
      List.empty<Question>();
    } else {
      let shuffledArray = array.map(
        func(q) {
          let randomIndex = randomSeed % array.size();
          randomSeed += 1;
          array[randomIndex];
        }
      );
      List.fromArray(shuffledArray);
    };
  };

  public query ({ caller }) func getQuestions(exam : Text, section : Text, topic : Text, count : Nat, difficulty : Text) : async [Question] {
    let filteredQuestions = questions.filter(
      func(q) { matchesCriteria(q, exam, section, topic, difficulty) }
    );

    let randomizedQuestions = randomizeQuestions(filteredQuestions);

    let takeCount = if (count > randomizedQuestions.size()) {
      randomizedQuestions.size();
    } else {
      count;
    };

    let result = List.empty<Question>();
    var i = 0;
    for (q in randomizedQuestions.values()) {
      if (i < takeCount) {
        result.add(q);
        i += 1;
      };
    };

    result.toArray();
  };

  public query ({ caller }) func getExamTypes() : async [Text] {
    examTypes;
  };

  public query ({ caller }) func getSections() : async [Text] {
    sections;
  };

  public query ({ caller }) func getTopicsBySection(section : Text) : async [Text] {
    switch (section) {
      case ("Mathematics") { getMathematicsTopics() };
      case ("Mental Ability") { getMentalAbilityTopics() };
      case ("General Science") { getScienceTopics() };
      case ("General Awareness") { getAwarenessTopics() };
      case (_) { [] };
    };
  };

  public query ({ caller }) func getQuestionCount() : async Nat {
    questions.size();
  };

  public query ({ caller }) func getAllQuestions() : async [Question] {
    questions.toArray();
  };

  public query ({ caller }) func getQuestionsBySection(section : Text) : async [Question] {
    questions.filter(func(q) { q.section == section }).toArray();
  };

  public query ({ caller }) func getQuestionsByTopic(topic : Text) : async [Question] {
    questions.filter(func(q) { q.topic == topic }).toArray();
  };

  public query ({ caller }) func getQuestionsByDifficulty(difficulty : Text) : async [Question] {
    questions.filter(func(q) { q.difficulty == difficulty }).toArray();
  };

  public query ({ caller }) func getQuestionsByExam(exam : Text) : async [Question] {
    questions.filter(func(q) { q.exam == exam }).toArray();
  };
};
