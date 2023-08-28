export class Validation {
  private value: any;

  private constructor(value: any) {
    this.value = value;
  }

  static get(value: any): Validation {
    return new Validation(value);
  }

  toLowerCase(): Validation {
    this.value = this.value.toLowerCase();
    return this;
  }

  trim(): Validation {
    this.value = this.value.trim();
    return this;
  }

  toDate(): Validation {
    this.value = new Date(this.value);
    return this;
  }

  toBoolean(): Validation {
    if (this.value && this.value.hasOnwProperty('length')) {
      this.value = this.value.toLowerCase();
    }

    this.value = this.value === 'true' || this.value === '1' ? true : false;

    return this;
  }

  toNumber(min = 1, max?: number): Validation {
    let newValue: number = Number.parseInt(
      this.value || String(this.value),
      10,
    );

    if (Number.isNaN(newValue)) {
      newValue = this.value;
    }

    if (min) {
      if (newValue < min) {
        newValue = min;
      }

      if (newValue > max) {
        newValue = max;
      }
    }

    this.value = newValue;

    return this;
  }

  build(): any {
    return this.value;
  }
}
