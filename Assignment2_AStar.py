# Assignment 2: A* Algorithm for 8-Puzzle Problem
# Implement A star Algorithm for any game search problem

import heapq

# Goal state
goal = [[1, 2, 3],
        [4, 5, 6],
        [7, 8, 0]]  # 0 = blank

def find_blank(state):
    for i in range(3):
        for j in range(3):
            if state[i][j] == 0:
                return i, j

def heuristic(state):
    """Count misplaced tiles (excluding blank)"""
    count = 0
    for i in range(3):
        for j in range(3):
            if state[i][j] != 0 and state[i][j] != goal[i][j]:
                count += 1
    return count

def get_neighbors(state):
    neighbors = []
    i, j = find_blank(state)
    moves = [(-1,0), (1,0), (0,-1), (0,1)]  # up, down, left, right
    
    for di, dj in moves:
        ni, nj = i + di, j + dj
        if 0 <= ni < 3 and 0 <= nj < 3:
            new_state = [row[:] for row in state]  # deep copy
            new_state[i][j], new_state[ni][nj] = new_state[ni][nj], new_state[i][j]
            neighbors.append(new_state)
    return neighbors

def state_to_tuple(state):
    return tuple(tuple(row) for row in state)

def print_state(state):
    for row in state:
        print(row)
    print()

def a_star(start):
    g = 0
    h = heuristic(start)
    f = g + h
    
    # Priority queue: (f, g, state, path)
    open_list = [(f, g, start, [start])]
    closed_set = set()
    
    while open_list:
        f, g, current, path = heapq.heappop(open_list)
        
        if current == goal:
            print(f"Solution found in {g} moves!")
            print(f"States explored: {len(closed_set)}\n")
            for i, state in enumerate(path):
                print(f"Step {i}:")
                print_state(state)
            return True
        
        state_tuple = state_to_tuple(current)
        if state_tuple in closed_set:
            continue
        closed_set.add(state_tuple)
        
        for neighbor in get_neighbors(current):
            if state_to_tuple(neighbor) not in closed_set:
                new_g = g + 1
                new_h = heuristic(neighbor)
                new_f = new_g + new_h
                heapq.heappush(open_list, (new_f, new_g, neighbor, path + [neighbor]))
    
    print("No solution found!")
    return False

# --- Main ---
if __name__ == "__main__":
    print("=== A* Algorithm - 8 Puzzle Problem ===\n")
    print("Enter puzzle (use 0 for blank):")
    start = []
    for i in range(3):
        row = list(map(int, input(f"Row {i+1}: ").split()))
        start.append(row)
    
    print("\nInitial State:")
    print_state(start)
    print("Goal State:")
    print_state(goal)
    
    a_star(start)

# Sample Input:
# 1 2 3
# 4 0 6
# 7 5 8
# (Solves in 2 moves: swap 5 up, swap 6 left)
