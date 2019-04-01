import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { VelovService } from '../velov.service';
import { Velov } from '../velov';

@Component({
  selector: 'app-velov',
  templateUrl: './velov.component.html',
  styleUrls: ['./velov.component.css']
})
export class VelovComponent implements OnInit {
  coordinates: ICoordinate[] = [];
  searchFormGroup: FormGroup;
  stationVelov: Velov[] = [];
  displayedColumns = ['name', 'Velos', 'Stand'];
  lat = 45.735486;
  lng = 4.883498;
  locationChosen = false;

  constructor(private velovService: VelovService) {}

  ngOnInit() {
    this.initForm();
  }

  onChoseLocation(event) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    this.locationChosen = true;
  }

  getVelov() {
    const result = this.searchFormGroup.get('search').value;
    this.velovService.getVelov(result);
    this.velovService.getVelovUpdated().subscribe((velovUpdated: Velov[]) => {
      console.log(velovUpdated);
      this.stationVelov = velovUpdated;
      let res: ICoordinate = { lat: null, lng: null };
      this.coordinates = velovUpdated.map((oneVelovUpdated: Velov) => {
        oneVelovUpdated.geometry.coordinates.map((coordinate, number) => {
          if (number % 2 === 0) {
            res = { ...res, lng: coordinate };
          } else {
            res = { ...res, lat: coordinate };
          }
        });
        return res;
      });
    });
  }

  initForm() {
    this.searchFormGroup = new FormGroup({
      search: new FormControl('')
    });
  }
}

export interface ICoordinate {
  lat: number;
  lng: number;
}

export interface IVelovSearchCriteria {
  search: string;
}
