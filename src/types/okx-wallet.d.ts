interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

interface OKXProvider {
  isOKX?: boolean;
  request(args: RequestArguments): Promise<any>;
  on(eventName: string, listener: (...args: any[]) => void): void;
  removeListener(eventName: string, listener: (...args: any[]) => void): void;
  disconnect?: () => Promise<void>;
}

interface Window {
  okxwallet?: OKXProvider;
}
