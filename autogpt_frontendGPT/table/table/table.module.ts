import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableContentComponent } from './table-content/table-content.component';
import { TableCardComponent } from './table-card/table-card.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    TableContentComponent,
    TableCardComponent
  ],
  imports: [
    CommonModule,
    InfiniteScrollModule,
    NgbNavModule,
    NgbModule
  ],
  exports: [
    TableContentComponent,
    TableCardComponent
  ]
})
export class TableModule { }
