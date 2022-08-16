import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopDomainsComponent } from './top-domains.component';

describe('TopDomainsComponent', () => {
  let component: TopDomainsComponent;
  let fixture: ComponentFixture<TopDomainsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopDomainsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopDomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
