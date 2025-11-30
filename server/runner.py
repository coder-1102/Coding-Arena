#!/usr/bin/env python3
import sys
import os

def run_code(code_file, input_file):
    """Execute Python code with input from file"""
    try:
        # Read the code
        with open(code_file, 'r') as f:
            code = f.read()
        
        # Read the input
        with open(input_file, 'r') as f:
            input_data = f.read()
        
        # Redirect stdin
        sys.stdin = open(input_file, 'r')
        
        # Execute the code
        exec(code, {'__name__': '__main__'})
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)
    finally:
        if sys.stdin != sys.__stdin__:
            sys.stdin.close()

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python3 runner.py <code_file> <input_file>", file=sys.stderr)
        sys.exit(1)
    
    code_file = sys.argv[1]
    input_file = sys.argv[2]
    
    if not os.path.exists(code_file) or not os.path.exists(input_file):
        print("Error: Files not found", file=sys.stderr)
        sys.exit(1)
    
    run_code(code_file, input_file)

