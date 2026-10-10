import { LinkButton } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { EmptyState } from '@/shared/ui/empty-state';

export default function NotFound() {
  return (
    <Container>
      <EmptyState
        variant="page"
        code="404"
        title="Page not found"
        description="The photo or page you are looking for does not exist or was removed."
        actions={
          <LinkButton href="/" variant="primary" size="lg">
            Back to the feed
          </LinkButton>
        }
      />
    </Container>
  );
}
