// Assignment 1: DFS and BFS on Undirected Graph
// Implement depth first search and breadth first search algorithm
// Use an undirected graph and develop a recursive algorithm
// Linux/Ubuntu: g++ -std=c++17 Assignment1_DFS_BFS.cpp -o Assignment1_DFS_BFS && ./Assignment1_DFS_BFS
// Fedora: sudo dnf install gcc-c++ && g++ -std=c++17 Assignment1_DFS_BFS.cpp -o Assignment1_DFS_BFS && ./Assignment1_DFS_BFS

#include <iostream>
#include <vector>
#include <queue>
#include <set>
#include <algorithm>
using namespace std;

vector<int> adj[20];   // adjacency list
set<int> visited ;
// set<int> visited ;
 
// --- DFS (Recursive) ---
void dfs(int node) {
    visited.insert(node);
    cout << node << " ";
    vector<int> neighbors = adj[node];
    sort(neighbors.begin(), neighbors.end());
    for (int neighbor : neighbors) {
        if (visited.find(neighbor) == visited.end()) {
            dfs(neighbor);
        }
    }
}

// --- BFS (Iterative using Queue) ---
void bfs(int start) {
    set<int> vis;
    queue<int> q;
    q.push(start);
    vis.insert(start);
    cout << "BFS Traversal: ";
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        cout << node << " ";
        vector<int> neighbors = adj[node];
        sort(neighbors.begin(), neighbors.end());
        for (int neighbor : neighbors) {
            if (vis.find(neighbor) == vis.end()) {
                vis.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
    cout << endl;
}

// --- Main ---
int main() {
    int edges, u, v, start;

    cout << "Enter number of edges: ";
    cin >> edges;

    for (int i = 0; i < edges; i++) {
        cout << "Enter edge " << i + 1 << " (u v): ";
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);  // undirected
    }

    cout << "\nEnter starting node: ";
    cin >> start;

    cout << endl;
    bfs(start);

    visited.clear();
    cout << "DFS Traversal: ";
    dfs(start);
    cout << endl;

    return 0;
}

// Sample Input:
// 5
// 0 1
// 0 2
// 1 3
// 2 4
// 3 4
// 0
// Sample Output Traversal:
// BFS: 0 1 2 3 4
// DFS: 0 1 3 4 2
