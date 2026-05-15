// Assignment 3: N-Queens Problem using Branch and Bound / Backtracking
// Implement a solution for a Constraint Satisfaction Problem
// using Branch and Bound and Backtracking for n-queens problem
// Linux/Ubuntu: g++ -std=c++17 Assignment3_NQueens.cpp -o Assignment3_NQueens && ./Assignment3_NQueens
// Fedora: sudo dnf install gcc-c++ && g++ -std=c++17 Assignment3_NQueens.cpp -o Assignment3_NQueens && ./Assignment3_NQueens

#include <iostream>
using namespace std;

int board[20];  // board[i] = column of queen in row i

// Check if placing queen at (row, col) is safe
bool isSafe(int row, int col, int n) {
    for (int i = 0; i < row; i++) {
        // Same column
        if (board[i] == col) return false;
        // Same diagonal
        if (abs(board[i] - col) == abs(i - row)) return false;
    }
    return true;
}

// Solve using backtracking
bool solve(int row, int n) {
    if (row == n) return true;  // All queens placed

    for (int col = 0; col < n; col++) {
        if (isSafe(row, col, n)) {
            board[row] = col;           // Place queen
            if (solve(row + 1, n))
                return true;
            board[row] = -1;            // Backtrack
        }
    }
    return false;
}

// Print the board
void printBoard(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (board[i] == j)
                cout << " Q ";
            else
                cout << " . ";
        }
        cout << endl;
    }
    cout << endl;
}

int main() {
    int n;
    cout << "Enter number of queens (N): ";
    cin >> n;

    // Initialize board
    for (int i = 0; i < n; i++) board[i] = -1;

    cout << "\n=== " << n << "-Queens Problem using Backtracking ===" << endl << endl;

    if (solve(0, n)) {
        cout << "Solution found for " << n << "-Queens:" << endl << endl;
        printBoard(n);
        cout << "Queen positions (row, col):" << endl;
        for (int i = 0; i < n; i++)
            cout << "  Row " << i + 1 << ": Column " << board[i] + 1 << endl;
    } else {
        cout << "No solution exists for " << n << "-Queens!" << endl;
    }

    return 0;
}

// Sample Input:
// 4
// Sample Output:
//  .  Q  .  .
//  .  .  .  Q
//  Q  .  .  .
//  .  .  Q  .
