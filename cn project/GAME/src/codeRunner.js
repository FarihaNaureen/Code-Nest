// ============================================================
// CODE NEST — Code Runner
// Sandboxed execution engine for user code with Stack API
// Supports JavaScript, Python, Java, and C via transpilation
// ============================================================

// ── Stack Implementation ────────────────────────────────────
export class GameStack {
  constructor(name = 'stack') {
    this.name = name;
    this.items = [];
    this.operations = [];
  }

  push(item) {
    this.items.push(item);
    this.operations.push({
      type: 'push',
      item: item,
      snapshot: [...this.items],
      timestamp: Date.now(),
    });
    return item;
  }

  pop() {
    if (this.items.length === 0) {
      throw new Error(`Stack "${this.name}" is empty! Cannot pop.`);
    }
    const item = this.items.pop();
    this.operations.push({
      type: 'pop',
      item: item,
      snapshot: [...this.items],
      timestamp: Date.now(),
    });
    return item;
  }

  peek() {
    if (this.items.length === 0) return undefined;
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  getItems() {
    return [...this.items];
  }

  clear() {
    this.items = [];
    this.operations = [];
  }

  toString() {
    return `[${this.items.join(', ')}]`;
  }
}


// ── Python → JavaScript Transpiler ──────────────────────────
function transpilePython(code) {
  let js = code;
  const lines = js.split('\n');
  const output = [];
  const indentStack = [0]; // Track indentation levels

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trimStart();
    const currentIndent = line.length - trimmed.length;

    // Skip empty lines and comments
    if (trimmed === '' || trimmed.startsWith('#')) {
      if (trimmed.startsWith('#')) {
        output.push(line.replace(/^(\s*)#/, '$1//'));
      } else {
        output.push('');
      }
      continue;
    }

    // Close blocks when indentation decreases
    while (indentStack.length > 1 && currentIndent <= indentStack[indentStack.length - 1] - 1) {
      indentStack.pop();
      output.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
    }

    let converted = trimmed;

    // print() → console.log()
    converted = converted.replace(/^print\s*\((.*)\)$/g, 'console.log($1)');
    // Inline print too
    converted = converted.replace(/\bprint\s*\(/g, 'console.log(');

    // f-strings: f"...{expr}..." → `...${expr}...`
    converted = converted.replace(/f"([^"]*)"/g, (match, content) => {
      return '`' + content.replace(/\{/g, '${') + '`';
    });
    converted = converted.replace(/f'([^']*)'/g, (match, content) => {
      return '`' + content.replace(/\{/g, '${') + '`';
    });

    // len(x) → x.length
    converted = converted.replace(/\blen\((\w+)\)/g, '$1.length');

    // range(n) in for loops: for i in range(n):
    const rangeMatch = converted.match(/^for\s+(\w+)\s+in\s+range\((.+)\)\s*:$/);
    if (rangeMatch) {
      const [, varName, args] = rangeMatch;
      const parts = args.split(',').map(s => s.trim());
      if (parts.length === 1) {
        converted = `for (let ${varName} = 0; ${varName} < ${parts[0]}; ${varName}++) {`;
      } else if (parts.length === 2) {
        converted = `for (let ${varName} = ${parts[0]}; ${varName} < ${parts[1]}; ${varName}++) {`;
      } else if (parts.length === 3) {
        const step = parts[2];
        converted = `for (let ${varName} = ${parts[0]}; ${varName} < ${parts[1]}; ${varName} += ${step}) {`;
      }
      indentStack.push(currentIndent + 4);
      output.push(' '.repeat(currentIndent) + converted);
      continue;
    }

    // for x in array:
    const forInMatch = converted.match(/^for\s+(\w+)\s+in\s+(.+?)\s*:$/);
    if (forInMatch) {
      const [, varName, iterable] = forInMatch;
      converted = `for (const ${varName} of ${iterable}) {`;
      indentStack.push(currentIndent + 4);
      output.push(' '.repeat(currentIndent) + converted);
      continue;
    }

