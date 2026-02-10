import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let titleService: Title;
  let metaService: Meta;
  let documentRef: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeoService);
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);
    documentRef = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    const jsonLd = documentRef.getElementById('json-ld');
    if (jsonLd) {
      jsonLd.remove();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update page title', () => {
    service.updateMetaTags({ title: 'Test Title' });
    expect(titleService.getTitle()).toBe('Test Title');
  });

  it('should update meta description', () => {
    service.updateMetaTags({ description: 'Test description' });
    const tag = metaService.getTag('name="description"');
    expect(tag?.getAttribute('content')).toBe('Test description');
  });

  it('should update Open Graph tags', () => {
    service.updateMetaTags({
      title: 'OG Title',
      description: 'OG Description',
      url: 'https://example.com',
    });

    const ogTitle = metaService.getTag('property="og:title"');
    const ogDesc = metaService.getTag('property="og:description"');
    const ogUrl = metaService.getTag('property="og:url"');
    const ogType = metaService.getTag('property="og:type"');

    expect(ogTitle?.getAttribute('content')).toBe('OG Title');
    expect(ogDesc?.getAttribute('content')).toBe('OG Description');
    expect(ogUrl?.getAttribute('content')).toBe('https://example.com');
    expect(ogType?.getAttribute('content')).toBe('website');
  });

  it('should update Twitter Card tags', () => {
    service.updateMetaTags({ title: 'Twitter Title', description: 'Twitter Description' });

    const card = metaService.getTag('name="twitter:card"');
    const twitterTitle = metaService.getTag('name="twitter:title"');

    expect(card?.getAttribute('content')).toBe('summary_large_image');
    expect(twitterTitle?.getAttribute('content')).toBe('Twitter Title');
  });

  it('should use default config when partial config provided', () => {
    service.updateMetaTags({});
    expect(titleService.getTitle()).toBe('Portfolio — Full Stack Developer');
  });

  it('should set JSON-LD script', () => {
    service.setJsonLd({ '@type': 'Person', name: 'Test' });

    const script = documentRef.getElementById('json-ld');
    expect(script).toBeTruthy();
    expect(script?.getAttribute('type')).toBe('application/ld+json');

    const content = JSON.parse(script?.textContent ?? '{}');
    expect(content['@type']).toBe('Person');
    expect(content['name']).toBe('Test');
  });

  it('should replace existing JSON-LD on subsequent calls', () => {
    service.setJsonLd({ name: 'First' });
    service.setJsonLd({ name: 'Second' });

    const scripts = documentRef.querySelectorAll('#json-ld');
    expect(scripts.length).toBe(1);

    const content = JSON.parse(scripts[0]?.textContent ?? '{}');
    expect(content['name']).toBe('Second');
  });

  it('should set Person schema', () => {
    service.setPersonSchema({
      name: 'John Doe',
      jobTitle: 'Developer',
      url: 'https://example.com',
      sameAs: ['https://github.com/johndoe'],
    });

    const script = documentRef.getElementById('json-ld');
    const content = JSON.parse(script?.textContent ?? '{}');

    expect(content['@context']).toBe('https://schema.org');
    expect(content['@type']).toBe('Person');
    expect(content['name']).toBe('John Doe');
    expect(content['sameAs']).toContain('https://github.com/johndoe');
  });
});
