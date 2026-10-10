import { AnchorButton, type ButtonVariant } from '@/shared/ui/button';
import { DownloadIcon } from '@/shared/ui/icons';

interface DownloadButtonProps {
  photoId: string;
  variant?: ButtonVariant;
  withLabel?: boolean;
}

export function DownloadButton({ photoId, variant = 'outline', withLabel = false }: DownloadButtonProps) {
  return (
    <AnchorButton
      href={`/photos/${encodeURIComponent(photoId)}/download`}
      rel="nofollow"
      variant={variant}
      iconOnly={!withLabel}
      compactOnMobile={withLabel}
      icon={<DownloadIcon size={withLabel ? 16 : 18} />}
      aria-label={withLabel ? undefined : 'Download photo'}
      title="Download"
    >
      {withLabel ? 'Download' : undefined}
    </AnchorButton>
  );
}
