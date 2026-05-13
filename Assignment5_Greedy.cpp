// Assignment 5: Greedy Search Algorithms
// Implement Greedy search algorithm for any three of the following:
// I. Selection Sort  II. Prim's MST  III. Dijkstra's Shortest Path

#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

typedef pair<int,int> pii;

// =============================================
// 1. SELECTION SORT (Greedy: always pick minimum)
// =============================================
void selectionSort() {
    int n;
    cout << "\n--- Selection Sort ---" << endl;
    cout << "Enter number of elements: ";
    cin >> n;
    vector<int> arr(n);
    cout << "Enter elements: ";
    for (int i = 0; i < n; i++) cin >> arr[i];

    cout << "  Original: ";
    for (int x : arr) cout << x << " ";
    cout << endl;

    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx])
                minIdx = j;
        swap(arr[i], arr[minIdx]);
        cout << "  Step " << i + 1 << ": ";
        for (int x : arr) cout << x << " ";
        cout << endl;
    }

    cout << "  Sorted:   ";
    for (int x : arr) cout << x << " ";
    cout << endl;
}

// =============================================
// 2. PRIM'S MST (Greedy: pick minimum weight edge)
// =============================================
void primsMST() {
    int n, e;
    cout << "\n--- Prim's MST ---" << endl;
    cout << "Enter number of vertices: ";
    cin >> n;
    cout << "Enter number of edges: ";
    cin >> e;

    vector<vector<pii>> graph(n);
    for (int i = 0; i < e; i++) {
        int u, v, w;
        cout << "Edge " << i + 1 << " (u v weight): ";
        cin >> u >> v >> w;
        graph[u].push_back({v, w});
        graph[v].push_back({u, w});
    }

    vector<bool> visited(n, false);
    // Min heap: (weight, from, to)
    priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>, greater<>> pq;
    pq.push({0, -1, 0});
    int totalCost = 0;

    cout << "\nMST Edges:" << endl;
    while (!pq.empty()) {
        auto [w, frm, to] = pq.top();
        pq.pop();

        if (visited[to]) continue;
        visited[to] = true;

        if (frm != -1) {
            cout << "  Edge: " << frm << " -- " << to << ", Weight: " << w << endl;
            totalCost += w;
        }

        for (auto [neighbor, wt] : graph[to]) {
            if (!visited[neighbor])
                pq.push({wt, to, neighbor});
        }
    }
    cout << "\nTotal MST Cost: " << totalCost << endl;
}

// =============================================
// 3. DIJKSTRA'S SHORTEST PATH (Greedy: pick nearest)
// =============================================
void dijkstra() {
    int n, e, start;
    cout << "\n--- Dijkstra's Shortest Path ---" << endl;
    cout << "Enter number of vertices: ";
    cin >> n;
    cout << "Enter number of edges: ";
    cin >> e;

    vector<vector<pii>> graph(n);
    for (int i = 0; i < e; i++) {
        int u, v, w;
        cout << "Edge " << i + 1 << " (u v weight): ";
        cin >> u >> v >> w;
        graph[u].push_back({v, w});
        graph[v].push_back({u, w});
    }

    cout << "Enter source vertex: ";
    cin >> start;

    vector<int> dist(n, INT_MAX);
    vector<bool> visited(n, false);
    priority_queue<pii, vector<pii>, greater<pii>> pq;

    dist[start] = 0;
    pq.push({0, start});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (visited[u]) continue;
        visited[u] = true;

        for (auto [neighbor, weight] : graph[u]) {
            if (!visited[neighbor] && dist[u] + weight < dist[neighbor]) {
                dist[neighbor] = dist[u] + weight;
                pq.push({dist[neighbor], neighbor});
            }
        }
    }

    cout << "\nShortest distances from vertex " << start << ":" << endl;
    for (int i = 0; i < n; i++)
        cout << "  To vertex " << i << ": " << dist[i] << endl;
}

// =============================================
// MAIN
// =============================================
int main() {
    int choice;
    while (true) {
        cout << "\n==================================================" << endl;
        cout << "  Greedy Search Algorithms" << endl;
        cout << "==================================================" << endl;
        cout << "1. Selection Sort" << endl;
        cout << "2. Prim's MST" << endl;
        cout << "3. Dijkstra's Shortest Path" << endl;
        cout << "4. Exit" << endl;
        cout << "Enter choice: ";
        cin >> choice;

        if (choice == 1) selectionSort();
        else if (choice == 2) primsMST();
        else if (choice == 3) dijkstra();
        else if (choice == 4) { cout << "Exiting..." << endl; break; }
        else cout << "Invalid choice!" << endl;
    }
    return 0;
}

// Sample for Prim's/Dijkstra:
// Vertices: 4, Edges: 5
// 0 1 10
// 0 2 6
// 0 3 5
// 1 3 15
// 2 3 4
//
// Compile: g++ -std=c++17 Assignment5_Greedy.cpp -o a5 && ./a5
