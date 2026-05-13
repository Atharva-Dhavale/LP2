# Assignment 1: DFS and BFS on Undirected Graph
# Implement depth first search and breadth first search algorithm
# Use an undirected graph and develop a recursive algorithm

from collections import deque

def create_graph():
    graph = {}
    edges = int(input("Enter number of edges: "))
    for i in range(edges):
        u, v = input(f"Enter edge {i+1} (u v): ").split()
        if u not in graph:
            graph[u] = []
        if v not in graph:
            graph[v] = []
        graph[u].append(v)
        graph[v].append(u)  # undirected
    return graph

# --- BFS (Iterative using Queue) ---
def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    print("BFS Traversal: ", end="")
    while queue:
        node = queue.popleft()
        print(node, end=" ")
        for neighbor in sorted(graph.get(node, [])):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    print()

# --- DFS (Recursive) ---
def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()
        print("DFS Traversal: ", end="")
    visited.add(node)
    print(node, end=" ")
    for neighbor in sorted(graph.get(node, [])):
        if neighbor not in visited:
            dfs(graph, neighbor, visited)

# --- Main ---
if __name__ == "__main__":
    graph = create_graph()
    print("\nAdjacency List:")
    for node in graph:
        print(f"  {node} -> {graph[node]}")
    
    start = input("\nEnter starting node: ")
    print()
    bfs(graph, start)
    dfs(graph, start)
    print()

# Sample Input:
# Edges: 5
# A B
# A C
# B D
# C E
# D E
# Start: A
# BFS: A B C D E
# DFS: A B D E C
