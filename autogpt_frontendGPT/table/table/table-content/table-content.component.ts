import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExportService } from '../../../services/export.service';

@Component({
  selector: 'app-table-content',
  templateUrl: './table-content.component.html',
  styleUrls: ['./table-content.component.scss']
})
export class TableContentComponent implements OnInit {

  selectedItems: any[] = [];

  @Input() headers: string[];
  @Input() columnHeaders: any;
  @Input() data: any[];
  @Input() dataXls: any;
  @Input() helpUrl: string;
  @Output() scrolling: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectionItems: EventEmitter<any> = new EventEmitter<any>();

  public selector: string = '.content-slice-table';
  constructor(
    private exportService: ExportService,
  ) { }

  ngOnInit(): void {
  }

  isSelected(item: any): boolean {
    return this.selectedItems.includes(item);
  }

  toggleSelection(item: any) {
    if (this.isSelected(item)) {
      this.selectedItems = this.selectedItems.filter(r => r !== item);
    } else {
      this.selectedItems.push(item);
      console.log(this.selectedItems)
      this.selectionItems.emit(this.selectedItems)
    }
  }

  export() {
    this.exportService.exportExcel(this.dataXls.data, this.dataXls.fileName);
  }

  onScroll() {
    this.scrolling.emit()
  }

}