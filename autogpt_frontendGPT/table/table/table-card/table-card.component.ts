import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table-card',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.scss'],
})
export class TableCardComponent {

  @Input() headers: string[];
  @Input() columnHeaders: any;
  @Input() data: any[];
  @Input() helpUrl: string;
  @Output() scrolling: EventEmitter<any> = new EventEmitter<any>();

	active = 1;
  constructor() { }

  ngOnInit(): void {
  }

}