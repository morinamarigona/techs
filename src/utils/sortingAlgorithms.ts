import { Product } from '../types';

export type SortKey = 'emri' | 'cmimi' | 'stoku';
export type SortAlgorithm = 'bubble' | 'shell' | 'quick' | 'heap' | 'radix' | 'merge';
export type SortOrder = 'asc' | 'desc';

function compare(a: Product, b: Product, key: SortKey, order: SortOrder): number {
  let result: number;

  if (key === 'emri') {
    result = a.emri.toLowerCase().localeCompare(b.emri.toLowerCase());
  } else {
    result = a[key] - b[key];
  }

  return order === 'asc' ? result : -result;
}

function swap(arr: Product[], i: number, j: number): void {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

export function bubbleSort(products: Product[], key: SortKey, order: SortOrder): Product[] {
  const arr = [...products];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - 1 - i; j++) {
      if (compare(arr[j], arr[j + 1], key, order) > 0) {
        swap(arr, j, j + 1);
        swapped = true;
      }
    }

    if (!swapped) break;
  }

  return arr;
}

export function shellSort(products: Product[], key: SortKey, order: SortOrder): Product[] {
  const arr = [...products];
  const n = arr.length;
  let gap = Math.floor(n / 2);

  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;

      while (j >= gap && compare(arr[j - gap], temp, key, order) > 0) {
        arr[j] = arr[j - gap];
        j -= gap;
      }

      arr[j] = temp;
    }

    gap = Math.floor(gap / 2);
  }

  return arr;
}

export function quickSort(products: Product[], key: SortKey, order: SortOrder): Product[] {
  const arr = [...products];

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (compare(arr[j], pivot, key, order) <= 0) {
        i++;
        swap(arr, i, j);
      }
    }

    swap(arr, i + 1, high);
    return i + 1;
  }

  function sort(low: number, high: number): void {
    if (low < high) {
      const pivotIndex = partition(low, high);
      sort(low, pivotIndex - 1);
      sort(pivotIndex + 1, high);
    }
  }

  if (arr.length > 0) {
    sort(0, arr.length - 1);
  }

  return arr;
}

export function heapSort(products: Product[], key: SortKey, order: SortOrder): Product[] {
  const arr = [...products];
  const n = arr.length;

  function heapify(size: number, root: number): void {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size && compare(arr[left], arr[largest], key, order) > 0) {
      largest = left;
    }

    if (right < size && compare(arr[right], arr[largest], key, order) > 0) {
      largest = right;
    }

    if (largest !== root) {
      swap(arr, root, largest);
      heapify(size, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    swap(arr, 0, i);
    heapify(i, 0);
  }

  return arr;
}

export function radixSort(products: Product[], key: SortKey, order: SortOrder): Product[] {
  if (products.length === 0) return [];

  const arr = [...products];

  if (key === 'emri') {
    const maxLen = Math.max(...arr.map((p) => p.emri.length));

    for (let pos = maxLen - 1; pos >= 0; pos--) {
      const buckets: Product[][] = Array.from({ length: 256 }, () => []);

      for (const product of arr) {
        const name = product.emri.toLowerCase();
        const charCode = pos < name.length ? name.charCodeAt(pos) : 0;
        buckets[charCode].push(product);
      }

      arr.length = 0;
      for (const bucket of buckets) {
        arr.push(...bucket);
      }
    }

    if (order === 'desc') {
      arr.reverse();
    }

    return arr;
  }

  const getValue = (product: Product) =>
    key === 'cmimi' ? Math.round(product.cmimi * 100) : product.stoku;

  const maxVal = Math.max(...arr.map(getValue));
  const maxDigits = maxVal === 0 ? 1 : Math.floor(Math.log10(maxVal)) + 1;

  for (let exp = 1; exp <= Math.pow(10, maxDigits - 1); exp *= 10) {
    const buckets: Product[][] = Array.from({ length: 10 }, () => []);

    for (const product of arr) {
      const digit = Math.floor(getValue(product) / exp) % 10;
      buckets[digit].push(product);
    }

    arr.length = 0;
    for (const bucket of buckets) {
      arr.push(...bucket);
    }
  }

  if (order === 'desc') {
    arr.reverse();
  }

  return arr;
}

export function mergeSort(products: Product[], key: SortKey, order: SortOrder): Product[] {
  function merge(left: Product[], right: Product[]): Product[] {
    const result: Product[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      if (compare(left[i], right[j], key, order) <= 0) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
  }

  function sort(items: Product[]): Product[] {
    if (items.length <= 1) return items;

    const mid = Math.floor(items.length / 2);
    const left = sort(items.slice(0, mid));
    const right = sort(items.slice(mid));

    return merge(left, right);
  }

  return sort([...products]);
}

export function sortProducts(
  products: Product[],
  algorithm: SortAlgorithm,
  key: SortKey,
  order: SortOrder
): Product[] {
  switch (algorithm) {
    case 'bubble':
      return bubbleSort(products, key, order);
    case 'shell':
      return shellSort(products, key, order);
    case 'quick':
      return quickSort(products, key, order);
    case 'heap':
      return heapSort(products, key, order);
    case 'radix':
      return radixSort(products, key, order);
    case 'merge':
      return mergeSort(products, key, order);
    default:
      return [...products];
  }
}
