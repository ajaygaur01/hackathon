export const problem: Problem[] = [
    {
      id: "1",
      name: "Two Sum",
      difficulty: "Easy",
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
        },
        {
          input: "nums = [3,2,4], target = 6",
          output: "[1,2]",
        },
      ],
      constraints: [
        "2 <= nums.length <= 104",
        "-109 <= nums[i] <= 109",
        "-109 <= target <= 109",
        "Only one valid answer exists.",
      ],
      starterCode: {
        javascript: `/**
     * @param {number[]} nums
     * @param {number} target
     * @return {number[]}
     */
    function twoSum(nums, target) {
        // Write your code here
    };`,
        python: `class Solution:
        def twoSum(self, nums: List[int], target: int) -> List[int]:
            # Write your code here
            pass`,
        java: `class Solution {
        public int[] twoSum(int[] nums, int target) {
            // Write your code here
        }
    }`,
      },
      testCases: [
        {
          input: "[2,7,11,15]\n9",
          output: "[0,1]",
        },
        {
          input: "[3,2,4]\n6",
          output: "[1,2]",
        },
        {
          input: "[3,3]\n6",
          output: "[0,1]",
        },
      ],
    },
    {
      id: "2",
      name: "Valid Parentheses",
      difficulty: "Easy",
      description:
        "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.",
      examples: [
        {
          input: 's = "()"',
          output: "true",
        },
        {
          input: 's = "()[]{}"',
          output: "true",
        },
        {
          input: 's = "(]"',
          output: "false",
        },
      ],
      constraints: [
        "1 <= s.length <= 104",
        "s consists of parentheses only '()[]{}'",
      ],
      starterCode: {
        javascript: `/**
     * @param {string} s
     * @return {boolean}
     */
    function isValid(s) {
        // Write your code here
    };`,
        python: `class Solution:
        def isValid(self, s: str) -> bool:
            # Write your code here
            pass`,
      },
      testCases: [
        {
          input: '"()"',
          output: "true",
        },
        {
          input: '"()[]{}"',
          output: "true",
        },
        {
          input: '"(]"',
          output: "false",
        },
      ],
    },
    {
      id: "3",
      name: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      description:
        "Given a string s, find the length of the longest substring without repeating characters.",
      examples: [
        {
          input: 's = "abcabcbb"',
          output: "3",
          explanation: 'The answer is "abc", with the length of 3.',
        },
        {
          input: 's = "bbbbb"',
          output: "1",
          explanation: 'The answer is "b", with the length of 1.',
        },
        {
          input: 's = "pwwkew"',
          output: "3",
          explanation:
            'The answer is "wke", with the length of 3. Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.',
        },
      ],
      constraints: [
        "0 <= s.length <= 5 * 104",
        "s consists of English letters, digits, symbols and spaces.",
      ],
      starterCode: {
        javascript: `/**
     * @param {string} s
     * @return {number}
     */
    function lengthOfLongestSubstring(s) {
        // Write your code here
    };`,
      },
      testCases: [
        {
          input: "abcabcbb",
          output: "3",
        },
        {
          input: '"bbbbb"',
          output: "1",
        },
        {
          input: '"pwwkew"',
          output: "3",
        },
      ],
    },
    {
      id: "4",
      name: "Merge Two Sorted Lists",
      difficulty: "Easy",
      description:
        "You are given the heads of two sorted linked lists list1 and list2.\n\nMerge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.",
      examples: [
        {
          input: "list1 = [1,2,4], list2 = [1,3,4]",
          output: "[1,1,2,3,4,4]",
        },
        {
          input: "list1 = [], list2 = []",
          output: "[]",
        },
        {
          input: "list1 = [], list2 = [0]",
          output: "[0]",
        },
      ],
      constraints: [
        "The number of nodes in both lists is in the range [0, 50].",
        "-100 <= Node.val <= 100",
        "Both list1 and list2 are sorted in non-decreasing order.",
      ],
      starterCode: {
        javascript: `/**
     * Definition for singly-linked list.
     * function ListNode(val, next) {
     *     this.val = (val===undefined ? 0 : val)
     *     this.next = (next===undefined ? null : next)
     * }
     */
    /**
     * @param {ListNode} list1
     * @param {ListNode} list2
     * @return {ListNode}
     */
    function mergeTwoLists(list1, list2) {
        // Write your code here
    };`,
      },
      testCases: [
        {
          input: "[1,2,4]\n[1,3,4]",
          output: "[1,1,2,3,4,4]",
        },
        {
          input: "[]\n[]",
          output: "[]",
        },
        {
          input: "[]\n[0]",
          output: "[0]",
        },
      ],
    },
    {
      id: "5",
      name: "Maximum Subarray",
      difficulty: "Medium",
      description:
        "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
      examples: [
        {
          input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
          output: "6",
          explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
        },
        {
          input: "nums = [1]",
          output: "1",
        },
        {
          input: "nums = [5,4,-1,7,8]",
          output: "23",
        },
      ],
      constraints: ["1 <= nums.length <= 105", "-104 <= nums[i] <= 104"],
      starterCode: {
        javascript: `/**
     * @param {number[]} nums
     * @return {number}
     */
    function maxSubArray(nums) {
        // Write your code here
    };`,
      },
      testCases: [
        {
          input: "[-2,1,-3,4,-1,2,1,-5,4]",
          output: "6",
        },
        {
          input: "[1]",
          output: "1",
        },
        {
          input: "[5,4,-1,7,8]",
          output: "23",
        },
      ],
    },
    {
      id: "6",
      name: "Reverse Linked List",
      difficulty: "Easy",
      description:
        "Given the head of a singly linked list, reverse the list, and return the reversed list.",
      examples: [
        {
          input: "head = [1,2,3,4,5]",
          output: "[5,4,3,2,1]",
        },
        {
          input: "head = [1,2]",
          output: "[2,1]",
        },
        {
          input: "head = []",
          output: "[]",
        },
      ],
      constraints: [
        "The number of nodes in the list is the range [0, 5000].",
        "-5000 <= Node.val <= 5000",
      ],
      starterCode: {
        javascript: `/**
     * Definition for singly-linked list.
     * function ListNode(val, next) {
     *     this.val = (val===undefined ? 0 : val)
     *     this.next = (next===undefined ? null : next)
     * }
     */
    /**
     * @param {ListNode} head
     * @return {ListNode}
     */
    function reverseList(head) {
        // Write your code here
    };`,
      },
      testCases: [
        {
          input: "[1,2,3,4,5]",
          output: "[5,4,3,2,1]",
        },
        {
          input: "[1,2]",
          output: "[2,1]",
        },
        {
          input: "[]",
          output: "[]",
        },
      ],
    },
  ];