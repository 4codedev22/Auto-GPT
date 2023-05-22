import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableExportComponent } from './table-export.component';

describe('TableExportComponent', () => {
  let component: TableExportComponent;
  let fixture: ComponentFixture<TableExportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableExportComponent]
    });
    fixture = TestBed.createComponent(TableExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
