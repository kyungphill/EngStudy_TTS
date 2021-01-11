import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleListPage } from './article-list.page';

describe('ContactListPage', () => {
  let component: ArticleListPage;
  let fixture: ComponentFixture<ArticleListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
