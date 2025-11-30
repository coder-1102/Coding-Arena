const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to run Python code with testcases
app.post('/api/run', async (req, res) => {
  const { code, testcases } = req.body;

  if (!code || !testcases || !Array.isArray(testcases)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const results = [];

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

  res.json({ results });
});

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
      timeout: 2000, // 2 second timeout
    });

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
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

