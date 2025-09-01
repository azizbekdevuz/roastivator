import { useCallback, useMemo, useRef } from 'react';

/**
 * Custom hook for memoizing expensive computations
 */
export function useComputedValue<T>(
  computeFn: () => T,
  deps: React.DependencyList
): T {
  return useMemo(() => computeFn(), [computeFn, ...deps]);
}

/**
 * Custom debounce hook for performance optimization
 */
export function useDebounced<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static measurements: Map<string, number> = new Map();

  static startMeasurement(name: string): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${name}-start`);
    }
    this.measurements.set(name, Date.now());
  }

  static endMeasurement(name: string): number {
    const startTime = this.measurements.get(name);
    if (!startTime) {
      console.warn(`No start measurement found for: ${name}`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.measurements.delete(name);

    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }

    return duration;
  }

  static logMeasurement(name: string): void {
    const duration = this.endMeasurement(name);
    console.log(`⚡ ${name}: ${duration}ms`);
  }
}

/**
 * Memory usage tracking (for development)
 */
interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface ExtendedPerformance extends Performance {
  memory?: PerformanceMemory;
}

export const trackMemoryUsage = () => {
  if (typeof window !== 'undefined' && 'performance' in window && 'memory' in window.performance) {
    const memory = (window.performance as ExtendedPerformance).memory;
    if (memory) {
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
      };
    }
  }
  return null;
};