import { useEffect, useState } from 'react';
import { SITE_CONFIG } from '../config/siteConfig';

export interface ReleaseInfo {
  version: string;
  downloadUrl: string;
  fileSizeLabel: string;
  loading: boolean;
}

export function useLatestRelease(): ReleaseInfo {
  const [info, setInfo] = useState<ReleaseInfo>({
    version: SITE_CONFIG.fallbackVersion,
    downloadUrl: SITE_CONFIG.fallbackDownloadUrl,
    fileSizeLabel: '~45 MB · Windows x64',
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchLatest() {
      try {
        const res = await fetch(SITE_CONFIG.releasesApiUrl, {
          headers: { Accept: 'application/vnd.github+json' },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const tag: string = data.tag_name || SITE_CONFIG.fallbackVersion;
        const assets: Array<{ name: string; browser_download_url: string; size: number }> =
          Array.isArray(data.assets) ? data.assets : [];

        const installer = assets.find((a) =>
          a.name.toLowerCase().endsWith('.exe')
        );

        if (!cancelled) {
          setInfo({
            version: tag.startsWith('v') ? tag : `v${tag}`,
            downloadUrl: installer?.browser_download_url || SITE_CONFIG.fallbackDownloadUrl,
            fileSizeLabel: installer?.size
              ? `${(installer.size / (1024 * 1024)).toFixed(1)} MB · Windows x64`
              : '~45 MB · Windows x64',
            loading: false,
          });
        }
      } catch {
        if (!cancelled) {
          setInfo((prev) => ({ ...prev, loading: false }));
        }
      }
    }

    fetchLatest();
    return () => {
      cancelled = true;
    };
  }, []);

  return info;
}
