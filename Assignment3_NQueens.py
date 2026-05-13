# Assignment 3: N-Queens Problem using Branch and Bound / Backtracking
# Implement a solution for a Constraint Satisfaction Problem
# using Branch and Bound and Backtracking for n-queens problem

def is_safe(board, row, col, n):
    """Check if placing queen at (row, col) is safe"""
    # Check column
    for i in range(row):
        if board[i] == col:
            return False
    
    # Check upper-left diagonal
    for i, j in zip(range(row-1, -1, -1), range(col-1, -1, -1)):
        if board[i] == j:
            return False
    
    # Check upper-right diagonal
    for i, j in zip(range(row-1, -1, -1), range(col+1, n)):
        if board[i] == j:
            return False
    
    return True

def solve_nqueens(board, row, n):
    """Solve N-Queens using backtracking"""
    if row == n:
        return True  # All queens placed
    
    for col in range(n):
        if is_safe(board, row, col, n):
            board[row] = col  # Place queen
            if solve_nqueens(board, row + 1, n):
                return True
            board[row] = -1  # Backtrack
    
    return False

def print_board(board, n):
    """Print the chessboard"""
    for i in range(n):
        row = ""
        for j in range(n):
            if board[i] == j:
                row += " Q "
            else:
                row += " . "
        print(row)
    print()

# --- Main ---
if __name__ == "__main__":
    n = int(input("Enter number of queens (N): "))
    
    # board[i] = column position of queen in row i
    board = [-1] * n
    
    print(f"\n=== {n}-Queens Problem using Backtracking ===\n")
    
    if solve_nqueens(board, 0, n):
        print(f"Solution found for {n}-Queens:\n")
        print_board(board, n)
        print("Queen positions (row, col):")
        for i in range(n):
            print(f"  Row {i+1}: Column {board[i]+1}")
    else:
        print(f"No solution exists for {n}-Queens!")

# Sample: N=4
# Output:
#  .  Q  .  .
#  .  .  .  Q
#  Q  .  .  .
#  .  .  Q  .
