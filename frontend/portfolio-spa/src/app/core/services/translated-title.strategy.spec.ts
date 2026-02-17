import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot } from '@angular/router';
import { TranslatedTitleStrategy } from './translated-title.strategy';

describe('TranslatedTitleStrategy', () => {
  let strategy: TranslatedTitleStrategy;
  let titleService: Title;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    strategy = TestBed.inject(TranslatedTitleStrategy);
    titleService = TestBed.inject(Title);
  });

  it('should create', () => {
    expect(strategy).toBeTruthy();
  });

  it('should set translated title from route', () => {
    const mockSnapshot = {
      root: {
        title: 'pageTitle.home',
        children: [],
        routeConfig: { title: 'pageTitle.home' },
        firstChild: null,
      },
    } as unknown as RouterStateSnapshot;

    vi.spyOn(strategy, 'buildTitle').mockReturnValue('pageTitle.home');
    const titleSpy = vi.spyOn(titleService, 'setTitle');

    strategy.updateTitle(mockSnapshot);

    expect(titleSpy).toHaveBeenCalledWith('Home — Portfolio');
  });

  it('should not set title when route has no title', () => {
    const mockSnapshot = {
      root: {
        title: undefined,
        children: [],
        routeConfig: {},
        firstChild: null,
      },
    } as unknown as RouterStateSnapshot;

    vi.spyOn(strategy, 'buildTitle').mockReturnValue(undefined);
    const titleSpy = vi.spyOn(titleService, 'setTitle');

    strategy.updateTitle(mockSnapshot);

    expect(titleSpy).not.toHaveBeenCalled();
  });
});
