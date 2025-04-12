"use client";
import { WebContainer, type WebContainerProcess } from '@webcontainer/api';
import { useEffect, useState, useRef } from 'react';

interface PreviewFrameProps {
  webContainer: WebContainer | null;
  onUrlReady?: (url: string) => void;
  onError?: (error: Error) => void;
}

export function PreviewFrame({ webContainer, onUrlReady, onError }: PreviewFrameProps) {
  const [status, setStatus] = useState<'idle' | 'installing' | 'starting' | 'ready' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const processRef = useRef<WebContainerProcess | null>(null);

  useEffect(() => {
    // Check cross-origin isolation immediately
    if (!self.crossOriginIsolated) {
      const error = new Error(
        'Cross-origin isolation required. Ensure your Next.js config has COOP/COEP headers.'
      );
      setStatus('error');
      setErrorMessage(error.message);
      onError?.(error);
      return;
    }

    if (!webContainer) return;

    const controller = new AbortController();
    let installProcess: WebContainerProcess | null = null;
    let devProcess: WebContainerProcess | null = null;

    async function startDevServer() {
      try {
        setStatus('installing');
        setErrorMessage(null);

        // Install dependencies
        installProcess = await webContainer.spawn('npm', ['install'], {
          signal: controller.signal,
        });
        processRef.current = installProcess;

        await installProcess.exit;
        if (controller.signal.aborted) return;

        // Start dev server
        setStatus('starting');
        devProcess = await webContainer.spawn('npm', ['run', 'dev'], {
          signal: controller.signal,
        });
        processRef.current = devProcess;

        // Pipe logs to console
        const writableStream = new WritableStream({
          write(chunk) {
            console.log('[dev]', chunk);
          },
        });
        devProcess.output.pipeTo(writableStream);

        // Wait for server-ready event
        webContainer.on('server-ready', (port, serverUrl) => {
          if (controller.signal.aborted) return;
          setUrl(serverUrl);
          setStatus('ready');
          onUrlReady?.(serverUrl);
        });

        // Handle process exit
        devProcess.exit.then((code) => {
          if (code !== 0 && !controller.signal.aborted) {
            throw new Error(`Dev server exited with code ${code}`);
          }
        });

      } catch (error) {
        if (controller.signal.aborted) return;
        setStatus('error');
        const message = error instanceof Error ? error.message : 'Failed to start dev server';
        setErrorMessage(message);
        onError?.(error instanceof Error ? error : new Error(message));
        console.error('WebContainer error:', error);
      }
    }

    startDevServer();

    return () => {
      controller.abort();
      processRef.current?.kill();
      installProcess?.kill();
      devProcess?.kill();
    };
  }, [webContainer, onUrlReady, onError]);

  if (!self.crossOriginIsolated) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-medium text-red-600 mb-2">
            Cross-Origin Isolation Required
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            This feature requires special security headers that aren't enabled.
            Ensure your Next.js config has these headers configured:
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {`Cross-Origin-Opener-Policy: same-origin\nCross-Origin-Embedder-Policy: require-corp`}
          </pre>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600 mb-2">
            Failed to Start Preview
          </h3>
          <p className="text-sm text-gray-600">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-2 bg-gray-50 border-b">
        <div className="flex items-center space-x-2">
          <span className="flex h-3 w-3 rounded-full bg-red-500"></span>
          <span className="flex h-3 w-3 rounded-full bg-yellow-500"></span>
          <span className="flex h-3 w-3 rounded-full bg-green-500"></span>
        </div>
        <div className="text-xs text-gray-500">
          {status === 'idle' && 'Initializing...'}
          {status === 'installing' && 'Installing dependencies...'}
          {status === 'starting' && 'Starting dev server...'}
          {status === 'ready' && 'Ready'}
        </div>
      </div>
      
      {status !== 'ready' ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-500 capitalize">
              {status.replace(/-/g, ' ')}...
            </p>
          </div>
        </div>
      ) : url ? (
        <iframe
          src={url}
          className="flex-1 w-full border-0"
          allow="cross-origin-isolated"
          sandbox="allow-same-origin allow-scripts allow-popups"
          title="WebContainer Preview"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : null}
    </div>
  );
}