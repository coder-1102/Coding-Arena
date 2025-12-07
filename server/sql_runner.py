#!/usr/bin/env python3
import sys
import sqlite3
import os
import re

def run_sql_code(schema_file, query_file):
    """Execute SQL schema setup and user query, return results"""
    try:
        # Read the schema (input)
        with open(schema_file, 'r') as f:
            schema = f.read()
        
        # Read the user query
        with open(query_file, 'r') as f:
            query = f.read().strip()
        
        # Create in-memory database
        conn = sqlite3.connect(':memory:')
        cursor = conn.cursor()
        
        # Execute schema setup (CREATE TABLE, INSERT statements)
        schema_statements = [s.strip() for s in schema.split(';') if s.strip()]
        for statement in schema_statements:
            if statement:
                try:
                    cursor.execute(statement)
                except sqlite3.Error as e:
                    print(f"Schema Error: {str(e)}", file=sys.stderr)
                    sys.exit(1)
        
        conn.commit()
        
        # Execute user query
        try:
            cursor.execute(query)
            
            # Check if query returns results
            if cursor.description:
                # SELECT query - fetch results
                results = cursor.fetchall()
                
                # Format results as pipe-separated values
                output_lines = []
                for row in results:
                    # Convert None to empty string, format values
                    formatted_row = []
                    for val in row:
                        if val is None:
                            formatted_row.append('')
                        else:
                            formatted_row.append(str(val))
                    output_lines.append('|'.join(formatted_row))
                
                print('\n'.join(output_lines))
            else:
                # DDL/DML query - just commit
                conn.commit()
                # For non-SELECT queries, print empty or success message
                # But for test cases, we might need to verify changes
                # For now, print empty string for non-SELECT
                pass
                
        except sqlite3.Error as e:
            print(f"Query Error: {str(e)}", file=sys.stderr)
            sys.exit(1)
        
        conn.close()
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python3 sql_runner.py <schema_file> <query_file>", file=sys.stderr)
        sys.exit(1)
    
    schema_file = sys.argv[1]
    query_file = sys.argv[2]
    
    if not os.path.exists(schema_file) or not os.path.exists(query_file):
        print("Error: Files not found", file=sys.stderr)
        sys.exit(1)
    
    run_sql_code(schema_file, query_file)

