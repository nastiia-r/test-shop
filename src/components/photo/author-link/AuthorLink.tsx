import { cn } from '@/shared/lib/cn';
import type { Author } from '@/shared/types/photo';
import { Avatar } from '@/shared/ui/avatar';

import styles from './AuthorLink.module.scss';

interface AuthorLinkProps {
  author: Author;
  variant?: 'compact' | 'detailed';
  className?: string;
}

export function AuthorLink({ author, variant = 'compact', className }: AuthorLinkProps) {
  const detailed = variant === 'detailed';

  return (
    <a
      href={author.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(styles.author, styles[variant], className)}
    >
      <Avatar name={author.name} src={author.avatar} size={detailed ? 'md' : 'sm'} />
      <span className={styles.text}>
        <span className={styles.name}>{author.name}</span>
        {detailed && <span className={styles.username}>@{author.username}</span>}
      </span>
    </a>
  );
}
