import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { TableHeaderComponent } from './table/table-header/table-header.component';
import { TableSelectionComponent } from './table/table-selection/table-selection.component';
import { TableExportComponent } from './table/table-export/table-export.component';
import { TableBodyComponent } from './table/table-body/table-body.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    TableHeaderComponent,
    TableSelectionComponent,
    TableExportComponent,
    TableBodyComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
