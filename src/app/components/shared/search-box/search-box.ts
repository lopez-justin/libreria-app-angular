import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-box.html',
  styleUrl: './search-box.css'
})
export class SearchBox {
  @Input() placeholder: string = 'Buscar...';
  @Input() disabled: boolean = false;
  @Input() debounceTime: number = 300;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  
  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  searchTerm: string = '';
  private timeoutId: any;

  onInputChange(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      if (this.searchTerm.trim()) {
        this.search.emit(this.searchTerm.trim());
      } else {
        this.clear.emit();
      }
    }, this.debounceTime);
  }

  onClear(): void {
    this.searchTerm = '';
    this.clear.emit();
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.search.emit(this.searchTerm.trim());
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}