const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - allow all origins for production
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Endpoint to run Python code with testcases
app.post('/api/run', async (req, res) => {
  const { code, testcases, language } = req.body;

  if (!code || !testcases || !Array.isArray(testcases)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const results = [];

  // Check if it's SQL
  if (language === 'sql' || (code.trim().toUpperCase().startsWith('SELECT') || code.trim().toUpperCase().startsWith('WITH'))) {
    for (const testcase of testcases) {
      try {
        const result = await runSQLCode(code, testcase.input, testcase.output);
        results.push(result);
      } catch (error) {
        results.push({
          passed: false,
          expected: testcase.output.trim(),
          got: `Error: ${error.message}`,
        });
      }
    }
  } else {
    // Python code
    for (const testcase of testcases) {
      try {
        const result = await runPythonCode(code, testcase.input, testcase.output);
        results.push(result);
      } catch (error) {
        results.push({
          passed: false,
          expected: testcase.output.trim(),
          got: `Error: ${error.message}`,
        });
      }
    }
  }

  res.json({ results });
});

function runSQLCode(code, schema, expectedOutput) {
  return new Promise((resolve, reject) => {
    const schemaFile = path.join(__dirname, 'temp_schema.sql');
    const queryFile = path.join(__dirname, 'temp_query.sql');

    // Write schema and query to temp files
    fs.writeFileSync(schemaFile, schema);
    fs.writeFileSync(queryFile, code);

    // Detect Python command (python3 on Unix, python on Windows)
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

    // Run SQL code with timeout
    const sqlProcess = spawn(pythonCmd, ['sql_runner.py', schemaFile, queryFile], {
      cwd: __dirname,
    });

    let output = '';
    let errorOutput = '';
    let timeoutId;

    // Set timeout to kill process after 5 seconds
    timeoutId = setTimeout(() => {
      try {
        // Kill the process and all its children
        if (process.platform === 'win32') {
          try {
            spawn('taskkill', ['/pid', sqlProcess.pid, '/f', '/t'], { detached: true });
          } catch (err) {
            sqlProcess.kill();
          }
        } else {
          sqlProcess.kill('SIGKILL');
        }
      } catch (err) {
        // Try to kill anyway
        try {
          sqlProcess.kill();
        } catch (killErr) {
          // Ignore
        }
      }

      // Cleanup temp files
      try {
        if (fs.existsSync(schemaFile)) fs.unlinkSync(schemaFile);
        if (fs.existsSync(queryFile)) fs.unlinkSync(queryFile);
      } catch (err) {
        // Ignore cleanup errors
      }

      resolve({
        passed: false,
        expected: expectedOutput.trim(),
        got: 'Execution timeout: Query took too long to execute (>5 seconds).',
      });
    }, 5000); // 5 second timeout

    sqlProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    sqlProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    sqlProcess.on('close', (code) => {
      clearTimeout(timeoutId);

      // Cleanup temp files
      try {
        if (fs.existsSync(schemaFile)) fs.unlinkSync(schemaFile);
        if (fs.existsSync(queryFile)) fs.unlinkSync(queryFile);
      } catch (err) {
        // Ignore cleanup errors
      }

      if (code !== 0 || errorOutput) {
        return resolve({
          passed: false,
          expected: expectedOutput.trim(),
          got: errorOutput || 'SQL execution error',
        });
      }

      const got = output.trim();
      const expected = expectedOutput.trim();
      const passed = got === expected;

      resolve({
        passed,
        expected,
        got,
      });
    });

    sqlProcess.on('error', (error) => {
      clearTimeout(timeoutId);

      // Cleanup temp files
      try {
        if (fs.existsSync(schemaFile)) fs.unlinkSync(schemaFile);
        if (fs.existsSync(queryFile)) fs.unlinkSync(queryFile);
      } catch (err) {
        // Ignore cleanup errors
      }

      reject(error);
    });
  });
}

function runPythonCode(code, input, expectedOutput) {
  return new Promise((resolve, reject) => {
    const tempFile = path.join(__dirname, 'temp_code.py');
    const inputFile = path.join(__dirname, 'temp_input.txt');

    // Write code to temp file
    fs.writeFileSync(tempFile, code);
    fs.writeFileSync(inputFile, input);

    // Detect Python command (python3 on Unix, python on Windows)
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

    // Run Python code with timeout
    const pythonProcess = spawn(pythonCmd, ['runner.py', tempFile, inputFile], {
      cwd: __dirname,
    });

    let output = '';
    let errorOutput = '';
    let timeoutId;

    // Set timeout to kill process after 5 seconds
    timeoutId = setTimeout(() => {
      try {
        // Kill the process and all its children
        if (process.platform === 'win32') {
          try {
            spawn('taskkill', ['/pid', pythonProcess.pid, '/f', '/t'], { detached: true });
          } catch (err) {
            pythonProcess.kill();
          }
        } else {
          pythonProcess.kill('SIGKILL');
        }
      } catch (err) {
        // Try to kill anyway
        try {
          pythonProcess.kill();
        } catch (killErr) {
          // Ignore
        }
      }

      // Cleanup temp files
      try {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
      } catch (err) {
        // Ignore cleanup errors
      }

      resolve({
        passed: false,
        expected: expectedOutput.trim(),
        got: 'Execution timeout: Code took too long to execute (>5 seconds). Possible infinite loop.',
      });
    }, 5000); // 5 second timeout

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      clearTimeout(timeoutId);

      // Cleanup temp files
      try {
        fs.unlinkSync(tempFile);
        fs.unlinkSync(inputFile);
      } catch (err) {
        // Ignore cleanup errors
      }

      if (code !== 0 || errorOutput) {
        return resolve({
          passed: false,
          expected: expectedOutput.trim(),
          got: errorOutput || 'Execution error',
        });
      }

      const got = output.trim();
      const expected = expectedOutput.trim();
      const passed = got === expected;

      resolve({
        passed,
        expected,
        got,
      });
    });

    pythonProcess.on('error', (error) => {
      clearTimeout(timeoutId);

      // Cleanup temp files
      try {
        fs.unlinkSync(tempFile);
        fs.unlinkSync(inputFile);
      } catch (err) {
        // Ignore cleanup errors
      }

      reject(error);
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

