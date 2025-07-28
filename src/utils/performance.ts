import React from 'react';
import { InteractionManager } from 'react-native';

// Debounce utility for input fields
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

// Throttle utility for API calls
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Run after interactions complete
export const runAfterInteractions = (callback: () => void): void => {
  InteractionManager.runAfterInteractions(callback);
};

// Batch async operations
export const batchAsync = async <T>(
  operations: (() => Promise<T>)[],
  batchSize: number = 3
): Promise<T[]> => {
  const results: T[] = [];

  for (let i = 0; i < operations.length; i += batchSize) {
    const batch = operations.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(op => op()));
    results.push(...batchResults);
  }

  return results;
};

// Memory-efficient list rendering
export const getItemLayout = (data: any[], index: number, itemHeight: number) => ({
  length: itemHeight,
  offset: itemHeight * index,
  index,
});

// Image optimization
export const optimizeImageUri = (uri: string, width: number, height: number): string => {
  // Add image optimization parameters if using a CDN
  return uri;
};

// Performance monitoring
class PerformanceMonitor {
  private marks: Map<string, number> = new Map();

  mark(name: string): void {
    this.marks.set(name, Date.now());
  }

  measure(name: string, startMark: string): number {
    const startTime = this.marks.get(startMark);
    if (!startTime) {
      console.warn(`Start mark '${startMark}' not found`);
      return 0;
    }

    const duration = Date.now() - startTime;

    if (__DEV__) {
      console.log(`Performance: ${name} took ${duration}ms`);
    }

    return duration;
  }

  clear(): void {
    this.marks.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// React performance utilities
export const shouldComponentUpdate = <T extends Record<string, any>>(
  prevProps: T,
  nextProps: T,
  keys?: (keyof T)[]
): boolean => {
  const keysToCheck = keys || Object.keys(nextProps) as (keyof T)[];

  return keysToCheck.some(key => prevProps[key] !== nextProps[key]);
};

// Lazy loading utility
export const createLazyComponent = <T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> => {
  return React.lazy(componentImport);
};

// Memory usage tracking (development only)
export const trackMemoryUsage = (label: string): void => {
  if (__DEV__ && global.performance && (global.performance as any).memory) {
    const memory = (global.performance as any).memory;
    console.log(`Memory Usage (${label}):`, {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + ' MB',
    });
  }
};
