import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ColumnConfig {
  key: string;
  header: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'image' | 'badge';
  format?: (value: any) => string;
  width?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css'
})
export class DataTable implements OnInit {
  @Input() columns: ColumnConfig[] = [];
  @Input() data: any[] = [];
  @Input() loading: boolean = false;
  @Input() pageSize: number = 10;
  @Input() showPagination: boolean = true;
  @Input() showSearch: boolean = true;
  @Input() emptyMessage: string = 'No se encontraron datos';
  
  @Output() rowClick = new EventEmitter<any>();
  @Output() editClick = new EventEmitter<any>();
  @Output() deleteClick = new EventEmitter<any>();
  @Output() viewClick = new EventEmitter<any>();

  filteredData: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  Math = Math;

  ngOnInit(): void {
    this.filteredData = [...this.data];
    this.updatePagination();
  }

  ngOnChanges(): void {
    this.filteredData = [...this.data];
    this.updatePagination();
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase();
    this.currentPage = 1;
    
    if (!this.searchTerm) {
      this.filteredData = [...this.data];
    } else {
      this.filteredData = this.data.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(this.searchTerm)
        )
      );
    }
    
    this.updatePagination();
  }

  sort(column: ColumnConfig): void {
    if (!column.sortable) return;
    
    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }

    this.filteredData.sort((a, b) => {
      const aValue = a[column.key];
      const bValue = b[column.key];
      
      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredData.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  formatCell(value: any, column: ColumnConfig): string {
    if (column.format) {
      return column.format(value);
    }
    
    switch (column.type) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'boolean':
        return value ? 'Sí' : 'No';
      case 'number':
        return value?.toLocaleString() || '0';
      default:
        return String(value || '');
    }
  }

  
  onRowClick(item: any): void {
    console.log('DataTable - Row clicked:', item);
    this.rowClick.emit(item);
  }

  onEditClick(item: any, event: Event): void {
    console.log('DataTable - Edit clicked:', item);
    event.stopPropagation();
    this.editClick.emit(item);
  }

  onDeleteClick(item: any, event: Event): void {
    console.log('DataTable - Delete clicked:', item);
    event.stopPropagation();
    this.deleteClick.emit(item);
  }

  onViewClick(item: any, event: Event): void {
    console.log('DataTable - View clicked:', item);
    event.stopPropagation();
    this.viewClick.emit(item);
  }

  getSortClass(column: ColumnConfig): string {
    if (this.sortColumn !== column.key) return '';
    return this.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc';
  }
}