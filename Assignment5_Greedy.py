# Assignment 5: Greedy Search Algorithms
# Implement Greedy search algorithm for any three of the following:
# I. Selection Sort  II. Prim's MST  III. Dijkstra's Shortest Path

import heapq

# =============================================
# 1. SELECTION SORT (Greedy: always pick minimum)
# =============================================
def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
        print(f"  Step {i+1}: {arr}")
    return arr

# =============================================
# 2. PRIM'S MST (Greedy: pick minimum weight edge)
# =============================================
def prims_mst(graph, n, start=0):
    visited = [False] * n
    mst_edges = []
    total_cost = 0
    
    # Min heap: (weight, from_node, to_node)
    min_heap = [(0, -1, start)]
    
    while min_heap and len(mst_edges) < n:
        weight, frm, to = heapq.heappop(min_heap)
        
        if visited[to]:
            continue
        visited[to] = True
        
        if frm != -1:
            mst_edges.append((frm, to, weight))
            total_cost += weight
            print(f"  Edge: {frm} -- {to}, Weight: {weight}")
        
        for neighbor, w in graph[to]:
            if not visited[neighbor]:
                heapq.heappush(min_heap, (w, to, neighbor))
    
    return mst_edges, total_cost

# =============================================
# 3. DIJKSTRA'S SHORTEST PATH (Greedy: pick nearest)
# =============================================
def dijkstra(graph, n, start):
    dist = [float('inf')] * n
    dist[start] = 0
    visited = [False] * n
    
    # Min heap: (distance, node)
    min_heap = [(0, start)]
    
    while min_heap:
        d, u = heapq.heappop(min_heap)
        
        if visited[u]:
            continue
        visited[u] = True
        
        for neighbor, weight in graph[u]:
            if not visited[neighbor] and dist[u] + weight < dist[neighbor]:
                dist[neighbor] = dist[u] + weight
                heapq.heappush(min_heap, (dist[neighbor], neighbor))
    
    return dist

# =============================================
# MAIN
# =============================================
if __name__ == "__main__":
    while True:
        print("\n" + "=" * 50)
        print("  Greedy Search Algorithms")
        print("=" * 50)
        print("1. Selection Sort")
        print("2. Prim's MST")
        print("3. Dijkstra's Shortest Path")
        print("4. Exit")
        choice = input("Enter choice: ").strip()
        
        if choice == "1":
            print("\n--- Selection Sort ---")
            arr = list(map(int, input("Enter elements (space separated): ").split()))
            print(f"  Original: {arr}")
            selection_sort(arr)
            print(f"  Sorted:   {arr}")
        
        elif choice == "2":
            print("\n--- Prim's MST ---")
            n = int(input("Enter number of vertices: "))
            e = int(input("Enter number of edges: "))
            graph = [[] for _ in range(n)]
            for i in range(e):
                u, v, w = map(int, input(f"Edge {i+1} (u v weight): ").split())
                graph[u].append((v, w))
                graph[v].append((u, w))
            
            print("\nMST Edges:")
            edges, cost = prims_mst(graph, n)
            print(f"\nTotal MST Cost: {cost}")
        
        elif choice == "3":
            print("\n--- Dijkstra's Shortest Path ---")
            n = int(input("Enter number of vertices: "))
            e = int(input("Enter number of edges: "))
            graph = [[] for _ in range(n)]
            for i in range(e):
                u, v, w = map(int, input(f"Edge {i+1} (u v weight): ").split())
                graph[u].append((v, w))
                graph[v].append((u, w))
            
            start = int(input("Enter source vertex: "))
            distances = dijkstra(graph, n, start)
            print(f"\nShortest distances from vertex {start}:")
            for i in range(n):
                print(f"  To vertex {i}: {distances[i]}")
        
        elif choice == "4":
            print("Exiting...")
            break
        else:
            print("Invalid choice!")

# Sample for Prim's/Dijkstra:
# Vertices: 4, Edges: 5
# 0 1 10
# 0 2 6
# 0 3 5
# 1 3 15
# 2 3 4
