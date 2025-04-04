// Refactoring Schema
export const refactoringSchema = {
    description: "Refactor and optimize the provided code. Ensure the refactored code improves complexity, efficiency, and maintainability while being properly formatted. Return the programming language and the reasoning behind the changes.",
    type: "object",
    properties: {
      original_code: {
        description: "The original version of the provided code.",
        type: "string",
      },
      refactored_code: {
        description: "The refactored version of the provided code, with improvements in complexity, efficiency, and formatting.",
        type: "string",
      },
      language: {
        description: "The programming language of the provided code.",
        type: "string",
      },
      reason: {
        description: "Explanation of the improvements, including how complexity and efficiency were enhanced.",
        type: "string",
      },
    },
    required: ["original_code", "refactored_code", "language", "reason"],
  };
  
  // Metrics Schema
  export const metricsSchema = {
    description: "Provide code metrics for analysis, including line count, cyclomatic complexity, maintainability index, and code smells.",
    type: "object",
    properties: {
      original_code: {
        description: "The original version of the provided code.",
        type: "string",
      },
      line_count: {
        description: "The total number of lines in the code.",
        type: "integer",
      },
      cyclomatic_complexity: {
        description: "The cyclomatic complexity of the code.",
        type: "integer",
      },
      maintainability_index: {
        description: "The maintainability index of the code.",
        type: "number",
      },
      code_smells: {
        description: "The number and types of code smells found in the code.",
        type: "array",
        items: {
          type: "string",
        },
      },
      duplicate_lines: {
        description: "The number of duplicate lines in the code.",
        type: "integer",
      },
      unused_variables: {
        description: "The number of unused variables in the code.",
        type: "integer",
      },
    },
    required: ["original_code", "line_count", "cyclomatic_complexity", "maintainability_index", "code_smells", "duplicate_lines", "unused_variables"],
  };
  