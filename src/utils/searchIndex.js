function binarySearch(arr, str, comparable) {
  let l = 0;
  let r = arr.length;
  let m;
  let match;
  while (l <= r) {
    m = Math.floor((l + r) / 2);
    match = comparable(str, arr[m]);
    if (match === 0) return m;
    else if (match < 0) {
      r = m - 1;
    } else {
      l = m + 1;
    }
  }
  return -1;
}

module.exports = binarySearch;
