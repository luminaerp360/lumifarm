import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { PropertiesService } from '../../../shared/services/properties/properties.service';
import { ThemeService } from '../../../shared/services/theme/theme.service';
import { Property } from '../../../shared/interfaces/models';

@Component({
  selector: 'app-property-form',
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss'],
})
export class PropertyFormComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() property: Property | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Property>();

  loading = false;
  error = '';

  form: Partial<Property> = {
    name: '', description: '', type: 'apartment', status: 'available',
    address: '', city: '', county: '', rentAmount: 0, depositAmount: 0,
    currency: 'KES', bedrooms: 1, bathrooms: 1, squareFootage: 0,
    amenities: [], unitNumber: '', floor: 0, buildingName: '',
  };

  typeOptions = ['apartment', 'house', 'commercial', 'land', 'bedsitter', 'single_room', 'one_bedroom', 'two_bedroom', 'three_bedroom'];
  statusOptions = ['available', 'occupied', 'maintenance', 'unavailable'];
  newAmenity = '';

  constructor(
    private propertiesService: PropertiesService,
    public themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    if (this.property) {
      this.form = { ...this.property };
    }
  }

  ngOnChanges(): void {
    if (this.property) {
      this.form = { ...this.property };
    } else if (!this.isOpen) {
      this.resetForm();
    }
  }

  addAmenity(): void {
    if (this.newAmenity.trim()) {
      if (!this.form.amenities) this.form.amenities = [];
      this.form.amenities.push(this.newAmenity.trim());
      this.newAmenity = '';
    }
  }

  removeAmenity(i: number): void {
    this.form.amenities?.splice(i, 1);
  }

  onSubmit(): void {
    if (!this.form.name) {
      this.error = 'Property name is required';
      return;
    }

    this.loading = true;
    this.error = '';

    const request = this.property?._id
      ? this.propertiesService.update(this.property._id, this.form)
      : this.propertiesService.create(this.form as Property);

    request.subscribe({
      next: (savedProperty) => {
        this.loading = false;
        this.save.emit(savedProperty);
        this.closeModal();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to save property';
      },
    });
  }

  closeModal(): void {
    this.resetForm();
    this.close.emit();
  }

  resetForm(): void {
    this.form = {
      name: '', description: '', type: 'apartment', status: 'available',
      address: '', city: '', county: '', rentAmount: 0, depositAmount: 0,
      currency: 'KES', bedrooms: 1, bathrooms: 1, squareFootage: 0,
      amenities: [], unitNumber: '', floor: 0, buildingName: '',
    };
    this.error = '';
    this.newAmenity = '';
  }

  get isEditMode(): boolean {
    return !!this.property?._id;
  }
}
