// Assignment 2: A* Algorithm for 8-Puzzle Problem
// Implement A star Algorithm for any game search problem

#include <iostream>
#include <vector>
#include <queue>
#include <set>
using namespace std;

typedef vector<vector<int>> State;

int goal[3][3] = {{1,2,3},{4,5,6},{7,8,0}};  // 0 = blank

// Count misplaced tiles (heuristic)
int heuristic(State &s) {
    int count = 0;
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            if (s[i][j] != 0 && s[i][j] != goal[i][j])
                count++;
    return count;
}

// Find blank position
pair<int,int> findBlank(State &s) {
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            if (s[i][j] == 0) return {i, j};
    return {-1, -1};
}

// Convert state to string for visited set
string stateToString(State &s) {
    string res = "";
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            res += to_string(s[i][j]) + ",";
    return res;
}

void printState(State &s) {
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++)
            cout << s[i][j] << " ";
        cout << endl;
    }
    cout << endl;
}

// Check if state is goal
bool isGoal(State &s) {
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            if (s[i][j] != goal[i][j]) return false;
    return true;
}

struct Node {
    int f, g;
    State state;
    vector<State> path;

    bool operator>(const Node &other) const {
        return f > other.f;
    }
};

void aStar(State start) {
    priority_queue<Node, vector<Node>, greater<Node>> pq;
    set<string> closed;

    int h = heuristic(start);
    pq.push({h, 0, start, {start}});

    while (!pq.empty()) {
        Node curr = pq.top();
        pq.pop();

        if (isGoal(curr.state)) {
            cout << "Solution found in " << curr.g << " moves!" << endl;
            cout << "States explored: " << closed.size() << endl << endl;
            for (int i = 0; i < curr.path.size(); i++) {
                cout << "Step " << i << ":" << endl;
                printState(curr.path[i]);
            }
            return;
        }

        string key = stateToString(curr.state);
        if (closed.count(key)) continue;
        closed.insert(key);

        auto [bi, bj] = findBlank(curr.state);
        int dx[] = {-1, 1, 0, 0};
        int dy[] = {0, 0, -1, 1};

        for (int d = 0; d < 4; d++) {
            int ni = bi + dx[d], nj = bj + dy[d];
            if (ni >= 0 && ni < 3 && nj >= 0 && nj < 3) {
                State next = curr.state;
                swap(next[bi][bj], next[ni][nj]);
                string nkey = stateToString(next);
                if (!closed.count(nkey)) {
                    int ng = curr.g + 1;
                    int nh = heuristic(next);
                    vector<State> npath = curr.path;
                    npath.push_back(next);
                    pq.push({ng + nh, ng, next, npath});
                }
            }
        }
    }
    cout << "No solution found!" << endl;
}

int main() {
    cout << "=== A* Algorithm - 8 Puzzle Problem ===" << endl << endl;
    cout << "Enter puzzle (use 0 for blank):" << endl;

    State start(3, vector<int>(3));
    for (int i = 0; i < 3; i++) {
        cout << "Row " << i + 1 << ": ";
        for (int j = 0; j < 3; j++)
            cin >> start[i][j];
    }

    cout << "\nInitial State:" << endl;
    printState(start);
    cout << "Goal State:" << endl;
    State g = {{1,2,3},{4,5,6},{7,8,0}};
    printState(g);

    aStar(start);
    return 0;
}

// Sample Input:
// 1 2 3
// 4 0 6
// 7 5 8
// (Solves in 2 moves: swap 5 up, swap 6 left)
//
// Compile: g++ -std=c++17 Assignment2_AStar.cpp -o a2 && ./a2
