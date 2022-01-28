#include "bits/stdc++.h"
#define endl '\n'

using namespace std;
using ll = long long;

struct RAND {
    random_device rg;
    mt19937 rd;
    RAND() { rd.seed(rg()); }
    int nxtInt(int l, int r) { return uniform_int_distribution<int>(l, r)(rd); }
    double nxtDouble(double l, double r) { return uniform_real_distribution<double>(l, r)(rd); }
} rnd;

int main() {
    ios::sync_with_stdio(0); cin.tie(0);
//    freopen("input.txt", "r", stdin);
    
    int n = 50;
    for(int i=1; i<=n; i++) {
        cout << rnd.nxtInt(1, 200) << ' '<< rnd.nxtInt(1, 200) << endl;
    }
}