    // while condition:
    const whileMatch = converted.match(/^while\s+(.+?)\s*:$/);
    if (whileMatch) {
      let cond = whileMatch[1];
      cond = pythonConditionToJS(cond);
      converted = `while (${cond}) {`;
      indentStack.push(currentIndent + 4);
      output.push(' '.repeat(currentIndent) + converted);
      continue;
    }

    // if/elif/else
    const ifMatch = converted.match(/^if\s+(.+?)\s*:$/);
    if (ifMatch) {
      let cond = ifMatch[1];
      cond = pythonConditionToJS(cond);
      converted = `if (${cond}) {`;
      indentStack.push(currentIndent + 4);
      output.push(' '.repeat(currentIndent) + converted);
      continue;
    }
    const elifMatch = converted.match(/^elif\s+(.+?)\s*:$/);
    if (elifMatch) {
      let cond = elifMatch[1];
      cond = pythonConditionToJS(cond);
      // Close previous block
      output.push(' '.repeat(currentIndent) + `} else if (${cond}) {`);
      continue;
    }
    if (converted === 'else:') {
      output.push(' '.repeat(currentIndent) + '} else {');
      continue;
    }

    // def func(): → function func() {
    const defMatch = converted.match(/^def\s+(\w+)\s*\((.*?)\)\s*:$/);
    if (defMatch) {
      converted = `function ${defMatch[1]}(${defMatch[2]}) {`;
      indentStack.push(currentIndent + 4);
      output.push(' '.repeat(currentIndent) + converted);
      continue;
    }

    // Variable assignments: Python doesn't use let/const
    // x = value → let x = value (only if not already declared)
    const assignMatch = converted.match(/^(\w+)\s*=\s*(.+)$/);
    if (assignMatch && !converted.includes('==') && !converted.startsWith('stack.') && !converted.startsWith('stack2.') && !converted.startsWith('console.') && !converted.includes('.append(') && !converted.includes('.next')) {
      converted = `let ${assignMatch[1]} = ${assignMatch[2]}`;
    }

    // True/False/None → true/false/null
    converted = converted.replace(/\bTrue\b/g, 'true');
    converted = converted.replace(/\bFalse\b/g, 'false');
    converted = converted.replace(/\bNone\b/g, 'null');

