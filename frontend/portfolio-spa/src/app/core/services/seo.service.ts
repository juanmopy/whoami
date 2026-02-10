import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

interface SeoConfig {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: string;
}

const DEFAULT_CONFIG: SeoConfig = {
  title: 'Portfolio — Full Stack Developer',
  description:
    'Personal portfolio showcasing projects, skills, and experience as a full stack developer.',
  type: 'website',
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  updateMetaTags(config: Partial<SeoConfig>): void {
    const merged = { ...DEFAULT_CONFIG, ...config };

    this.title.setTitle(merged.title);

    this.meta.updateTag({ name: 'description', content: merged.description });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: merged.title });
    this.meta.updateTag({ property: 'og:description', content: merged.description });
    this.meta.updateTag({ property: 'og:type', content: merged.type ?? 'website' });

    if (merged.url) {
      this.meta.updateTag({ property: 'og:url', content: merged.url });
    }

    if (merged.image) {
      this.meta.updateTag({ property: 'og:image', content: merged.image });
    }

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: merged.title });
    this.meta.updateTag({ name: 'twitter:description', content: merged.description });

    if (merged.image) {
      this.meta.updateTag({ name: 'twitter:image', content: merged.image });
    }
  }

  setJsonLd(schema: Record<string, unknown>): void {
    this.removeJsonLd();

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'json-ld';
    script.textContent = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }

  setPersonSchema(personData: {
    name: string;
    jobTitle: string;
    url: string;
    image?: string;
    sameAs?: string[];
  }): void {
    this.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: personData.name,
      jobTitle: personData.jobTitle,
      url: personData.url,
      ...(personData.image && { image: personData.image }),
      ...(personData.sameAs && { sameAs: personData.sameAs }),
    });
  }

  private removeJsonLd(): void {
    const existing = this.document.getElementById('json-ld');
    if (existing) {
      existing.remove();
    }
  }
}
