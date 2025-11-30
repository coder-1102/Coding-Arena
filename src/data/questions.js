export const categories = [
  { id: 'Basics', name: 'Python Basics', total: 20 },
  { id: 'Lists', name: 'Lists & Arrays', total: 20 },
  { id: 'Strings', name: 'String Manipulation', total: 20 },
  { id: 'OOP', name: 'Object-Oriented Programming', total: 20 },
  { id: 'DSA', name: 'Data Structures & Algorithms', total: 20 }
];

export const questions = {
  Basics: [
    {
      id: 1,
      title: "Add Two Numbers",
      description: "Given two integers a and b, return their sum.",
      constraints: "-1000 <= a, b <= 1000",
      sampleInput: "5\n3",
      sampleOutput: "8",
      testcases: [
        { input: "5\n3", output: "8\n" },
        { input: "-10\n20", output: "10\n" },
        { input: "0\n0", output: "0\n" }
      ]
    },
    {
      id: 2,
      title: "Check Even or Odd",
      description: "Given a number n, print 'Even' if n is even, otherwise print 'Odd'.",
      constraints: "-1000 <= n <= 1000",
      sampleInput: "4",
      sampleOutput: "Even",
      testcases: [
        { input: "4", output: "Even\n" },
        { input: "7", output: "Odd\n" },
        { input: "0", output: "Even\n" },
        { input: "-5", output: "Odd\n" }
      ]
    },
    {
      id: 3,
      title: "Find Maximum of Two Numbers",
      description: "Given two numbers a and b, print the maximum of the two.",
      constraints: "-1000 <= a, b <= 1000",
      sampleInput: "10\n5",
      sampleOutput: "10",
      testcases: [
        { input: "10\n5", output: "10\n" },
        { input: "-5\n-10", output: "-5\n" },
        { input: "0\n0", output: "0\n" }
      ]
    },
    {
      id: 4,
      title: "Find Minimum of Three Numbers",
      description: "Given three numbers a, b, and c, print the minimum of the three.",
      constraints: "-1000 <= a, b, c <= 1000",
      sampleInput: "10\n5\n8",
      sampleOutput: "5",
      testcases: [
        { input: "10\n5\n8", output: "5\n" },
        { input: "-5\n-10\n-3", output: "-10\n" },
        { input: "1\n1\n1", output: "1\n" }
      ]
    },
    {
      id: 5,
      title: "Check Prime Number",
      description: "Given a number n, print 'Prime' if n is prime, otherwise print 'Not Prime'. A prime number is greater than 1 and has no divisors other than 1 and itself.",
      constraints: "1 <= n <= 1000",
      sampleInput: "7",
      sampleOutput: "Prime",
      testcases: [
        { input: "7", output: "Prime\n" },
        { input: "4", output: "Not Prime\n" },
        { input: "2", output: "Prime\n" },
        { input: "1", output: "Not Prime\n" },
        { input: "17", output: "Prime\n" }
      ]
    },
    {
      id: 6,
      title: "Factorial",
      description: "Given a number n, calculate and print its factorial. Factorial of n (n!) = n × (n-1) × ... × 1",
      constraints: "0 <= n <= 10",
      sampleInput: "5",
      sampleOutput: "120",
      testcases: [
        { input: "5", output: "120\n" },
        { input: "0", output: "1\n" },
        { input: "1", output: "1\n" },
        { input: "3", output: "6\n" }
      ]
    },
    {
      id: 7,
      title: "Fibonacci Sequence",
      description: "Given a number n, print the first n numbers of the Fibonacci sequence. Fibonacci: F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)",
      constraints: "1 <= n <= 20",
      sampleInput: "5",
      sampleOutput: "0 1 1 2 3",
      testcases: [
        { input: "5", output: "0 1 1 2 3\n" },
        { input: "1", output: "0\n" },
        { input: "7", output: "0 1 1 2 3 5 8\n" }
      ]
    },
    {
      id: 8,
      title: "Sum of Digits",
      description: "Given a number n, calculate and print the sum of its digits.",
      constraints: "0 <= n <= 10000",
      sampleInput: "1234",
      sampleOutput: "10",
      testcases: [
        { input: "1234", output: "10\n" },
        { input: "999", output: "27\n" },
        { input: "0", output: "0\n" },
        { input: "1000", output: "1\n" }
      ]
    },
    {
      id: 9,
      title: "Reverse a Number",
      description: "Given a number n, reverse its digits and print the result.",
      constraints: "-10000 <= n <= 10000",
      sampleInput: "1234",
      sampleOutput: "4321",
      testcases: [
        { input: "1234", output: "4321\n" },
        { input: "-567", output: "-765\n" },
        { input: "1000", output: "1\n" },
        { input: "0", output: "0\n" }
      ]
    },
    {
      id: 10,
      title: "Check Palindrome Number",
      description: "Given a number n, print 'Yes' if it's a palindrome, otherwise print 'No'. A palindrome reads the same forwards and backwards.",
      constraints: "0 <= n <= 10000",
      sampleInput: "121",
      sampleOutput: "Yes",
      testcases: [
        { input: "121", output: "Yes\n" },
        { input: "123", output: "No\n" },
        { input: "1", output: "Yes\n" },
        { input: "1221", output: "Yes\n" }
      ]
    },
    {
      id: 11,
      title: "Power of a Number",
      description: "Given two numbers base and exponent, calculate base^exponent and print the result.",
      constraints: "0 <= base, exponent <= 10",
      sampleInput: "2\n3",
      sampleOutput: "8",
      testcases: [
        { input: "2\n3", output: "8\n" },
        { input: "5\n0", output: "1\n" },
        { input: "3\n4", output: "81\n" }
      ]
    },
    {
      id: 12,
      title: "Check Leap Year",
      description: "Given a year, print 'Leap Year' if it's a leap year, otherwise print 'Not Leap Year'. A year is a leap year if it's divisible by 4, but not by 100 unless also divisible by 400.",
      constraints: "1 <= year <= 10000",
      sampleInput: "2024",
      sampleOutput: "Leap Year",
      testcases: [
        { input: "2024", output: "Leap Year\n" },
        { input: "2023", output: "Not Leap Year\n" },
        { input: "2000", output: "Leap Year\n" },
        { input: "1900", output: "Not Leap Year\n" }
      ]
    },
    {
      id: 13,
      title: "Find GCD",
      description: "Given two numbers a and b, find and print their Greatest Common Divisor (GCD).",
      constraints: "1 <= a, b <= 1000",
      sampleInput: "48\n18",
      sampleOutput: "6",
      testcases: [
        { input: "48\n18", output: "6\n" },
        { input: "17\n13", output: "1\n" },
        { input: "100\n25", output: "25\n" }
      ]
    },
    {
      id: 14,
      title: "Find LCM",
      description: "Given two numbers a and b, find and print their Least Common Multiple (LCM).",
      constraints: "1 <= a, b <= 1000",
      sampleInput: "12\n18",
      sampleOutput: "36",
      testcases: [
        { input: "12\n18", output: "36\n" },
        { input: "5\n7", output: "35\n" },
        { input: "10\n15", output: "30\n" }
      ]
    },
    {
      id: 15,
      title: "Print Multiplication Table",
      description: "Given a number n, print its multiplication table from 1 to 10.",
      constraints: "1 <= n <= 100",
      sampleInput: "5",
      sampleOutput: "5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50",
      testcases: [
        { input: "5", output: "5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50\n" },
        { input: "3", output: "3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30\n" }
      ]
    },
    {
      id: 16,
      title: "Count Digits",
      description: "Given a number n, count and print the number of digits in n.",
      constraints: "0 <= n <= 100000",
      sampleInput: "12345",
      sampleOutput: "5",
      testcases: [
        { input: "12345", output: "5\n" },
        { input: "0", output: "1\n" },
        { input: "999", output: "3\n" },
        { input: "100000", output: "6\n" }
      ]
    },
    {
      id: 17,
      title: "Sum of Natural Numbers",
      description: "Given a number n, calculate and print the sum of first n natural numbers (1 + 2 + ... + n).",
      constraints: "1 <= n <= 1000",
      sampleInput: "5",
      sampleOutput: "15",
      testcases: [
        { input: "5", output: "15\n" },
        { input: "10", output: "55\n" },
        { input: "1", output: "1\n" },
        { input: "100", output: "5050\n" }
      ]
    },
    {
      id: 18,
      title: "Check Perfect Number",
      description: "Given a number n, print 'Perfect' if n is a perfect number, otherwise print 'Not Perfect'. A perfect number equals the sum of its proper divisors.",
      constraints: "1 <= n <= 10000",
      sampleInput: "6",
      sampleOutput: "Perfect",
      testcases: [
        { input: "6", output: "Perfect\n" },
        { input: "28", output: "Perfect\n" },
        { input: "10", output: "Not Perfect\n" },
        { input: "1", output: "Not Perfect\n" }
      ]
    },
    {
      id: 19,
      title: "Print Pattern - Right Triangle",
      description: "Given a number n, print a right triangle pattern with n rows using asterisks (*).",
      constraints: "1 <= n <= 20",
      sampleInput: "5",
      sampleOutput: "*\n**\n***\n****\n*****",
      testcases: [
        { input: "5", output: "*\n**\n***\n****\n*****\n" },
        { input: "3", output: "*\n**\n***\n" },
        { input: "1", output: "*\n" }
      ]
    },
    {
      id: 20,
      title: "Print Pattern - Number Triangle",
      description: "Given a number n, print a number triangle pattern with n rows.",
      constraints: "1 <= n <= 20",
      sampleInput: "5",
      sampleOutput: "1\n12\n123\n1234\n12345",
      testcases: [
        { input: "5", output: "1\n12\n123\n1234\n12345\n" },
        { input: "3", output: "1\n12\n123\n" },
        { input: "1", output: "1\n" }
      ]
    }
  ],
  Lists: [
    {
      id: 21,
      title: "Sum of List Elements",
      description: "Given a list of integers, calculate and print the sum of all elements.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n1 2 3 4 5",
      sampleOutput: "15",
      testcases: [
        { input: "5\n1 2 3 4 5", output: "15\n" },
        { input: "3\n-1 0 1", output: "0\n" },
        { input: "1\n10", output: "10\n" }
      ]
    },
    {
      id: 22,
      title: "Find Maximum in List",
      description: "Given a list of integers, find and print the maximum element.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n3 7 2 9 1",
      sampleOutput: "9",
      testcases: [
        { input: "5\n3 7 2 9 1", output: "9\n" },
        { input: "3\n-5 -2 -10", output: "-2\n" },
        { input: "1\n42", output: "42\n" }
      ]
    },
    {
      id: 23,
      title: "Find Minimum in List",
      description: "Given a list of integers, find and print the minimum element.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n3 7 2 9 1",
      sampleOutput: "1",
      testcases: [
        { input: "5\n3 7 2 9 1", output: "1\n" },
        { input: "3\n-5 -2 -10", output: "-10\n" },
        { input: "1\n42", output: "42\n" }
      ]
    },
    {
      id: 24,
      title: "Remove Duplicates",
      description: "Given a list of integers, remove duplicates and print the list without duplicates (maintain order).",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "6\n1 2 2 3 3 4",
      sampleOutput: "1 2 3 4",
      testcases: [
        { input: "6\n1 2 2 3 3 4", output: "1 2 3 4\n" },
        { input: "5\n5 5 5 5 5", output: "5\n" },
        { input: "3\n1 2 3", output: "1 2 3\n" }
      ]
    },
    {
      id: 25,
      title: "Find Second Largest",
      description: "Given a list of integers, find and print the second largest element. If there's no second largest, print -1.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n3 7 2 9 1",
      sampleOutput: "7",
      testcases: [
        { input: "5\n3 7 2 9 1", output: "7\n" },
        { input: "3\n5 5 5", output: "-1\n" },
        { input: "2\n10 20", output: "10\n" }
      ]
    },
    {
      id: 26,
      title: "Reverse a List",
      description: "Given a list of integers, reverse it and print the reversed list.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n1 2 3 4 5",
      sampleOutput: "5 4 3 2 1",
      testcases: [
        { input: "5\n1 2 3 4 5", output: "5 4 3 2 1\n" },
        { input: "3\n10 20 30", output: "30 20 10\n" },
        { input: "1\n42", output: "42\n" }
      ]
    },
    {
      id: 27,
      title: "Count Even Numbers",
      description: "Given a list of integers, count and print the number of even numbers in the list.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n1 2 3 4 5",
      sampleOutput: "2",
      testcases: [
        { input: "5\n1 2 3 4 5", output: "2\n" },
        { input: "4\n2 4 6 8", output: "4\n" },
        { input: "3\n1 3 5", output: "0\n" }
      ]
    },
    {
      id: 28,
      title: "Count Odd Numbers",
      description: "Given a list of integers, count and print the number of odd numbers in the list.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n1 2 3 4 5",
      sampleOutput: "3",
      testcases: [
        { input: "5\n1 2 3 4 5", output: "3\n" },
        { input: "4\n2 4 6 8", output: "0\n" },
        { input: "3\n1 3 5", output: "3\n" }
      ]
    },
    {
      id: 29,
      title: "Merge Two Sorted Lists",
      description: "Given two sorted lists, merge them into one sorted list and print the result.",
      constraints: "1 <= list lengths <= 50, -1000 <= elements <= 1000",
      sampleInput: "3\n1 3 5\n4\n2 4 6 8",
      sampleOutput: "1 2 3 4 5 6 8",
      testcases: [
        { input: "3\n1 3 5\n4\n2 4 6 8", output: "1 2 3 4 5 6 8\n" },
        { input: "2\n1 2\n2\n3 4", output: "1 2 3 4\n" },
        { input: "1\n5\n1\n1", output: "1 5\n" }
      ]
    },
    {
      id: 30,
      title: "Find Average of List",
      description: "Given a list of integers, calculate and print the average (as a float).",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n1 2 3 4 5",
      sampleOutput: "3.0",
      testcases: [
        { input: "5\n1 2 3 4 5", output: "3.0\n" },
        { input: "3\n10 20 30", output: "20.0\n" },
        { input: "2\n5 5", output: "5.0\n" }
      ]
    },
    {
      id: 31,
      title: "Find Element Index",
      description: "Given a list of integers and a target value, find and print the index of the first occurrence. If not found, print -1.",
      constraints: "1 <= list length <= 100, -1000 <= elements, target <= 1000",
      sampleInput: "5\n1 2 3 4 5\n3",
      sampleOutput: "2",
      testcases: [
        { input: "5\n1 2 3 4 5\n3", output: "2\n" },
        { input: "4\n10 20 30 40\n25", output: "-1\n" },
        { input: "3\n5 5 5\n5", output: "0\n" }
      ]
    },
    {
      id: 32,
      title: "Count Occurrences",
      description: "Given a list of integers and a target value, count and print how many times the target appears in the list.",
      constraints: "1 <= list length <= 100, -1000 <= elements, target <= 1000",
      sampleInput: "6\n1 2 2 3 2 4\n2",
      sampleOutput: "3",
      testcases: [
        { input: "6\n1 2 2 3 2 4\n2", output: "3\n" },
        { input: "5\n1 2 3 4 5\n6", output: "0\n" },
        { input: "3\n5 5 5\n5", output: "3\n" }
      ]
    },
    {
      id: 33,
      title: "Find All Even Numbers",
      description: "Given a list of integers, find and print all even numbers in the list.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n1 2 3 4 5",
      sampleOutput: "2 4",
      testcases: [
        { input: "5\n1 2 3 4 5", output: "2 4\n" },
        { input: "4\n2 4 6 8", output: "2 4 6 8\n" },
        { input: "3\n1 3 5", output: "\n" }
      ]
    },
    {
      id: 34,
      title: "Find All Odd Numbers",
      description: "Given a list of integers, find and print all odd numbers in the list.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n1 2 3 4 5",
      sampleOutput: "1 3 5",
      testcases: [
        { input: "5\n1 2 3 4 5", output: "1 3 5\n" },
        { input: "4\n2 4 6 8", output: "\n" },
        { input: "3\n1 3 5", output: "1 3 5\n" }
      ]
    },
    {
      id: 35,
      title: "Sum of Positive Numbers",
      description: "Given a list of integers, calculate and print the sum of all positive numbers.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n-1 2 -3 4 5",
      sampleOutput: "11",
      testcases: [
        { input: "5\n-1 2 -3 4 5", output: "11\n" },
        { input: "3\n-1 -2 -3", output: "0\n" },
        { input: "3\n1 2 3", output: "6\n" }
      ]
    },
    {
      id: 36,
      title: "Sum of Negative Numbers",
      description: "Given a list of integers, calculate and print the sum of all negative numbers.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n-1 2 -3 4 -5",
      sampleOutput: "-9",
      testcases: [
        { input: "5\n-1 2 -3 4 -5", output: "-9\n" },
        { input: "3\n1 2 3", output: "0\n" },
        { input: "3\n-1 -2 -3", output: "-6\n" }
      ]
    },
    {
      id: 37,
      title: "Find Second Smallest",
      description: "Given a list of integers, find and print the second smallest element. If there's no second smallest, print -1.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n3 7 2 9 1",
      sampleOutput: "2",
      testcases: [
        { input: "5\n3 7 2 9 1", output: "2\n" },
        { input: "3\n5 5 5", output: "-1\n" },
        { input: "2\n10 20", output: "20\n" }
      ]
    },
    {
      id: 38,
      title: "Check if List is Sorted",
      description: "Given a list of integers, print 'Sorted' if the list is sorted in ascending order, otherwise print 'Not Sorted'.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n1 2 3 4 5",
      sampleOutput: "Sorted",
      testcases: [
        { input: "5\n1 2 3 4 5", output: "Sorted\n" },
        { input: "5\n5 4 3 2 1", output: "Not Sorted\n" },
        { input: "3\n1 1 1", output: "Sorted\n" }
      ]
    },
    {
      id: 39,
      title: "Find Product of List",
      description: "Given a list of integers, calculate and print the product of all elements.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n1 2 3 4 5",
      sampleOutput: "120",
      testcases: [
        { input: "5\n1 2 3 4 5", output: "120\n" },
        { input: "3\n-1 2 -3", output: "6\n" },
        { input: "1\n10", output: "10\n" }
      ]
    },
    {
      id: 40,
      title: "Remove All Occurrences",
      description: "Given a list of integers and a target value, remove all occurrences of the target and print the resulting list.",
      constraints: "1 <= list length <= 100, -1000 <= elements, target <= 1000",
      sampleInput: "6\n1 2 2 3 2 4\n2",
      sampleOutput: "1 3 4",
      testcases: [
        { input: "6\n1 2 2 3 2 4\n2", output: "1 3 4\n" },
        { input: "3\n5 5 5\n5", output: "\n" },
        { input: "3\n1 2 3\n4", output: "1 2 3\n" }
      ]
    }
  ],
  Strings: [
    {
      id: 41,
      title: "Reverse a String",
      description: "Given a string s, reverse it and print the result.",
      constraints: "1 <= length(s) <= 100",
      sampleInput: "hello",
      sampleOutput: "olleh",
      testcases: [
        { input: "hello", output: "olleh\n" },
        { input: "Python", output: "nohtyP\n" },
        { input: "a", output: "a\n" }
      ]
    },
    {
      id: 42,
      title: "Check Palindrome String",
      description: "Given a string s, print 'Yes' if it's a palindrome, otherwise print 'No'. Ignore case.",
      constraints: "1 <= length(s) <= 100",
      sampleInput: "racecar",
      sampleOutput: "Yes",
      testcases: [
        { input: "racecar", output: "Yes\n" },
        { input: "hello", output: "No\n" },
        { input: "A", output: "Yes\n" },
        { input: "Madam", output: "Yes\n" }
      ]
    },
    {
      id: 43,
      title: "Count Vowels",
      description: "Given a string s, count and print the number of vowels (a, e, i, o, u) in the string (case-insensitive).",
      constraints: "1 <= length(s) <= 100",
      sampleInput: "Hello World",
      sampleOutput: "3",
      testcases: [
        { input: "Hello World", output: "3\n" },
        { input: "Python", output: "1\n" },
        { input: "AEIOU", output: "5\n" },
        { input: "xyz", output: "0\n" }
      ]
    },
    {
      id: 44,
      title: "Count Consonants",
      description: "Given a string s, count and print the number of consonants (non-vowels) in the string (case-insensitive).",
      constraints: "1 <= length(s) <= 100",
      sampleInput: "Hello World",
      sampleOutput: "7",
      testcases: [
        { input: "Hello World", output: "7\n" },
        { input: "Python", output: "5\n" },
        { input: "AEIOU", output: "0\n" },
        { input: "xyz", output: "3\n" }
      ]
    },
    {
      id: 45,
      title: "Remove Spaces",
      description: "Given a string s, remove all spaces and print the result.",
      constraints: "1 <= length(s) <= 100",
      sampleInput: "hello world",
      sampleOutput: "helloworld",
      testcases: [
        { input: "hello world", output: "helloworld\n" },
        { input: "  python  ", output: "python\n" },
        { input: "a b c", output: "abc\n" }
      ]
    },
    {
      id: 46,
      title: "Count Words",
      description: "Given a string s, count and print the number of words. Words are separated by spaces.",
      constraints: "1 <= length(s) <= 100",
      sampleInput: "Hello World Python",
      sampleOutput: "3",
      testcases: [
        { input: "Hello World Python", output: "3\n" },
        { input: "One", output: "1\n" },
        { input: "  multiple   spaces  ", output: "2\n" }
      ]
    },
    {
      id: 47,
      title: "Capitalize First Letter",
      description: "Given a string s, capitalize the first letter of each word and print the result.",
      constraints: "1 <= length(s) <= 100",
      sampleInput: "hello world python",
      sampleOutput: "Hello World Python",
      testcases: [
        { input: "hello world python", output: "Hello World Python\n" },
        { input: "python", output: "Python\n" },
        { input: "a b c", output: "A B C\n" }
      ]
    },
    {
      id: 48,
      title: "Convert to Uppercase",
      description: "Given a string s, convert it to uppercase and print the result.",
      constraints: "1 <= length(s) <= 100",
      sampleInput: "hello world",
      sampleOutput: "HELLO WORLD",
      testcases: [
        { input: "hello world", output: "HELLO WORLD\n" },
        { input: "Python", output: "PYTHON\n" },
        { input: "ABC", output: "ABC\n" }
      ]
    },
    {
      id: 49,
      title: "Convert to Lowercase",
      description: "Given a string s, convert it to lowercase and print the result.",
      constraints: "1 <= length(s) <= 100",
      sampleInput: "HELLO WORLD",
      sampleOutput: "hello world",
      testcases: [
        { input: "HELLO WORLD", output: "hello world\n" },
        { input: "Python", output: "python\n" },
        { input: "abc", output: "abc\n" }
      ]
    },
    {
      id: 50,
      title: "Count Characters",
      description: "Given a string s, count and print the total number of characters (excluding spaces).",
      constraints: "1 <= length(s) <= 100",
      sampleInput: "hello world",
      sampleOutput: "10",
      testcases: [
        { input: "hello world", output: "10\n" },
        { input: "Python", output: "6\n" },
        { input: "a b c", output: "3\n" }
      ]
    },
    {
      id: 51,
      title: "Find Character Frequency",
      description: "Given a string s and a character c, count and print how many times c appears in s (case-sensitive).",
      constraints: "1 <= length(s) <= 100",
      sampleInput: "hello world\nl",
      sampleOutput: "3",
      testcases: [
        { input: "hello world\nl", output: "3\n" },
        { input: "Python\nP", output: "1\n" },
        { input: "abc\nz", output: "0\n" }
      ]
    },
    {
      id: 52,
      title: "Replace Character",
      description: "Given a string s, an old character, and a new character, replace all occurrences of old with new and print the result.",
      constraints: "1 <= length(s) <= 100",
      sampleInput: "hello world\no\na",
      sampleOutput: "hella warld",
      testcases: [
        { input: "hello world\no\na", output: "hella warld\n" },
        { input: "Python\nP\nJ", output: "Jython\n" },
        { input: "abc\na\nx", output: "xbc\n" }
      ]
    },
    {
      id: 53,
      title: "Check if String Contains Substring",
      description: "Given two strings s and substring, print 'Yes' if s contains substring, otherwise print 'No'.",
      constraints: "1 <= length(s), length(substring) <= 100",
      sampleInput: "hello world\nworld",
      sampleOutput: "Yes",
      testcases: [
        { input: "hello world\nworld", output: "Yes\n" },
        { input: "Python\nJava", output: "No\n" },
        { input: "abc\nabc", output: "Yes\n" }
      ]
    },
    {
      id: 54,
      title: "Extract Substring",
      description: "Given a string s, start index, and end index, extract and print the substring from start to end (exclusive).",
      constraints: "1 <= length(s) <= 100, 0 <= start < end <= length(s)",
      sampleInput: "hello world\n0\n5",
      sampleOutput: "hello",
      testcases: [
        { input: "hello world\n0\n5", output: "hello\n" },
        { input: "Python\n2\n4", output: "th\n" },
        { input: "abc\n0\n3", output: "abc\n" }
      ]
    },
    {
      id: 55,
      title: "Remove All Vowels",
      description: "Given a string s, remove all vowels (a, e, i, o, u) and print the result (case-insensitive).",
      constraints: "1 <= length(s) <= 100",
      sampleInput: "hello world",
      sampleOutput: "hll wrld",
      testcases: [
        { input: "hello world", output: "hll wrld\n" },
        { input: "Python", output: "Pythn\n" },
        { input: "AEIOU", output: "\n" }
      ]
    },
    {
      id: 56,
      title: "Check if Strings are Anagrams",
      description: "Given two strings s1 and s2, print 'Anagrams' if they are anagrams (same characters, different order), otherwise print 'Not Anagrams'. Ignore case and spaces.",
      constraints: "1 <= length(s1), length(s2) <= 100",
      sampleInput: "listen\nsilent",
      sampleOutput: "Anagrams",
      testcases: [
        { input: "listen\nsilent", output: "Anagrams\n" },
        { input: "hello\nworld", output: "Not Anagrams\n" },
        { input: "a\nA", output: "Anagrams\n" }
      ]
    },
    {
      id: 57,
      title: "Find Longest Word",
      description: "Given a string s with words separated by spaces, find and print the longest word. If multiple words have the same length, print the first one.",
      constraints: "1 <= length(s) <= 100",
      sampleInput: "hello world python",
      sampleOutput: "python",
      testcases: [
        { input: "hello world python", output: "python\n" },
        { input: "a bb ccc", output: "ccc\n" },
        { input: "one", output: "one\n" }
      ]
    },
    {
      id: 58,
      title: "Find Shortest Word",
      description: "Given a string s with words separated by spaces, find and print the shortest word. If multiple words have the same length, print the first one.",
      constraints: "1 <= length(s) <= 100",
      sampleInput: "hello world python",
      sampleOutput: "hello",
      testcases: [
        { input: "hello world python", output: "hello\n" },
        { input: "a bb ccc", output: "a\n" },
        { input: "one", output: "one\n" }
      ]
    },
    {
      id: 59,
      title: "Remove Punctuation",
      description: "Given a string s, remove all punctuation marks and print the result. Punctuation includes: !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
      constraints: "1 <= length(s) <= 100",
      sampleInput: "Hello, World!",
      sampleOutput: "Hello World",
      testcases: [
        { input: "Hello, World!", output: "Hello World\n" },
        { input: "Python...", output: "Python\n" },
        { input: "abc", output: "abc\n" }
      ]
    },
    {
      id: 60,
      title: "Count Uppercase Letters",
      description: "Given a string s, count and print the number of uppercase letters.",
      constraints: "1 <= length(s) <= 100",
      sampleInput: "Hello World",
      sampleOutput: "2",
      testcases: [
        { input: "Hello World", output: "2\n" },
        { input: "PYTHON", output: "6\n" },
        { input: "python", output: "0\n" }
      ]
    }
  ],
  OOP: [
    {
      id: 61,
      title: "Create a Class - Person",
      description: "Create a Person class with name and age attributes. Implement a method get_info() that returns a string in the format 'Name: {name}, Age: {age}'. Given name and age, create an instance and print the result of get_info().",
      constraints: "1 <= length(name) <= 50, 1 <= age <= 120",
      sampleInput: "John\n25",
      sampleOutput: "Name: John, Age: 25",
      testcases: [
        { input: "John\n25", output: "Name: John, Age: 25\n" },
        { input: "Alice\n30", output: "Name: Alice, Age: 30\n" }
      ]
    },
    {
      id: 62,
      title: "Class with Methods - Calculator",
      description: "Create a Calculator class with methods add(a, b), subtract(a, b), multiply(a, b), and divide(a, b). Given two numbers and an operation, perform the operation and print the result.",
      constraints: "-1000 <= a, b <= 1000, b != 0 for division",
      sampleInput: "10\n5\nadd",
      sampleOutput: "15",
      testcases: [
        { input: "10\n5\nadd", output: "15\n" },
        { input: "10\n5\nsubtract", output: "5\n" },
        { input: "10\n5\nmultiply", output: "50\n" },
        { input: "10\n5\ndivide", output: "2.0\n" }
      ]
    },
    {
      id: 63,
      title: "Inheritance - Animal",
      description: "Create a base class Animal with a method speak() that returns 'Animal speaks'. Create a Dog class that inherits from Animal and overrides speak() to return 'Woof!'. Create a Cat class that inherits from Animal and overrides speak() to return 'Meow!'. Given an animal type, create the appropriate instance and print the result of speak().",
      constraints: "animal_type is 'dog' or 'cat'",
      sampleInput: "dog",
      sampleOutput: "Woof!",
      testcases: [
        { input: "dog", output: "Woof!\n" },
        { input: "cat", output: "Meow!\n" }
      ]
    },
    {
      id: 64,
      title: "Class Attributes - Bank Account",
      description: "Create a BankAccount class with balance attribute. Implement methods deposit(amount) and withdraw(amount). Given a series of operations (deposit/withdraw with amounts), perform them and print the final balance.",
      constraints: "balance >= 0, 1 <= amount <= 10000",
      sampleInput: "1000\ndeposit 500\nwithdraw 200",
      sampleOutput: "1300",
      testcases: [
        { input: "1000\ndeposit 500\nwithdraw 200", output: "1300\n" },
        { input: "0\ndeposit 100\ndeposit 50", output: "150\n" }
      ]
    },
    {
      id: 65,
      title: "Magic Methods - Point",
      description: "Create a Point class with x and y coordinates. Implement __str__ method to return '({x}, {y})'. Given x and y, create a Point instance and print it.",
      constraints: "-1000 <= x, y <= 1000",
      sampleInput: "3\n4",
      sampleOutput: "(3, 4)",
      testcases: [
        { input: "3\n4", output: "(3, 4)\n" },
        { input: "0\n0", output: "(0, 0)\n" },
        { input: "-5\n10", output: "(-5, 10)\n" }
      ]
    },
    {
      id: 66,
      title: "Class with Constructor - Rectangle",
      description: "Create a Rectangle class with width and height attributes in the constructor. Implement methods area() and perimeter() that return the area and perimeter respectively. Given width and height, create an instance and print area and perimeter on separate lines.",
      constraints: "1 <= width, height <= 1000",
      sampleInput: "5\n3",
      sampleOutput: "15\n16",
      testcases: [
        { input: "5\n3", output: "15\n16\n" },
        { input: "10\n10", output: "100\n40\n" },
        { input: "1\n1", output: "1\n4\n" }
      ]
    },
    {
      id: 67,
      title: "Class Variables - Student",
      description: "Create a Student class with a class variable total_students = 0. Each time a Student is created, increment total_students. Implement a class method get_total() that returns total_students. Create n students and print the total.",
      constraints: "1 <= n <= 100",
      sampleInput: "3",
      sampleOutput: "3",
      testcases: [
        { input: "3", output: "3\n" },
        { input: "1", output: "1\n" },
        { input: "5", output: "5\n" }
      ]
    },
    {
      id: 68,
      title: "Private Attributes - Employee",
      description: "Create an Employee class with private attributes __name and __salary. Implement getter methods get_name() and get_salary(). Given name and salary, create an instance and print name and salary on separate lines.",
      constraints: "1 <= length(name) <= 50, 1000 <= salary <= 100000",
      sampleInput: "John\n50000",
      sampleOutput: "John\n50000",
      testcases: [
        { input: "John\n50000", output: "John\n50000\n" },
        { input: "Alice\n75000", output: "Alice\n75000\n" }
      ]
    },
    {
      id: 69,
      title: "Method Overriding - Shape",
      description: "Create a base class Shape with a method area() that returns 0. Create Circle and Rectangle classes that inherit from Shape and override area() to return their respective areas. Given shape type and dimensions, create the appropriate instance and print the area.",
      constraints: "shape_type is 'circle' or 'rectangle', 1 <= radius, width, height <= 100",
      sampleInput: "circle\n5",
      sampleOutput: "78.5",
      testcases: [
        { input: "circle\n5", output: "78.5\n" },
        { input: "rectangle\n4\n6", output: "24\n" }
      ]
    },
    {
      id: 70,
      title: "Static Methods - MathUtils",
      description: "Create a MathUtils class with static methods add(a, b), multiply(a, b), and power(base, exp). Given two numbers and an operation, call the appropriate static method and print the result.",
      constraints: "-1000 <= a, b, base <= 1000, 0 <= exp <= 10",
      sampleInput: "5\n3\nadd",
      sampleOutput: "8",
      testcases: [
        { input: "5\n3\nadd", output: "8\n" },
        { input: "4\n5\nmultiply", output: "20\n" },
        { input: "2\n3\npower", output: "8\n" }
      ]
    },
    {
      id: 71,
      title: "Property Decorator - Temperature",
      description: "Create a Temperature class with a celsius property. Implement a fahrenheit property that converts between celsius and fahrenheit. Given celsius value, create an instance and print fahrenheit.",
      constraints: "-273 <= celsius <= 1000",
      sampleInput: "25",
      sampleOutput: "77.0",
      testcases: [
        { input: "25", output: "77.0\n" },
        { input: "0", output: "32.0\n" },
        { input: "100", output: "212.0\n" }
      ]
    },
    {
      id: 72,
      title: "Multiple Inheritance - Student",
      description: "Create a Person class with name attribute and a method introduce() that returns 'I am {name}'. Create a Learner class with a method study() that returns 'I am studying'. Create a Student class that inherits from both Person and Learner. Given name, create a Student and print introduce() and study() results on separate lines.",
      constraints: "1 <= length(name) <= 50",
      sampleInput: "Alice",
      sampleOutput: "I am Alice\nI am studying",
      testcases: [
        { input: "Alice", output: "I am Alice\nI am studying\n" },
        { input: "Bob", output: "I am Bob\nI am studying\n" }
      ]
    },
    {
      id: 73,
      title: "Abstract Base Class - Animal",
      description: "Create an abstract base class Animal with an abstract method make_sound(). Create Dog and Cat classes that inherit from Animal and implement make_sound() to return 'Woof!' and 'Meow!' respectively. Given animal type, create the appropriate instance and print make_sound().",
      constraints: "animal_type is 'dog' or 'cat'",
      sampleInput: "dog",
      sampleOutput: "Woof!",
      testcases: [
        { input: "dog", output: "Woof!\n" },
        { input: "cat", output: "Meow!\n" }
      ]
    },
    {
      id: 74,
      title: "Class with __eq__ Method - Fraction",
      description: "Create a Fraction class with numerator and denominator. Implement __eq__ method to compare two fractions. Given two fractions, check if they are equal and print 'Equal' or 'Not Equal'.",
      constraints: "1 <= numerator, denominator <= 100",
      sampleInput: "1\n2\n2\n4",
      sampleOutput: "Equal",
      testcases: [
        { input: "1\n2\n2\n4", output: "Equal\n" },
        { input: "1\n3\n2\n3", output: "Not Equal\n" },
        { input: "2\n4\n1\n2", output: "Equal\n" }
      ]
    },
    {
      id: 75,
      title: "Class with __add__ Method - Vector",
      description: "Create a Vector class with x and y components. Implement __add__ method to add two vectors. Given two vectors, add them and print the result in format '(x, y)'.",
      constraints: "-1000 <= x, y <= 1000",
      sampleInput: "1\n2\n3\n4",
      sampleOutput: "(4, 6)",
      testcases: [
        { input: "1\n2\n3\n4", output: "(4, 6)\n" },
        { input: "0\n0\n5\n5", output: "(5, 5)\n" },
        { input: "-1\n-2\n1\n2", output: "(0, 0)\n" }
      ]
    },
    {
      id: 76,
      title: "Class with __len__ Method - ShoppingCart",
      description: "Create a ShoppingCart class that stores items in a list. Implement add_item(item) method and __len__ method that returns the number of items. Given n items, add them and print the length of the cart.",
      constraints: "1 <= n <= 100, 1 <= length(item) <= 50",
      sampleInput: "3\napple\nbanana\norange",
      sampleOutput: "3",
      testcases: [
        { input: "3\napple\nbanana\norange", output: "3\n" },
        { input: "1\nbook", output: "1\n" },
        { input: "5\na\nb\nc\nd\ne", output: "5\n" }
      ]
    },
    {
      id: 77,
      title: "Class with __iter__ Method - NumberRange",
      description: "Create a NumberRange class that takes start and end. Implement __iter__ method to make it iterable. Given start and end, iterate and print all numbers separated by spaces.",
      constraints: "0 <= start <= end <= 100",
      sampleInput: "1\n5",
      sampleOutput: "1 2 3 4 5",
      testcases: [
        { input: "1\n5", output: "1 2 3 4 5\n" },
        { input: "0\n2", output: "0 1 2\n" },
        { input: "10\n10", output: "10\n" }
      ]
    },
    {
      id: 78,
      title: "Class with __getitem__ Method - CustomList",
      description: "Create a CustomList class that stores elements. Implement __getitem__ to access elements by index and __setitem__ to set elements. Given a list of operations, perform them and print the final list.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "3\n1 2 3\n0",
      sampleOutput: "1",
      testcases: [
        { input: "3\n1 2 3\n0", output: "1\n" },
        { input: "5\n10 20 30 40 50\n2", output: "30\n" }
      ]
    },
    {
      id: 79,
      title: "Class with Context Manager - FileHandler",
      description: "Create a FileHandler class that implements __enter__ and __exit__ methods for context management. Given a filename and content, write content to file using 'with' statement and print 'File written successfully'.",
      constraints: "1 <= length(filename), length(content) <= 100",
      sampleInput: "test.txt\nHello World",
      sampleOutput: "File written successfully",
      testcases: [
        { input: "test.txt\nHello World", output: "File written successfully\n" },
        { input: "data.txt\nPython", output: "File written successfully\n" }
      ]
    },
    {
      id: 80,
      title: "Class with __call__ Method - Multiplier",
      description: "Create a Multiplier class that takes a factor in constructor. Implement __call__ method so the instance can be called like a function. Given factor and number, create instance and call it with number, then print result.",
      constraints: "-100 <= factor <= 100, -1000 <= number <= 1000",
      sampleInput: "5\n10",
      sampleOutput: "50",
      testcases: [
        { input: "5\n10", output: "50\n" },
        { input: "-2\n8", output: "-16\n" },
        { input: "0\n100", output: "0\n" }
      ]
    }
  ],
  DSA: [
    {
      id: 81,
      title: "Linear Search",
      description: "Given a list of integers and a target value, find the index of the target in the list. If not found, print -1.",
      constraints: "1 <= list length <= 100, -1000 <= elements, target <= 1000",
      sampleInput: "5\n1 3 5 7 9\n5",
      sampleOutput: "2",
      testcases: [
        { input: "5\n1 3 5 7 9\n5", output: "2\n" },
        { input: "4\n10 20 30 40\n25", output: "-1\n" },
        { input: "1\n5\n5", output: "0\n" }
      ]
    },
    {
      id: 82,
      title: "Binary Search",
      description: "Given a sorted list of integers and a target value, find the index of the target using binary search. If not found, print -1.",
      constraints: "1 <= list length <= 100, -1000 <= elements, target <= 1000, list is sorted",
      sampleInput: "5\n1 3 5 7 9\n5",
      sampleOutput: "2",
      testcases: [
        { input: "5\n1 3 5 7 9\n5", output: "2\n" },
        { input: "4\n10 20 30 40\n25", output: "-1\n" },
        { input: "3\n1 2 3\n2", output: "1\n" }
      ]
    },
    {
      id: 83,
      title: "Bubble Sort",
      description: "Given a list of integers, sort them using bubble sort and print the sorted list.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n5 2 8 1 9",
      sampleOutput: "1 2 5 8 9",
      testcases: [
        { input: "5\n5 2 8 1 9", output: "1 2 5 8 9\n" },
        { input: "3\n3 2 1", output: "1 2 3\n" },
        { input: "1\n5", output: "5\n" }
      ]
    },
    {
      id: 84,
      title: "Selection Sort",
      description: "Given a list of integers, sort them using selection sort and print the sorted list.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n5 2 8 1 9",
      sampleOutput: "1 2 5 8 9",
      testcases: [
        { input: "5\n5 2 8 1 9", output: "1 2 5 8 9\n" },
        { input: "3\n3 2 1", output: "1 2 3\n" },
        { input: "1\n5", output: "5\n" }
      ]
    },
    {
      id: 85,
      title: "Insertion Sort",
      description: "Given a list of integers, sort them using insertion sort and print the sorted list.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n5 2 8 1 9",
      sampleOutput: "1 2 5 8 9",
      testcases: [
        { input: "5\n5 2 8 1 9", output: "1 2 5 8 9\n" },
        { input: "3\n3 2 1", output: "1 2 3\n" },
        { input: "1\n5", output: "5\n" }
      ]
    },
    {
      id: 86,
      title: "Two Sum",
      description: "Given a list of integers and a target sum, find two numbers that add up to the target. Print their indices. If no solution exists, print '-1 -1'.",
      constraints: "2 <= list length <= 100, -1000 <= elements, target <= 1000",
      sampleInput: "4\n2 7 11 15\n9",
      sampleOutput: "0 1",
      testcases: [
        { input: "4\n2 7 11 15\n9", output: "0 1\n" },
        { input: "3\n3 2 4\n6", output: "1 2\n" },
        { input: "2\n3 3\n6", output: "0 1\n" }
      ]
    },
    {
      id: 87,
      title: "Find Missing Number",
      description: "Given a list of n-1 integers from 1 to n with one missing, find and print the missing number.",
      constraints: "2 <= n <= 100",
      sampleInput: "5\n1 2 4 5",
      sampleOutput: "3",
      testcases: [
        { input: "5\n1 2 4 5", output: "3\n" },
        { input: "4\n1 3 4", output: "2\n" },
        { input: "3\n1 2", output: "3\n" }
      ]
    },
    {
      id: 88,
      title: "Find Duplicate",
      description: "Given a list of n+1 integers where each integer is between 1 and n (inclusive), find and print the duplicate number.",
      constraints: "2 <= n <= 100",
      sampleInput: "5\n1 3 4 2 2",
      sampleOutput: "2",
      testcases: [
        { input: "5\n1 3 4 2 2", output: "2\n" },
        { input: "4\n3 1 3 4 2", output: "3\n" }
      ]
    },
    {
      id: 89,
      title: "Rotate Array",
      description: "Given a list of integers and a number k, rotate the list to the right by k positions and print the result.",
      constraints: "1 <= list length <= 100, 0 <= k <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n1 2 3 4 5\n2",
      sampleOutput: "4 5 1 2 3",
      testcases: [
        { input: "5\n1 2 3 4 5\n2", output: "4 5 1 2 3\n" },
        { input: "3\n1 2 3\n1", output: "3 1 2\n" },
        { input: "2\n1 2\n0", output: "1 2\n" }
      ]
    },
    {
      id: 90,
      title: "Maximum Subarray Sum",
      description: "Given a list of integers (can contain negatives), find the maximum sum of any contiguous subarray and print it.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "9\n-2 1 -3 4 -1 2 1 -5 4",
      sampleOutput: "6",
      testcases: [
        { input: "9\n-2 1 -3 4 -1 2 1 -5 4", output: "6\n" },
        { input: "3\n1 2 3", output: "6\n" },
        { input: "3\n-1 -2 -3", output: "-1\n" }
      ]
    },
    {
      id: 91,
      title: "Valid Parentheses",
      description: "Given a string containing only '(', ')', '{', '}', '[' and ']', determine if it's valid. Print 'Valid' if valid, otherwise print 'Invalid'. A string is valid if brackets are closed in the correct order.",
      constraints: "1 <= length(s) <= 100",
      sampleInput: "()",
      sampleOutput: "Valid",
      testcases: [
        { input: "()", output: "Valid\n" },
        { input: "()[]{}", output: "Valid\n" },
        { input: "(]", output: "Invalid\n" },
        { input: "([)]", output: "Invalid\n" }
      ]
    },
    {
      id: 92,
      title: "Longest Common Prefix",
      description: "Given a list of strings, find the longest common prefix among them. If no common prefix, print an empty string.",
      constraints: "1 <= list length <= 100, 1 <= length of each string <= 100",
      sampleInput: "3\nflower flow flight",
      sampleOutput: "fl",
      testcases: [
        { input: "3\nflower flow flight", output: "fl\n" },
        { input: "2\ndog racecar", output: "\n" },
        { input: "2\nprefix pre", output: "pre\n" }
      ]
    },
    {
      id: 93,
      title: "Find Peak Element",
      description: "Given a list of integers, find and print the index of a peak element. A peak element is greater than its neighbors. If multiple peaks exist, return any index.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n1 3 2 4 1",
      sampleOutput: "1",
      testcases: [
        { input: "5\n1 3 2 4 1", output: "1\n" },
        { input: "3\n1 2 3", output: "2\n" },
        { input: "3\n3 2 1", output: "0\n" }
      ]
    },
    {
      id: 94,
      title: "Move Zeros to End",
      description: "Given a list of integers, move all zeros to the end while maintaining the relative order of non-zero elements. Print the modified list.",
      constraints: "1 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "5\n0 1 0 3 12",
      sampleOutput: "1 3 12 0 0",
      testcases: [
        { input: "5\n0 1 0 3 12", output: "1 3 12 0 0\n" },
        { input: "3\n0 0 1", output: "1 0 0\n" },
        { input: "2\n1 2", output: "1 2\n" }
      ]
    },
    {
      id: 95,
      title: "Find First and Last Position",
      description: "Given a sorted list of integers and a target, find the first and last position (indices) of target. If not found, print '-1 -1'.",
      constraints: "1 <= list length <= 100, -1000 <= elements, target <= 1000",
      sampleInput: "6\n5 7 7 8 8 10\n8",
      sampleOutput: "3 4",
      testcases: [
        { input: "6\n5 7 7 8 8 10\n8", output: "3 4\n" },
        { input: "4\n1 2 3 4\n5", output: "-1 -1\n" },
        { input: "3\n1 1 1\n1", output: "0 2\n" }
      ]
    },
    {
      id: 96,
      title: "Merge Intervals",
      description: "Given a list of intervals [start, end], merge overlapping intervals and print the merged intervals. Each interval is given as two numbers on separate lines.",
      constraints: "1 <= number of intervals <= 50, 0 <= start <= end <= 1000",
      sampleInput: "4\n1 3\n2 6\n8 10\n15 18",
      sampleOutput: "1 6\n8 10\n15 18",
      testcases: [
        { input: "4\n1 3\n2 6\n8 10\n15 18", output: "1 6\n8 10\n15 18\n" },
        { input: "2\n1 4\n4 5", output: "1 5\n" }
      ]
    },
    {
      id: 97,
      title: "Find Kth Largest",
      description: "Given a list of integers and k, find and print the kth largest element.",
      constraints: "1 <= list length <= 100, 1 <= k <= list length, -1000 <= elements <= 1000",
      sampleInput: "6\n3 2 1 5 6 4\n2",
      sampleOutput: "5",
      testcases: [
        { input: "6\n3 2 1 5 6 4\n2", output: "5\n" },
        { input: "3\n3 2 3 1 2 4 5 5 6\n4", output: "4\n" }
      ]
    },
    {
      id: 98,
      title: "Product of Array Except Self",
      description: "Given a list of integers, create a new list where each element is the product of all other elements. Print the result list.",
      constraints: "2 <= list length <= 100, -10 <= elements <= 10",
      sampleInput: "4\n1 2 3 4",
      sampleOutput: "24 12 8 6",
      testcases: [
        { input: "4\n1 2 3 4", output: "24 12 8 6\n" },
        { input: "3\n-1 0 1", output: "0 -1 0\n" }
      ]
    },
    {
      id: 99,
      title: "Container With Most Water",
      description: "Given a list of integers representing heights, find two lines that together form a container that holds the most water. Print the maximum area.",
      constraints: "2 <= list length <= 100, 0 <= heights <= 1000",
      sampleInput: "9\n1 8 6 2 5 4 8 3 7",
      sampleOutput: "49",
      testcases: [
        { input: "9\n1 8 6 2 5 4 8 3 7", output: "49\n" },
        { input: "2\n1 1", output: "1\n" }
      ]
    },
    {
      id: 100,
      title: "Three Sum",
      description: "Given a list of integers, find all unique triplets that sum to zero. Print each triplet on a separate line in sorted order.",
      constraints: "3 <= list length <= 100, -1000 <= elements <= 1000",
      sampleInput: "6\n-1 0 1 2 -1 -4",
      sampleOutput: "-1 -1 2\n-1 0 1",
      testcases: [
        { input: "6\n-1 0 1 2 -1 -4", output: "-1 -1 2\n-1 0 1\n" },
        { input: "3\n0 0 0", output: "0 0 0\n" }
      ]
    }
  ]
};
