interface T {
    0: boolean;
    a: string;
    b(): void;
  }
  
  type KeyT = keyof T; // 0 | 'a' | 'b'