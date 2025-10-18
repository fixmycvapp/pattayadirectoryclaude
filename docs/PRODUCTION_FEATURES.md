# Production Features Documentation

## 🌍 Multilingual Support

### Usage in Components
```typescript
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('nav');
  
  return (
    <h1>{t('events')}</h1>
  );
}