    // .append(x) → .push(x) — for arrays
    converted = converted.replace(/\.append\(/g, '.push(');

    // not x → !x
    converted = converted.replace(/\bnot\s+/g, '!');

    // and / or
    converted = converted.replace(/\band\b/g, '&&');
    converted = converted.replace(/\bor\b/g, '||');

    // str(x) → String(x)
    converted = converted.replace(/\bstr\(/g, 'String(');
    // int(x) → parseInt(x)
    converted = converted.replace(/\bint\(/g, 'parseInt(');

    // Add semicolons if the line doesn't end with { or }
    if (!converted.endsWith('{') && !converted.endsWith('}') && !converted.startsWith('//') && converted.trim()) {
      converted = converted + ';';
    }

    output.push(' '.repeat(currentIndent) + converted);
  }

  // Close remaining open blocks
  while (indentStack.length > 1) {
    indentStack.pop();
    output.push('}');
  }

  return output.join('\n');
}

function pythonConditionToJS(cond) {
  cond = cond.replace(/\bTrue\b/g, 'true');
  cond = cond.replace(/\bFalse\b/g, 'false');
  cond = cond.replace(/\bNone\b/g, 'null');
  cond = cond.replace(/\bnot\s+/g, '!');
  cond = cond.replace(/\band\b/g, '&&');
  cond = cond.replace(/\bor\b/g, '||');
  cond = cond.replace(/\bis\s+null\b/g, '=== null');
  cond = cond.replace(/\bis\s+!null\b/g, '!== null');
  return cond;
}


// ── Java → JavaScript Transpiler ────────────────────────────
function transpileJava(code) {
  let js = code;

  // Remove common Java boilerplate
  js = js.replace(/import\s+[\w.*]+;\s*/g, '');
  
  // Track how many braces to remove from class/main wrappers
  let bracesToRemove = 0;
  if (/(?:public\s+)?class\s+\w+\s*\{/.test(js)) {
    js = js.replace(/(?:public\s+)?class\s+\w+\s*\{/, '');
    bracesToRemove++;
  }
  if (/public\s+static\s+void\s+main\s*\(.*?\)\s*\{/.test(js)) {
    js = js.replace(/public\s+static\s+void\s+main\s*\(.*?\)\s*\{/, '');
    bracesToRemove++;
  }

  // Method declarations: public/private/static void/int/String methodName(...) { → function methodName(...) {
  js = js.replace(/(?:public\s+|private\s+|protected\s+)?(?:static\s+)?(?:void|int|long|float|double|boolean|String|char)\s+(\w+)\s*\(([^)]*)\)\s*\{/g, (match, name, params) => {
    // Convert parameter types: "int a, String b" → "a, b"
    const jsParams = params.replace(/\b(?:int|long|float|double|boolean|char|String|byte|short)\s+/g, '').trim();
    return `function ${name}(${jsParams}) {`;
  });

  // Remove type declarations: int x = → let x =
  js = js.replace(/\b(int|long|float|double|boolean|char|byte|short)\s+(\w+)\s*=/g, 'let $2 =');
  js = js.replace(/\b(int|long|float|double|boolean|char|byte|short)\s+(\w+)\s*;/g, 'let $2;');
  // String type
  js = js.replace(/\bString\s+(\w+)\s*=/g, 'let $1 =');
  js = js.replace(/\bString\s+(\w+)\s*;/g, 'let $1;');
  // var
  js = js.replace(/\bvar\s+/g, 'let ');

  // int[] arr = new int[]{...} → let arr = [...]
  js = js.replace(/\b(?:int|long|float|double|String|char)\[\]\s+(\w+)\s*=\s*(?:new\s+\w+\[\]\s*)?\{([^}]*)\}/g, 'let $1 = [$2]');
  // int[] arr = new int[n] → let arr = new Array(n).fill(0)
  js = js.replace(/\b(?:int|long|float|double|String|char)\[\]\s+(\w+)\s*=\s*new\s+\w+\[([^\]]+)\]/g, 'let $1 = new Array($2).fill(0)');

  // System.out.println() → console.log()
  js = js.replace(/System\.out\.println\s*\(/g, 'console.log(');
  js = js.replace(/System\.out\.print\s*\(/g, 'console.log(');

  // .length() → .length for strings
  js = js.replace(/\.length\(\)/g, '.length');

  // .toCharArray() → spread into array: [...str]
  js = js.replace(/(\w+)\.toCharArray\(\)/g, '[...$1]');

  // String.valueOf(x) → String(x)
  js = js.replace(/String\.valueOf\s*\(/g, 'String(');

  // Integer.parseInt(x) → parseInt(x)
  js = js.replace(/Integer\.parseInt\s*\(/g, 'parseInt(');
  js = js.replace(/Integer\.valueOf\s*\(/g, 'parseInt(');

  // .equals() → === (handles stack.peek().equals("("))
  js = js.replace(/([a-zA-Z0-9_.[\]()'"\s]+)\.equals\(([^)]+)\)/g, '$1 === $2');

  // ArrayList → Array (simplified)
  js = js.replace(/Arrays\.sort\((\w+)\)/g, '$1.sort()');
  js = js.replace(/Arrays\.equals\((\w+),\s*(\w+)\)/g, '$1.join() === $2.join()');
  js = js.replace(/new\s+String\((\w+)\)/g, '$1.join("")');
  
  js = js.replace(/(?:List|ArrayList)<\w+>\s+(\w+)\s*=\s*new\s+ArrayList<>\(\)/g, 'let $1 = []');
  js = js.replace(/new\s+ArrayList<>\(\)/g, '[]');
  js = js.replace(/\.add\(/g, '.push(');
  js = js.replace(/\.get\((\w+)\)/g, '[$1]');
  js = js.replace(/\.size\(\)/g, '.length');
  js = js.replace(/\.remove\((\w+)\)/g, '.splice($1, 1)');

  // Stack<String> s = new Stack<>() → already have stack
  js = js.replace(/Stack<\w+>\s+(\w+)\s*=\s*new\s+Stack<.*?>\(\)/g, '// Using built-in stack object');

  // for(int i = 0; ...) → for(let i = 0; ...)
  js = js.replace(/for\s*\(\s*(int|long)\s+/g, 'for (let ');

  // enhanced for: for (String x : arr) → for (const x of arr)
  js = js.replace(/for\s*\(\s*(?:int|long|float|double|String|char|var|final)\s+(\w+)\s*:\s*([^)]+)\s*\)/g, 'for (const $1 of $2)');

  // do { } while() — already valid JS syntax! No conversion needed.

  // boolean → let
  js = js.replace(/\bboolean\s+(\w+)/g, 'let $1');

  // Remove trailing extra closing braces from class/main removal
  for (let i = 0; i < bracesToRemove; i++) {
    let lastClose = js.lastIndexOf('}');
    if (lastClose !== -1) {
      js = js.substring(0, lastClose) + js.substring(lastClose + 1);
    }
  }

  return js;
}


// ── C → JavaScript Transpiler ───────────────────────────────
function transpileC(code) {
  let js = code;

  // Remove includes
  js = js.replace(/#include\s*<[^>]+>\s*/g, '');
  js = js.replace(/#include\s*"[^"]+"\s*/g, '');
  js = js.replace(/#define\s+\w+\s+.*/g, '');

  // Remove main function wrapper
  js = js.replace(/int\s+main\s*\(.*?\)\s*\{/g, '');

  // return 0; at the end of main
  js = js.replace(/return\s+0\s*;/g, '');

  // printf() → console.log() with format string conversion
  js = js.replace(/printf\s*\(\s*"([^"]*)"(?:\s*,\s*(.*?))?\s*\)\s*;/g, (match, fmt, args) => {
    // Convert C format string to JS template literal
    let template = fmt;
    const argList = args ? args.split(',').map(s => s.trim()) : [];
    let argIdx = 0;

    template = template.replace(/%d|%i|%ld/g, () => {
      if (argIdx < argList.length) return '${' + argList[argIdx++] + '}';
      return '';
    });
    template = template.replace(/%f|%lf/g, () => {
      if (argIdx < argList.length) return '${' + argList[argIdx++] + '}';
      return '';
    });
    template = template.replace(/%s/g, () => {
      if (argIdx < argList.length) return '${' + argList[argIdx++] + '}';
      return '';
    });
    template = template.replace(/%c/g, () => {
      if (argIdx < argList.length) return '${' + argList[argIdx++] + '}';
      return '';
    });
    // Newline conversion
    template = template.replace(/\\n/g, '');

    return `console.log(\`${template}\`);`;
  });

  // Type declarations
  js = js.replace(/\b(int|long|float|double|char)\s+(\w+)\s*=/g, 'let $2 =');
  js = js.replace(/\b(int|long|float|double|char)\s+(\w+)\s*;/g, 'let $2;');

  // int arr[] = {...} or int arr[n] = {...}
  js = js.replace(/\b(?:int|long|float|double|char)\s+(\w+)\[\d*\]\s*=\s*\{([^}]*)\}/g, 'let $1 = [$2]');
  // int arr[n];
  js = js.replace(/\b(?:int|long|float|double|char)\s+(\w+)\[(\w+)\]\s*;/g, 'let $1 = new Array($2).fill(0)');

  // char *str = "..." → let str = "..."
  js = js.replace(/\bchar\s*\*\s*(\w+)\s*=/g, 'let $1 =');

  // sizeof(arr)/sizeof(arr[0]) → arr.length
  js = js.replace(/sizeof\((\w+)\)\s*\/\s*sizeof\(\w+\[0\]\)/g, '$1.length');

  // strlen(s) → s.length
  js = js.replace(/strlen\((\w+)\)/g, '$1.length');

  // for(int i → for(let i
  js = js.replace(/for\s*\(\s*(int|long)\s+/g, 'for (let ');

  // NULL → null
  js = js.replace(/\bNULL\b/g, 'null');

  // struct Node { ... } → simplified object
  js = js.replace(/struct\s+\w+\s*\{[^}]*\}\s*;?/g, '');

  // Remove trailing extra closing brace from main removal
  let lastClose = js.lastIndexOf('}');
  if (lastClose !== -1) {
    js = js.substring(0, lastClose) + js.substring(lastClose + 1);
  }

  return js;
}


// ── Code Execution Engine ───────────────────────────────────
export function executeCode(userCode, options = {}) {
  const language = options.language || 'javascript';
  const stack = new GameStack('stack');
  const stack2 = new GameStack('stack2');
  const logs = [];
  const errors = [];
  let startTime = performance.now();

  // Transpile if needed
  let jsCode = userCode;
  try {
    if (language === 'python') {
      jsCode = transpilePython(userCode);
    } else if (language === 'java') {
      jsCode = transpileJava(userCode);
    } else if (language === 'c') {
      jsCode = transpileC(userCode);
    }
  } catch (transpileError) {
    return {
      success: false,
      stack,
      stack2,
      operations: [],
      logs,
      errors: [`Transpilation Error (${language}): ${transpileError.message}`],
      executionTime: 0,
      error: `Transpilation Error: ${transpileError.message}`,
    };
  }

  // Custom console that captures output
  const customConsole = {
    log: (...args) => {
      const msg = args.map(a => {
        if (typeof a === 'object') {
          try {
            return JSON.stringify(a);
          } catch (e) {
            return String(a);
          }
        }
        return String(a);
      }).join(' ');
      logs.push(msg);
    },
    error: (...args) => {
      const msg = args.map(a => String(a)).join(' ');
      errors.push(msg);
      logs.push(`ERROR: ${msg}`);
    },
    warn: (...args) => {
      const msg = args.map(a => String(a)).join(' ');
      logs.push(`WARN: ${msg}`);
    },
    info: (...args) => {
      const msg = args.map(a => String(a)).join(' ');
      logs.push(`INFO: ${msg}`);
    },
  };

  try {
    // Create a sandboxed function with stack API available
    const fn = new Function(
      'stack',
      'stack2',
      'console',
      'setTimeout',    // Block
      'setInterval',   // Block
      'fetch',         // Block
      'XMLHttpRequest', // Block
      `
      "use strict";
      const push = (item) => stack.push(item);
      const pop = () => stack.pop();
      const peek = () => stack.peek();
      const isEmpty = () => stack.isEmpty();
      ${jsCode}
      `
    );

    // Execute with sandboxed globals
    fn(
      stack,
      stack2,
      customConsole,
      undefined,  // setTimeout blocked
      undefined,  // setInterval blocked
      undefined,  // fetch blocked
      undefined,  // XMLHttpRequest blocked
    );

    const endTime = performance.now();
    const executionTime = Math.round((endTime - startTime) * 100) / 100;

    return {
      success: true,
      stack,
      stack2,
      operations: [...stack.operations, ...stack2.operations].sort((a, b) => a.timestamp - b.timestamp),
      logs,
      errors,
      executionTime,
    };

  } catch (error) {
    const endTime = performance.now();
    const executionTime = Math.round((endTime - startTime) * 100) / 100;

    return {
      success: false,
      stack,
      stack2,
      operations: [...stack.operations, ...stack2.operations],
      logs,
      errors: [...errors, error.message],
      executionTime,
      error: error.message,
    };
  }
}


// ── Validation Runner ───────────────────────────────────────
export function validateSolution(problem, executionResult) {
  try {
    const result = problem.validate(
      executionResult.stack,
      executionResult.operations,
      {
        logs: executionResult.logs || [],
        stack2: executionResult.stack2,
        success: executionResult.success,
        error: executionResult.error
      }
    );
    return result;
  } catch (error) {
    if (!executionResult.success) {
      return {
        passed: false,
        message: `Runtime Error: ${executionResult.error}`,
        testsRun: 0,
        testsPassed: 0,
      };
    }
    return {
      passed: false,
      message: `Validation Error: ${error.message}`,
      testsRun: 0,
      testsPassed: 0,
    };
  }
}



// ── Calculate Rewards ─────────────────────────────────────────
export function calculateRewards(problem, executionResult, hintsUsed, errorCount, isReplay) {
  // 1. Calculate Base Values depending on difficulty
  const basePoints = { 'easy': 50, 'medium': 75, 'hard': 100 };
  const baseGold = basePoints[problem.difficulty] || 50;

  // 2. Gold Bonuses
  const noErrorBonus = errorCount === 0 ? Math.round(baseGold * 0.5) : 0;
  // Let's say < 50ms execution time is 'fast' for simple DSA
  const speedBonus = executionResult.executionTime < 50 ? Math.round(baseGold * 0.5) : 0;

  let totalGold = baseGold + noErrorBonus + speedBonus;

  // 3. Mana Bonuses (Logic / Efficiency)
  let stackUsageMana = 0;
  if (executionResult.operations && executionResult.operations.length > 0) {
     stackUsageMana = 20;
  }
  const loopBonusMana = (executionResult.operations && executionResult.operations.length > 3) ? 10 : 0; // rough heuristic
  const noHintBonusMana = hintsUsed === 0 ? 10 : 0;
  
  let totalMana = stackUsageMana + loopBonusMana + noHintBonusMana;

  // 4. Calculate Stars
  let stars = 1;
  if (hintsUsed === 0 && errorCount <= 1) stars = 3;
  else if (hintsUsed <= 1 && errorCount <= 3) stars = 2;

  // 5. Gems (High Quality Performance)
  const threeStarGem = stars === 3 ? 1 : 0;
  const perfectRunGem = (stars === 3 && errorCount === 0) ? 1 : 0;
  let totalGems = threeStarGem + perfectRunGem;

  // 6. Build Breakdown
  const breakdown = [];
  
  // Gold breakdown
  breakdown.push({ label: 'Level completed', amount: baseGold, type: 'gold' });
  if (noErrorBonus > 0) breakdown.push({ label: 'No errors', amount: noErrorBonus, type: 'gold' });
  if (speedBonus > 0) breakdown.push({ label: 'Fast completion', amount: speedBonus, type: 'gold' });
  
  // Mana breakdown
  if (stackUsageMana > 0) breakdown.push({ label: 'Correct data structure usage', amount: stackUsageMana, type: 'mana' });
  if (loopBonusMana > 0) breakdown.push({ label: 'Efficient logic/loops', amount: loopBonusMana, type: 'mana' });
  if (noHintBonusMana > 0) breakdown.push({ label: 'No hints used', amount: noHintBonusMana, type: 'mana' });

  // Gems breakdown
  if (threeStarGem > 0) breakdown.push({ label: '3-star performance', amount: threeStarGem, type: 'gem' });
  if (perfectRunGem > 0) breakdown.push({ label: 'Perfect run', amount: perfectRunGem, type: 'gem' });

  // 7. Apply Replay Penalty if already completed
  if (isReplay) {
    totalGold = Math.round(totalGold * 0.25); // 25% gold
    totalMana = 0;
    totalGems = 0;
    // Clear breakdown and just show replay bonus
    breakdown.length = 0;
    breakdown.push({ label: 'Replay bonus', amount: totalGold, type: 'gold' });
  }

  return {
    gold: totalGold,
    mana: totalMana,
    gems: totalGems,
    stars,
    breakdown
  };
}
